import type { Handle } from 'remix/component'

import { LinkStatus } from '../../../components/public/link-status.tsx'
import { Icon } from '../../../components/ui/icon.tsx'
import { Skeleton } from '../../../components/ui/skeleton.tsx'
import {
  buildHref,
  getCurrentPage,
  getTotalPages,
  withPage,
  type SearchParams,
} from '../../../lib/url-state.ts'
import { cn } from '../../../lib/utils.ts'

const stepClass =
  'text-muted hover:bg-card dark:hover:bg-card-dark focus-visible:ring-action/40 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white'

export function BookPagination(handle: Handle<{ searchParams: SearchParams; totalResults: number }>) {
  return () => {
    let { searchParams, totalResults } = handle.props
    let totalPages = getTotalPages(totalResults)
    let currentPage = getCurrentPage(searchParams, totalPages)
    let hasPrevious = currentPage > 1
    let hasNext = currentPage < totalPages

    return (
      <nav aria-label="Pagination" class="flex items-center justify-between gap-4">
        {hasPrevious ? (
          <a
            aria-label="Previous page"
            class={stepClass}
            href={buildHref(withPage(searchParams, currentPage - 1))}
          >
            <LinkStatus>
              <Icon class="size-4" name="chevron-left" />
              Previous
            </LinkStatus>
          </a>
        ) : (
          <span aria-disabled="true" class={cn(stepClass, 'pointer-events-none opacity-40')}>
            <Icon class="size-4" name="chevron-left" />
            Previous
          </span>
        )}

        <p class="text-muted flex items-center gap-2 text-xs tabular-nums sm:text-sm">
          <span class="hidden sm:inline">
            <span class="font-medium text-black dark:text-white">{totalResults.toLocaleString()}</span> books
          </span>
          <span aria-hidden="true" class="bg-divider dark:bg-divider-dark hidden h-3 w-px sm:block" />
          <span>
            Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()}
          </span>
        </p>

        {hasNext ? (
          <a aria-label="Next page" class={stepClass} href={buildHref(withPage(searchParams, currentPage + 1))}>
            <LinkStatus hint="start">
              Next
              <Icon class="size-4" name="chevron-right" />
            </LinkStatus>
          </a>
        ) : (
          <span aria-disabled="true" class={cn(stepClass, 'pointer-events-none opacity-40')}>
            Next
            <Icon class="size-4" name="chevron-right" />
          </span>
        )}
      </nav>
    )
  }
}

export function BookPaginationSkeleton() {
  return () => (
    <div aria-hidden="true" class="flex items-center justify-between gap-4">
      <span class={cn(stepClass, 'pointer-events-none opacity-40')}>
        <Icon class="size-4" name="chevron-left" />
        Previous
      </span>
      <div class="flex items-center gap-2">
        <Skeleton class="skeleton-subtle hidden h-4 w-20 sm:block" />
        <span class="bg-divider dark:bg-divider-dark hidden h-3 w-px sm:block" />
        <Skeleton class="skeleton-subtle h-4 w-20" />
      </div>
      <span class={cn(stepClass, 'pointer-events-none opacity-40')}>
        Next
        <Icon class="size-4" name="chevron-right" />
      </span>
    </div>
  )
}
