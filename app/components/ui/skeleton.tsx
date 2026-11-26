import type { Handle } from 'remix/component'

import { cn } from '../../lib/utils.ts'

export function Skeleton(handle: Handle<{ class?: string }>) {
  return () => <span aria-hidden="true" class={cn('skeleton-animation block', handle.props.class)} />
}
