import { on, type Handle, type RemixNode } from 'remix/component'

import { cn } from '../../lib/utils.ts'

type Props = {
  class?: string
  hint?: RemixNode
  id: string
  label: string
  onValueChange: (value: number) => void
  readout?: RemixNode
  value: number
  values: readonly [number, ...number[]]
}

export function Range(handle: Handle<Props>) {
  return () => {
    let { hint, id, label, readout, value, values } = handle.props
    let selectedIndex = values.reduce(
      (closest, option, index) =>
        Math.abs(option - value) < Math.abs(values[closest] - value) ? index : closest,
      0,
    )

    return (
      <div class="flex flex-col gap-2">
        <div class="flex items-baseline justify-between gap-2">
          <label class="text-muted text-xs font-semibold tracking-wide uppercase" for={id}>
            {label}
          </label>
          <span class="text-sm font-medium text-black tabular-nums dark:text-white">{readout ?? value}</span>
        </div>
        <input
          class={cn(
            'focus-visible:ring-accent/30 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:outline-none',
            handle.props.class,
          )}
          id={id}
          max={values.length - 1}
          min={0}
          mix={on('input', (event) => {
            handle.props.onValueChange(values[Number(event.currentTarget.value)])
          })}
          step={1}
          type="range"
          value={String(selectedIndex)}
        />
        {hint ? <div class="text-muted flex justify-between text-[11px] tabular-nums">{hint}</div> : null}
      </div>
    )
  }
}
