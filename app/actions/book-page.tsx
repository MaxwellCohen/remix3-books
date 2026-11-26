import type { Handle } from 'remix/component'

import { BookDetail } from '../features/book/components/book-detail.tsx'
import { BookNotFound } from '../features/book/components/book-not-found.tsx'
import { BackToBooksLink } from '../features/book/components/public/back-to-books-link.tsx'
import { EMPTY_IMAGE_URL, getLargeBookImageUrl } from '../features/book/book-constants.ts'
import type { BookDetails } from '../features/book/book-types.ts'
import type { SearchParams } from '../lib/url-state.ts'
import { Document } from './document.tsx'

export function BookPage(handle: Handle<{ book: BookDetails | null; searchParams: SearchParams }>) {
  return () => {
    let { book, searchParams } = handle.props
    return (
      <Document
        head={
          // Starts the cover download early, and lets link prefetching discover it.
          book ? (
            <link
              as="image"
              fetchpriority="high"
              href={getLargeBookImageUrl(book.image_url ?? EMPTY_IMAGE_URL)}
              rel="preload"
            />
          ) : null
        }
        searchParams={searchParams}
        title={book ? book.title : 'Book not found'}
      >
        <div class="flex flex-1 flex-col px-4 py-5 sm:px-6">
          <BackToBooksLink class="mb-6" searchParams={searchParams} />
          {book ? <BookDetail book={book} /> : <BookNotFound />}
        </div>
      </Document>
    )
  }
}
