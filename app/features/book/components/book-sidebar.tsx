import type { Handle } from 'remix/component'

import { ThemeToggle } from '../../../components/public/theme-toggle.tsx'
import { GitHubIcon } from '../../../components/ui/github-icon.tsx'
import type { SearchParams } from '../../../lib/url-state.ts'
import { CatalogSize } from './catalog-size.tsx'
import { HomeLink } from './home-link.tsx'
import { ApiDelay } from './public/api-delay.tsx'
import { BookFilters } from './public/book-filters.tsx'

type Props = { idPrefix: string; mobile?: boolean; searchParams: SearchParams }

export function BookSidebar(handle: Handle<Props>) {
  return () => {
    let { idPrefix, mobile = false, searchParams } = handle.props
    return (
      <>
        <div class="flex items-center justify-between gap-2">
          <HomeLink searchParams={searchParams} />
        </div>
        <div class="border-divider dark:border-divider-dark mt-6 border-b pb-5">
          <CatalogSize />
        </div>
        <div class="mt-5 mb-4">
          <ApiDelay idPrefix={idPrefix} searchParams={searchParams} />
        </div>
        <p class="text-muted mb-4 text-xs font-semibold tracking-wide uppercase">Filters</p>
        <BookFilters idPrefix={idPrefix} searchParams={searchParams} />
        {mobile ? null : (
          <div class="border-divider dark:border-divider-dark mt-4 flex items-center justify-between gap-2 border-t pt-4">
            <ThemeToggle variant="inline" />
            <a
              aria-label="View source on GitHub"
              class="text-muted rounded-full p-1.5 transition-colors hover:text-black dark:hover:text-white"
              href="https://github.com/MaxwellCohen/remix3-books"
              rel="noopener noreferrer"
              target="_blank"
            >
              <GitHubIcon class="size-4" />
            </a>
          </div>
        )}
      </>
    )
  }
}
