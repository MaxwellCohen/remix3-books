import { clientEntry, type Handle, type RemixNode } from 'remix/component'

import { navigationState } from './navigation-state.ts'
import { Spinner } from '../ui/spinner.tsx'
import { cn } from '../../lib/utils.ts'

type Props = { children?: RemixNode; class?: string; hint?: 'end' | 'start' }

export const LinkStatus = clientEntry(import.meta.url, function LinkStatus(handle: Handle<Props>) {
  handle.queueTask(() => {
    navigationState.listen()
    navigationState.addEventListener('change', () => handle.update(), { signal: handle.signal })
  })

  return () => {
    let { children, hint = 'end' } = handle.props
    let pending = navigationState.pendingTo !== null
    let slot = (
      <span
        aria-hidden="true"
        class="pending-hint inline-flex size-3.5 shrink-0 items-center justify-center"
        data-pending={pending ? '' : undefined}
      >
        {pending ? <Spinner class="size-3.5" /> : null}
      </span>
    )

    return (
      <span class={cn('inline-flex items-center gap-2', handle.props.class)}>
        {hint === 'start' ? slot : null}
        {children}
        {hint === 'end' ? slot : null}
      </span>
    )
  }
})
