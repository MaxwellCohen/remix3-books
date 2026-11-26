import { Frame, type Handle } from 'remix/component'

import { BookGridSkeleton } from '../features/book/components/book-grid.tsx'
import { BookPaginationSkeleton } from '../features/book/components/book-pagination.tsx'
import { stringifySearchParams, type SearchParams } from '../lib/url-state.ts'
import { routes } from '../routes.ts'
import { Document } from './document.tsx'

export function HomePage(handle: Handle<{ searchParams: SearchParams }>) {
  return () => {
    let { searchParams } = handle.props
    let query = stringifySearchParams(searchParams)
    let search = query ? `?${query}` : ''
    return (
      <Document searchParams={searchParams} title="Books">
        <div class="flex min-h-0 flex-1 flex-col">
          <div class="flex-1 px-4 py-5 transition-opacity duration-200 ease-out group-has-[[data-filtering]]:opacity-60 sm:px-6">
            <Frame fallback={<BookGridSkeleton />} src={routes.frames.books.href() + search} />
          </div>
          <footer class="border-divider dark:border-divider-dark mt-auto border-t px-4 py-3 sm:px-6">
            <Frame fallback={<BookPaginationSkeleton />} src={routes.frames.count.href() + search} />
          </footer>
        </div>
      </Document>
    )
  }
}
