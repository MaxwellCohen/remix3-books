import { clientEntry, type Handle } from 'remix/component'

import { Range } from '../../../../components/ui/range.tsx'
import { API_DELAY_VALUES, formatApiDelay, getApiDelayMs, type SearchParams } from '../../../../lib/url-state.ts'
import { replaceCatalog } from './catalog-navigation.ts'

export const ApiDelay = clientEntry(
  import.meta.url,
  function ApiDelay(handle: Handle<{ idPrefix: string; searchParams: SearchParams }>) {
    let optimistic: number | undefined
    let latest = 0

    async function commit(next: number) {
      let token = ++latest
      optimistic = next
      handle.update()
      let params: SearchParams = { ...handle.props.searchParams, delay: next === 0 ? undefined : String(next) }
      if (!params.delay) delete params.delay
      try {
        await replaceCatalog(params)
      } finally {
        if (token === latest) {
          optimistic = undefined
          handle.update()
        }
      }
    }

    return () => {
      let value = optimistic ?? getApiDelayMs(handle.props.searchParams)
      return (
        <div data-filtering={optimistic !== undefined ? '' : undefined}>
          <Range
            hint={
              <>
                <span>Off</span>
                <span>3s</span>
              </>
            }
            id={`${handle.props.idPrefix}-api-delay`}
            label="API delay"
            onValueChange={commit}
            readout={formatApiDelay(value)}
            value={value}
            values={API_DELAY_VALUES}
          />
        </div>
      )
    }
  },
)
