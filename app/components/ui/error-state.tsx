import type { Handle, RemixNode } from 'remix/component'

import { Icon } from './icon.tsx'

type Props = { title?: string; body?: string; compact?: boolean; children?: RemixNode }

export function ErrorState(handle: Handle<Props>) {
  return () => {
    let { body, children, compact, title } = handle.props
    if (compact) {
      return (
        <div class="flex flex-col items-center gap-2 px-4 py-6 text-center">
          <Icon class="text-danger size-4" name="triangle-alert" />
          <p class="text-muted text-xs">{title ?? 'Something went wrong'}</p>
          {body ? <p class="text-muted text-xs leading-5">{body}</p> : null}
          {children}
        </div>
      )
    }

    return (
      <div class="grid flex-1 place-items-center px-6 py-20 text-center">
        <div class="flex max-w-sm flex-col items-center gap-3">
          <Icon class="text-danger size-6" name="triangle-alert" />
          <p class="text-sm font-medium text-black dark:text-white">{title ?? 'Something went wrong'}</p>
          {body ? <p class="text-muted text-sm leading-6">{body}</p> : null}
          {children}
        </div>
      </div>
    )
  }
}
