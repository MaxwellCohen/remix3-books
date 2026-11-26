import { createAssetServer } from 'remix/assets'
import { staticFiles } from 'remix/middleware/static'

// Source-served assets for `pnpm dev` / `pnpm start` on Node. Host builds
// (scripts/build.ts) swap this module for app/assets.prebuilt.ts.
const nodeEnv = process.env.NODE_ENV ?? 'development'
const isDevelopment = nodeEnv === 'development'
const isProduction = nodeEnv === 'production'

export const assets = createAssetServer({
  basePath: '/assets',
  rootDir: process.cwd(),
  allowFiles: [
    'app/**/public/**',
    'app/components/ui/**',
    'app/lib/url-state.ts',
    'app/lib/search-schema.ts',
    'app/lib/utils.ts',
    'app/features/book/book-constants.ts',
  ],
  allowPackages: ['remix', 'clsx', 'tailwind-merge'],
  sourceMaps: isDevelopment ? 'external' : undefined,
  minify: !isDevelopment,
  fingerprint: isProduction,
  watch: isDevelopment,
})

export const scriptEntry = await assets.getScriptEntry('app/actions/public/entry.ts')
export const stylesheetHref = await assets.getHref('app/styles/public/app.css')

export const publicFiles = staticFiles('./public', { index: false })
