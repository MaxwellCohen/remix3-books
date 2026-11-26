import type { Handle } from 'remix/component'

import { Icon } from './icon.tsx'
import { cn } from '../../lib/utils.ts'

export function Spinner(handle: Handle<{ class?: string }>) {
  return () => <Icon class={cn('size-4 shrink-0 animate-spin', handle.props.class)} name="loader-circle" />
}
