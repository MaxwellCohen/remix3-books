import { clientEntry, on, type Handle } from 'remix/component'

import { Icon } from '../../../../components/ui/icon.tsx'
import { buildHref, type SearchParams } from '../../../../lib/url-state.ts'
import { cn } from '../../../../lib/utils.ts'

const linkClass =
  'text-muted hover:bg-card dark:hover:bg-card-dark -ml-1.5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:text-black dark:hover:text-white'

export const BackToBooksLink = clientEntry(
  import.meta.url,
  function BackToBooksLink(handle: Handle<{ class?: string; searchParams: SearchParams }>) {
    return () => (
      <a
        class={cn(linkClass, handle.props.class)}
        data-rmx-prefetch="intent"
        href={buildHref(handle.props.searchParams)}
        mix={on('click', (event) => {
          // Prefer a real Back so the catalog restores its scroll position.
          if (window.navigation?.canGoBack) {
            event.preventDefault()
            history.back()
          }
        })}
      >
        <Icon class="size-4" name="arrow-left" />
        Back to books
      </a>
    )
  },
)
