import type { Handle, RemixNode } from 'remix/component'

import { BookMark } from './book-mark.tsx'

export function EmptyState(handle: Handle<{ title: string; body?: string; children?: RemixNode }>) {
  return () => {
    let { body, children, title } = handle.props
    return (
      <div class="grid flex-1 place-items-center px-6 py-20 text-center">
        <div class="flex max-w-sm flex-col items-center gap-3">
          <BookMark animated class="mb-1 size-10" />
          <p class="text-sm font-medium">{title}</p>
          {body ? <p class="text-muted text-sm leading-6">{body}</p> : null}
          {children}
        </div>
      </div>
    )
  }
}
