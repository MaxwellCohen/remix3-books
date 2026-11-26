import { clientEntry, on, ref, type Handle } from 'remix/component'

import { navigationState } from '../../../../components/public/navigation-state.ts'
import { Icon } from '../../../../components/ui/icon.tsx'
import { iconButtonClasses, inputClasses } from '../../../../components/ui/input.tsx'
import { Spinner } from '../../../../components/ui/spinner.tsx'
import { withFilters, type SearchParams } from '../../../../lib/url-state.ts'
import { cn } from '../../../../lib/utils.ts'
import { replaceCatalog } from './catalog-navigation.ts'

const DEBOUNCE_MS = 220

export const BookSearch = clientEntry(
  import.meta.url,
  function BookSearch(handle: Handle<{ searchParams: SearchParams }>) {
    let input: HTMLInputElement | undefined
    let timer: ReturnType<typeof setTimeout> | undefined

    handle.queueTask(() => {
      navigationState.listen()
      navigationState.addEventListener('change', () => handle.update(), { signal: handle.signal })
      handle.signal.addEventListener('abort', () => clearTimeout(timer))
    })

    function go(value: string) {
      let query = value.trim()
      void replaceCatalog(withFilters(handle.props.searchParams, { search: query || undefined }))
    }

    return () => {
      let { searchParams } = handle.props
      let pending = navigationState.pendingTo?.pathname === '/'

      // Keep the box in sync with the URL (back/forward, clear filters) unless the user is typing.
      handle.queueTask(() => {
        if (input && document.activeElement !== input) input.value = searchParams.search ?? ''
      })

      return (
        <form
          aria-busy={pending}
          class="relative flex-1"
          data-filtering={pending ? '' : undefined}
          mix={on('submit', (event) => {
            event.preventDefault()
            clearTimeout(timer)
            go(input?.value ?? '')
          })}
          role="search"
        >
          <label class="sr-only" for={handle.id}>
            Search books
          </label>
          <span
            aria-hidden="true"
            class="text-muted pointer-events-none absolute top-1/2 left-3.5 flex size-4 -translate-y-1/2 items-center justify-center"
          >
            {pending ? <Spinner class="size-4" /> : <Icon class="size-4" name="search" />}
          </span>
          <input
            class={cn(inputClasses.search, 'peer')}
            defaultValue={searchParams.search ?? ''}
            id={handle.id}
            mix={[
              ref((node) => {
                input = node
              }),
              on('input', (event) => {
                let { value } = event.currentTarget
                clearTimeout(timer)
                timer = setTimeout(() => go(value), DEBOUNCE_MS)
              }),
            ]}
            name="search"
            placeholder="Search books…"
            type="search"
          />
          <button
            aria-label="Clear search"
            class={cn(iconButtonClasses, 'absolute top-1/2 right-1.5 -translate-y-1/2 peer-placeholder-shown:hidden')}
            mix={on('click', () => {
              clearTimeout(timer)
              if (input) input.value = ''
              go('')
              input?.focus()
            })}
            type="button"
          >
            <Icon class="size-4" name="x" />
          </button>
        </form>
      )
    }
  },
)
