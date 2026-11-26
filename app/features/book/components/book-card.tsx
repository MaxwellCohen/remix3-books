import type { Handle } from 'remix/component'

import { buildHref, type SearchParams } from '../../../lib/url-state.ts'
import type { BookSummary } from '../book-types.ts'
import { BookCover } from './book-cover.tsx'

const GRID_SIZES =
  '(min-width: 1280px) 14vw, (min-width: 1024px) 16vw, (min-width: 768px) 20vw, (min-width: 640px) 25vw, 33vw'

type Props = { book: BookSummary; priority: boolean; searchParams: SearchParams }

export function BookCard(handle: Handle<Props>) {
  return () => {
    let { book, priority, searchParams } = handle.props
    let back = buildHref(searchParams)
    let href = back === '/' ? `/${book.id}` : `/${book.id}?${back.slice(2)}`

    return (
      <a
        class="focus-visible:ring-action focus-visible:ring-offset-surface dark:focus-visible:ring-offset-surface-dark group relative block rounded-md transition-transform duration-200 ease-out hover:z-10 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        data-rmx-prefetch="intent"
        href={href}
      >
        <BookCover
          class="group-hover:shadow-soft transition-shadow"
          priority={priority}
          sizes={GRID_SIZES}
          src={book.image_url}
          thumbhash={book.thumbhash}
          title={book.title}
        />
        <span class="sr-only">{book.title}</span>
      </a>
    )
  }
}
