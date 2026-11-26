import type { Handle } from 'remix/component'

import { ICONS, type IconName } from './icons.ts'
import { cn } from '../../lib/utils.ts'

type Props = { name: IconName; class?: string; strokeWidth?: number }

export function Icon(handle: Handle<Props>) {
  return () => {
    let { name, strokeWidth = 2 } = handle.props
    return (
      <svg
        aria-hidden="true"
        class={cn('lucide', `lucide-${name}`, handle.props.class ?? 'size-4')}
        fill="none"
        height="24"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={strokeWidth}
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {ICONS[name].map(([Tag, attrs], index) => (
          <Tag key={index} {...attrs} />
        ))}
      </svg>
    )
  }
}
