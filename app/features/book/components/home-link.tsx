import type { Handle } from 'remix/component'

import { BookMark } from '../../../components/ui/book-mark.tsx'
import { buildHref, type SearchParams } from '../../../lib/url-state.ts'

export function HomeLink(handle: Handle<{ searchParams: SearchParams }>) {
  return () => (
    <a
      aria-label="Remix 3 Books home"
      class="inline-flex items-center gap-2 text-base font-semibold tracking-tight"
      href={buildHref({ delay: handle.props.searchParams.delay })}
    >
      <BookMark class="text-action size-5" />
      Remix 3 Books
    </a>
  )
}
