import type { AssetServer, ScriptEntry } from 'remix/assets'

// Host builds have no source tree to compile from, so scripts/build.ts snapshots the
// asset server's output to static files and swaps this module in for app/assets.ts.
type AssetManifest = {
  entries: Record<string, ScriptEntry>
  fontPreloadHrefs: string[]
  scriptEntry: ScriptEntry
  stylesheetHref: string
}

declare const __ASSET_MANIFEST__: AssetManifest

const manifest = __ASSET_MANIFEST__

export const scriptEntry = manifest.scriptEntry
export const stylesheetHref = manifest.stylesheetHref
export const fontPreloadHrefs = manifest.fontPreloadHrefs
export const publicFiles = undefined

export const assets: Pick<AssetServer, 'getScriptEntry' | 'fetch' | 'close'> = {
  async getScriptEntry(entryId) {
    let key = String(entryId).replace(/^file:\/\/\//, '')
    let entry = manifest.entries[key]
    if (!entry) throw new Error(`No prebuilt script entry for ${key}`)
    return structuredClone(entry)
  },
  // Static files are served by the host's CDN.
  async fetch() {
    return null
  },
  async close() {},
}
