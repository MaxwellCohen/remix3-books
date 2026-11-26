import { createController } from 'remix/router'

import { getBooksCount, getBooksPage } from '../../features/book/book-queries.server.ts'
import { toBookFilters, toBookQuery } from '../../features/book/book-utils.ts'
import { BookGrid } from '../../features/book/components/book-grid.tsx'
import { BookPagination } from '../../features/book/components/book-pagination.tsx'
import { waitForApiDelay } from '../../lib/api-delay.ts'
import { searchParamsFromUrl } from '../../lib/search-schema.ts'
import { getApiDelayMs } from '../../lib/url-state.ts'
import { routes } from '../../routes.ts'

// Home page regions: each streams into the page through <Frame fallback={…}>.
export default createController(routes.frames, {
  actions: {
    async books(context) {
      let searchParams = searchParamsFromUrl(context.url)
      await waitForApiDelay(getApiDelayMs(searchParams))
      let books = await getBooksPage(toBookQuery(searchParams))
      return context.render(<BookGrid books={books} searchParams={searchParams} />)
    },

    async count(context) {
      let searchParams = searchParamsFromUrl(context.url)
      await waitForApiDelay(getApiDelayMs(searchParams))
      let totalResults = await getBooksCount(toBookFilters(toBookQuery(searchParams)))
      return context.render(<BookPagination searchParams={searchParams} totalResults={totalResults} />)
    },
  },
})
