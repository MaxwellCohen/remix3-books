import { createController } from 'remix/router'

import { getBookById, getBooksCount, getBooksPage } from '../features/book/book-queries.server.ts'
import { toBookFilters, toBookQuery } from '../features/book/book-utils.ts'
import { waitForApiDelay } from '../lib/api-delay.ts'
import { searchParamsFromUrl } from '../lib/search-schema.ts'
import { getApiDelayMs } from '../lib/url-state.ts'
import { assets } from '../assets.ts'
import { routes } from '../routes.ts'
import { BookPage } from './book-page.tsx'
import { HomePage } from './home-page.tsx'
import { NotFoundPage } from './not-found-page.tsx'

export default createController(routes, {
  actions: {
    async assets(context) {
      return (await assets.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
    },

    async home(context) {
      let searchParams = searchParamsFromUrl(context.url)
      let query = toBookQuery(searchParams)
      await waitForApiDelay(getApiDelayMs(searchParams))
      let [books, totalResults] = await Promise.all([
        getBooksPage(query),
        getBooksCount(toBookFilters(query)),
      ])
      return context.render(<HomePage books={books} searchParams={searchParams} totalResults={totalResults} />)
    },

    async book(context) {
      let searchParams = searchParamsFromUrl(context.url)
      await waitForApiDelay(getApiDelayMs(searchParams))
      let book = await getBookById(context.params.id)
      return context.render(<BookPage book={book} searchParams={searchParams} />, {
        status: book ? 200 : 404,
      })
    },

    notFound(context) {
      return context.render(<NotFoundPage searchParams={searchParamsFromUrl(context.url)} />, { status: 404 })
    },
  },
})
