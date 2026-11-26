import type { Handle } from 'remix/component'
import { createPngDataUri } from 'unlazy/thumbhash'

import { Skeleton } from '../../../components/ui/skeleton.tsx'
import { cn } from '../../../lib/utils.ts'
import { EMPTY_IMAGE_URL, getLargeBookImageUrl } from '../book-constants.ts'

type Props = {
  class?: string
  priority?: boolean
  sizes: string
  src: string | null
  thumbhash: string | null
  title: string
}

export function BookCover(handle: Handle<Props>) {
  return () => {
    let { priority, sizes, src, thumbhash, title } = handle.props
    return (
      <div class={cn('bg-card dark:bg-card-dark relative aspect-[2/3] w-full overflow-hidden rounded-md', handle.props.class)}>
        <img
          alt={title}
          class="absolute inset-0 size-full object-cover"
          decoding="async"
          fetchpriority={priority ? 'high' : 'auto'}
          sizes={sizes}
          src={getLargeBookImageUrl(src ?? EMPTY_IMAGE_URL)}
          style={
            thumbhash
              ? { backgroundImage: `url("${createPngDataUri(thumbhash)}")`, backgroundSize: 'cover' }
              : undefined
          }
        />
      </div>
    )
  }
}

export function BookCoverSkeleton(handle: Handle<{ class?: string }>) {
  return () => <Skeleton class={cn('skeleton-subtle aspect-[2/3] w-full rounded-md', handle.props.class)} />
}
