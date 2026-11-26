import type { Handle } from 'remix/component'

import { Icon } from './icon.tsx'
import { cn } from '../../lib/utils.ts'

export function StarRating(handle: Handle<{ class?: string; rating: number }>) {
  return () => {
    let { rating } = handle.props
    let rounded = Math.round(rating * 2) / 2
    return (
      <span
        aria-label={`Rated ${rating.toFixed(1)} out of 5`}
        class={cn('inline-flex items-center gap-0.5', handle.props.class)}
        role="img"
      >
        {Array.from({ length: 5 }).map((_, index) => {
          let filled = index + 1 <= rounded
          let half = !filled && index + 0.5 === rounded
          return (
            <Icon
              class={cn(
                'size-4',
                filled || half ? 'text-warning fill-current' : 'text-divider dark:text-divider-dark fill-current',
              )}
              key={index}
              name="star"
              strokeWidth={0}
            />
          )
        })}
      </span>
    )
  }
}
