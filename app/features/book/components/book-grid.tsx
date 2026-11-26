import type { Handle } from 'remix/component'

import { EmptyState } from '../../../components/ui/empty-state.tsx'
import type { SearchParams } from '../../../lib/url-state.ts'
import { ITEMS_PER_PAGE, PRIORITY_COVER_COUNT } from '../book-constants.ts'
import type { BookSummary } from '../book-types.ts'
import { BookCard } from './book-card.tsx'
import { BookCoverSkeleton } from './book-cover.tsx'

const gridClass = 'grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'

export function BookGrid(handle: Handle<{ books: BookSummary[]; searchParams: SearchParams }>) {
  return () => {
    let { books, searchParams } = handle.props
    if (books.length === 0) {
      return (
        <EmptyState
          body="Nothing matched these filters. Try widening the year range or clearing the search."
          title="No books found"
        />
      )
    }

    return (
      <div class={gridClass}>
        {books.map((book, index) => (
          <BookCard
            book={book}
            key={book.id}
            priority={index < PRIORITY_COVER_COUNT}
            searchParams={searchParams}
          />
        ))}
      </div>
    )
  }
}

export function BookGridSkeleton() {
  return () => (
    <div aria-hidden="true" class={gridClass}>
      {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
        <BookCoverSkeleton key={index} />
      ))}
    </div>
  )
}
