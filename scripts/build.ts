// Builds the app for a host. Remix 3 compiles browser assets on demand from source, which
// serverless hosts can't do, so this script:
//   1. builds Tailwind CSS,
//   2. snapshots every browser asset the pages reference (asset server, production mode) into
//      dist/client, plus a manifest of script entries for the server,
//   3. bundles the fetch handler with app/assets.ts swapped for app/assets.prebuilt.ts,
//   4. writes the host's output layout (Vercel Build Output API, Netlify function, Worker).
//
// Host: VERCEL=1, NETLIFY=1 or CLOUDFLARE=1 (WORKERS_CI on Workers Builds).
import { execFileSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as esbuild from 'esbuild'

const root = process.cwd()
const env = process.env
const host = env.CLOUDFLARE || env.WORKERS_CI ? 'cloudflare' : env.NETLIFY ? 'netlify' : env.VERCEL ? 'vercel' : null
if (!host) throw new Error('Set VERCEL=1, NETLIFY=1 or CLOUDFLARE=1')

const clientDir = path.join(root, 'dist/client')
fs.rmSync(path.join(root, 'dist'), { force: true, recursive: true })
fs.mkdirSync(clientDir, { recursive: true })

// 1. Tailwind
execFileSync(path.join(root, 'node_modules/.bin/tailwindcss'), [
  '-i', 'app/styles/global.css', '-o', 'app/styles/public/app.css', '--minify',
], { stdio: 'inherit' })

// 2. Snapshot browser assets
env.NODE_ENV = 'production'
const { assets, fontPreloadHrefs, scriptEntry, stylesheetHref } = await import('../app/assets.ts')

const clientEntryFiles = walk(path.join(root, 'app'))
  .filter((file) => /\/public\/[^/]+\.tsx?$/.test(file) && fs.readFileSync(file, 'utf8').includes('clientEntry('))
  .map((file) => path.relative(root, file))

const entries: Record<string, unknown> = {}
const queue = new Set<string>([stylesheetHref, ...fontPreloadHrefs, ...urlsOf(scriptEntry)])
for (const file of clientEntryFiles) {
  const entry = await assets.getScriptEntry(file)
  entries[file] = entry
  for (const url of urlsOf(entry)) queue.add(url)
}

// Asset URLs are rewritten (in file names and in every reference) for static hosts:
// - `.ts`/`.tsx` is served with a non-JavaScript MIME type, so modules get an extra `.js`;
// - Cloudflare redirects a raw `@` (the fingerprint marker) to `%40`;
// - Netlify skips dot-directories (`node_modules/.pnpm`), and `+` is ambiguous in paths.
const assetUrl = /\/assets\/[^"'`()\s]+/g
const tsRelative = /(["'])(\.\.?\/[^"'`\s]+?\.(?:tsx?|mts|jsx))(?=["'])/g
const fixUrl = (url: string) => {
  const encoded = url.replaceAll('@', '%40').replace('/assets/npm/.pnpm/', '/assets/npm/pnpm/').replaceAll('%2B', '__')
  return /\.(?:tsx?|mts|jsx)$/.test(encoded) ? `${encoded}.js` : encoded
}
const toJsUrl = (text: string) => text.replace(assetUrl, fixUrl).replace(tsRelative, '$1$2.js')

const written = new Set<string>()
for (const url of queue) {
  if (written.has(url)) continue
  written.add(url)
  const response = await assets.fetch(new Request(new URL(url, 'http://build.local')))
  if (!response?.ok) {
    console.warn(`skip ${url} (${response?.status ?? 'no response'})`)
    continue
  }
  const type = response.headers.get('content-type') ?? ''
  const isText = /javascript|css|json/.test(type)
  const body = isText ? await response.text() : new Uint8Array(await response.arrayBuffer())
  if (typeof body === 'string') {
    for (const match of body.matchAll(/["'(](\/assets\/[^"'`()\s]+)["')]/g)) queue.add(match[1])
  }
  const outFile = path.join(clientDir, decodeURIComponent(fixUrl(url)))
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, typeof body === 'string' ? toJsUrl(body) : body)
}
await assets.close()
console.log(`snapshotted ${written.size} assets for ${clientEntryFiles.length} client entries`)

const manifest = JSON.parse(toJsUrl(JSON.stringify({ entries, fontPreloadHrefs, scriptEntry, stylesheetHref })))

