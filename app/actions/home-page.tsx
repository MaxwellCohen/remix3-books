import type { Handle } from 'remix/component'

import { BookGrid } from '../features/book/components/book-grid.tsx'
import { BookPagination } from '../features/book/components/book-pagination.tsx'
import type { BookSummary } from '../features/book/book-types.ts'
import type { SearchParams } from '../lib/url-state.ts'
import { Document } from './document.tsx'

type Props = { books: BookSummary[]; searchParams: SearchParams; totalResults: number }

export function HomePage(handle: Handle<Props>) {
  return () => {
    let { books, searchParams, totalResults } = handle.props
    return (
      <Document searchParams={searchParams} title="Books">
        <div class="flex min-h-0 flex-1 flex-col">
          <div class="flex-1 px-4 py-5 transition-opacity duration-200 ease-out group-has-[[data-filtering]]:opacity-60 sm:px-6">
            <BookGrid books={books} searchParams={searchParams} />
          </div>
          <footer class="border-divider dark:border-divider-dark mt-auto border-t px-4 py-3 sm:px-6">
            <BookPagination searchParams={searchParams} totalResults={totalResults} />
          </footer>
        </div>
      </Document>
    )
  }
}
