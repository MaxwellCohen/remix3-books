import type { Handle, RemixNode } from 'remix/component'

import { Icon } from '../../../components/ui/icon.tsx'
import type { IconName } from '../../../components/ui/icons.ts'
import { StarRating } from '../../../components/ui/star-rating.tsx'
import type { BookDetails } from '../book-types.ts'
import { formatCount, getLanguageLabel } from '../book-utils.ts'
import { BookCover } from './book-cover.tsx'

const DETAIL_SIZES = '(min-width: 768px) 18rem, 60vw'

export function BookDetail(handle: Handle<{ book: BookDetails }>) {
  return () => {
    let { book } = handle.props
    let rating = Number(book.average_rating)
    let hasRating = book.average_rating !== null && !Number.isNaN(rating)

    return (
      <article class="flex flex-col gap-8 md:flex-row md:gap-10">
        <div class="mx-auto w-40 shrink-0 sm:w-48 md:mx-0 md:w-72">
          <BookCover
            class="shadow-soft ring-divider/70 dark:ring-divider-dark/70 ring-1"
            priority
            sizes={DETAIL_SIZES}
            src={book.image_url}
            thumbhash={book.thumbhash}
            title={book.title}
          />
        </div>

        <div class="min-w-0 flex-1">
          <h1>{book.title}</h1>
          {book.authors.length > 0 ? (
            <p class="text-muted mt-2 text-base sm:text-lg">{book.authors.join(', ')}</p>
          ) : null}

          {hasRating ? (
            <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
              <StarRating rating={rating} />
              <span class="text-sm font-semibold tabular-nums">{rating.toFixed(1)}</span>
              {book.ratings_count ? (
                <span class="text-muted text-sm tabular-nums">{formatCount(book.ratings_count)} ratings</span>
              ) : null}
            </div>
          ) : null}

          {book.description ? (
            <p class="text-muted mt-6 max-w-prose text-sm leading-7">{book.description}</p>
          ) : null}

          <dl class="border-divider dark:border-divider-dark mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t pt-6 sm:grid-cols-2">
            <Fact icon="book-open" label="Pages">
              {book.num_pages ? book.num_pages.toLocaleString() : 'Unknown'}
            </Fact>
            <Fact icon="globe" label="Language">
              {getLanguageLabel(book.language_code)}
            </Fact>
            <Fact icon="calendar-days" label="Published">
              {book.publication_year ?? 'Unknown'}
            </Fact>
            <Fact icon="building-2" label="Publisher">
              {book.publisher ?? 'Unknown'}
            </Fact>
            <Fact icon="hash" label="ISBN">
              <span class="font-mono text-xs">{book.isbn ?? 'None'}</span>
            </Fact>
          </dl>
        </div>
      </article>
    )
  }
}

function Fact(handle: Handle<{ children?: RemixNode; icon: IconName; label: string }>) {
  return () => (
    <div class="flex items-start gap-3">
      <span class="text-muted mt-0.5 shrink-0">
        <Icon class="size-4" name={handle.props.icon} />
      </span>
      <div class="min-w-0">
        <dt class="text-muted text-xs font-semibold tracking-wide uppercase">{handle.props.label}</dt>
        <dd class="mt-0.5 truncate text-sm">{handle.props.children}</dd>
      </div>
    </div>
  )
}
