import { createController } from 'remix/router'

import { getBookById } from '../features/book/book-queries.server.ts'
import { waitForApiDelay } from '../lib/api-delay.ts'
import { searchParamsFromUrl } from '../lib/search-schema.ts'
import { getApiDelayMs } from '../lib/url-state.ts'
import { assets } from '../assets.ts'
import { routes } from '../routes.ts'
import { BookPage } from './book-page.tsx'
import { HomePage } from './home-page.tsx'
import { NotFoundPage } from './not-found-page.tsx'

// Remix prefetching (`data-rmx-prefetch`) only reuses HTML the browser may cache.
const DOCUMENT_HEADERS = { 'Cache-Control': 'private, max-age=30' }

export default createController(routes, {
  actions: {
    async assets(context) {
      return (await assets.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
    },

    home(context) {
      return context.render(<HomePage searchParams={searchParamsFromUrl(context.url)} />, {
        headers: DOCUMENT_HEADERS,
      })
    },

    async book(context) {
      let searchParams = searchParamsFromUrl(context.url)
      await waitForApiDelay(getApiDelayMs(searchParams))
      let book = await getBookById(context.params.id)
      return context.render(<BookPage book={book} searchParams={searchParams} />, {
        headers: DOCUMENT_HEADERS,
        status: book ? 200 : 404,
      })
    },

    notFound(context) {
      return context.render(<NotFoundPage searchParams={searchParamsFromUrl(context.url)} />, { status: 404 })
    },
  },
})