fs.cpSync(path.join(root, 'public'), clientDir, { recursive: true })

// 3. Bundle the server
const bundleOptions: esbuild.BuildOptions = {
  bundle: true,
  define: { __ASSET_MANIFEST__: JSON.stringify(manifest), 'process.env.NODE_ENV': '"production"' },
  format: 'esm',
  keepNames: true, // clientEntry() uses the component function's name as its export name
  logLevel: 'warning',
  plugins: [prebuiltAssets()],
}

if (host === 'vercel') {
  const out = path.join(root, '.vercel/output')
  fs.rmSync(out, { force: true, recursive: true })
  const funcDir = path.join(out, 'functions/index.func')
  await esbuild.build({
    ...bundleOptions,
    banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
    entryPoints: ['hosts/vercel.ts'],
    outfile: path.join(funcDir, 'index.mjs'),
    platform: 'node',
    target: 'node24',
  })
  writeJson(path.join(funcDir, '.vc-config.json'), {
    handler: 'index.mjs',
    launcherType: 'Nodejs',
    runtime: 'nodejs24.x',
    shouldAddHelpers: false,
    supportsResponseStreaming: true,
  })
  writeJson(path.join(funcDir, 'package.json'), { type: 'module' })
  fs.cpSync(clientDir, path.join(out, 'static'), { recursive: true })
  writeJson(path.join(out, 'config.json'), {
    version: 3,
    routes: [
      // Fingerprinted by the asset server, so safe to cache forever (public/_headers does
      // the same on Netlify and Cloudflare).
      { continue: true, headers: { 'cache-control': 'public, max-age=31536000, immutable' }, src: '^/assets/(.*)$' },
      { handle: 'filesystem' },
      { dest: '/index', src: '/(.*)' },
    ],
  })
}

if (host === 'netlify') {
  const funcDir = path.join(root, 'dist/netlify/functions/server')
  await esbuild.build({
    ...bundleOptions,
    banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
    entryPoints: ['hosts/netlify.ts'],
    outfile: path.join(funcDir, 'app.mjs'),
    platform: 'node',
    target: 'node24',
  })
  // Netlify reads `config` statically from the function's entry file.
  fs.writeFileSync(
    path.join(funcDir, 'server.mjs'),
    `export { default } from './app.mjs'\n\nexport const config = { path: '/*', preferStatic: true }\n`,
  )
}

if (host === 'cloudflare') {
  await esbuild.build({
    ...bundleOptions,
    conditions: ['workerd', 'worker', 'import'],
    entryPoints: ['hosts/cloudflare.ts'],
    external: ['node:*', 'cloudflare:*'],
    mainFields: ['module', 'main'],
    outfile: path.join(root, 'dist/worker/index.js'),
    // Vercel/Netlify cache clients are only imported on their hosts and pull in Node builtins.
    plugins: [...bundleOptions.plugins!, {
      name: 'stub-host-caches',
      setup(build) {
        build.onResolve({ filter: /^@(vercel\/functions|netlify\/blobs)$/ }, (args) => ({ path: args.path, namespace: 'stub' }))
        build.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'export {}', loader: 'js' }))
      },
    }],
    platform: 'neutral',
    target: 'es2024',
  })
}

console.log(`built for ${host}`)

function prebuiltAssets(): esbuild.Plugin {
  const appDir = path.join(root, 'app')
  return {
    name: 'prebuilt-assets',
    setup(build) {
      build.onResolve({ filter: /assets\.ts$/ }, (args) => {
        if (path.resolve(args.resolveDir, args.path) === path.join(appDir, 'assets.ts')) {
          return { path: path.join(appDir, 'assets.prebuilt.ts') }
        }
      })
      // clientEntry(import.meta.url, …) ids must name the source module, not the bundle.
      build.onLoad({ filter: /\/app\/.*\.tsx?$/ }, (args) => {
        const source = fs.readFileSync(args.path, 'utf8')
        const id = `file:///${path.relative(root, args.path)}`
        return {
          contents: source.replaceAll('import.meta.url', JSON.stringify(id)),
          loader: args.path.endsWith('x') ? 'tsx' : 'ts',
        }
      })
    },
  }
}

function urlsOf(entry: { href: string; importMap: { imports?: Record<string, string> }; preloads: string[] }) {
  return [entry.href, ...entry.preloads, ...Object.values(entry.importMap.imports ?? {})]
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

function writeJson(file: string, value: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n')
}
