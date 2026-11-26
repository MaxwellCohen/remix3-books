import { navigate } from 'remix/component'

import { cleanSearch } from '../../../../lib/search-schema.ts'
import { buildHref, type SearchParams } from '../../../../lib/url-state.ts'

// Equivalent of React Router's `navigate(href, { replace: true, preventScrollReset: true })`.
export function replaceCatalog(next: SearchParams) {
  return navigate(buildHref(cleanSearch(next)), {
    history: 'replace',
    resetFocus: 'manual',
    resetScroll: 'manual',
  })
}
