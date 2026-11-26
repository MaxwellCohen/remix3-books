import { clientEntry, on, type Handle } from 'remix/component'

import { buttonClasses } from '../../../../components/ui/button.tsx'
import { Icon } from '../../../../components/ui/icon.tsx'
import { inputClasses, selectClasses } from '../../../../components/ui/input.tsx'
import { Range } from '../../../../components/ui/range.tsx'
import { withFilters, type SearchParams } from '../../../../lib/url-state.ts'
import {
  LANGUAGES,
  LISTS,
  MAX_PAGES,
  MAX_RATING,
  MAX_YEAR,
  MIN_PAGES,
  MIN_RATING,
  MIN_YEAR,
  PAGE_FILTER_VALUES,
  RATING_FILTER_VALUES,
  YEAR_FILTER_VALUES,
} from '../../book-constants.ts'
import { replaceCatalog } from './catalog-navigation.ts'

export const BookFilters = clientEntry(
  import.meta.url,
  function BookFilters(handle: Handle<{ idPrefix: string; searchParams: SearchParams }>) {
    // Optimistic filters while the navigation is in flight (React's useOptimistic).
    let optimistic: SearchParams | undefined
    let latest = 0

    async function apply(next: SearchParams) {
      let token = ++latest
      optimistic = next
      handle.update()
      try {
        await replaceCatalog(next)
      } finally {
        if (token === latest) {
          optimistic = undefined
          handle.update()
        }
      }
    }

    function current() {
      return optimistic ?? handle.props.searchParams
    }

    function commit(patch: Partial<SearchParams>) {
      void apply(withFilters(current(), patch))
    }

    return () => {
      let { idPrefix } = handle.props
      let filters = current()
      let activeCount = Object.entries(filters).filter(
        ([key, value]) => key !== 'page' && key !== 'delay' && Boolean(value),
      ).length

      return (
        <div class="flex min-h-0 flex-1 flex-col" data-filtering={optimistic ? '' : undefined}>
          <div class="min-h-0 flex-1 touch-pan-y [scrollbar-gutter:stable] overflow-x-hidden overflow-y-auto overscroll-contain px-1 pb-6">
            <div class="flex flex-col gap-6">
              <Range
                hint={
                  <>
                    <span>{MIN_YEAR}</span>
                    <span>{MAX_YEAR}</span>
                  </>
                }
                id={`${idPrefix}-filter-year`}
                label="Published before"
                onValueChange={(value) => commit({ year: value === MAX_YEAR ? undefined : String(value) })}
                readout={filters.year ? filters.year : 'Any year'}
                value={Number(filters.year ?? MAX_YEAR)}
                values={YEAR_FILTER_VALUES}
              />

              <Range
                hint={
                  <>
                    <span>Any</span>
                    <span>{MAX_RATING} stars</span>
                  </>
                }
                id={`${idPrefix}-filter-rating`}
                label="Minimum rating"
                onValueChange={(value) => commit({ rating: value === MIN_RATING ? undefined : String(value) })}
                readout={filters.rating ? `${filters.rating}+` : 'Any rating'}
                value={Number(filters.rating ?? MIN_RATING)}
                values={RATING_FILTER_VALUES}
              />

              <Range
                hint={
                  <>
                    <span>{MIN_PAGES}</span>
                    <span>{MAX_PAGES}</span>
                  </>
                }
                id={`${idPrefix}-filter-pages`}
                label="Max pages"
                onValueChange={(value) => commit({ pages: value === MAX_PAGES ? undefined : String(value) })}
                readout={filters.pages ?? 'Any length'}
                value={Number(filters.pages ?? MAX_PAGES)}
                values={PAGE_FILTER_VALUES}
              />

              <div class="flex flex-col gap-2">
                <label
                  class="text-muted text-xs font-semibold tracking-wide uppercase"
                  for={`${idPrefix}-filter-language`}
                >
                  Language
                </label>
                <span class="relative block min-w-0">
                  <select
                    class={selectClasses}
                    id={`${idPrefix}-filter-language`}
                    mix={on('change', (event) => commit({ language: event.currentTarget.value }))}
                    value={filters.language ?? 'en'}
                  >
                    {LANGUAGES.map((language) => (
                      <option key={language.value} value={language.value}>
                        {language.label}
                      </option>
                    ))}
                  </select>
                  <Icon
                    class="text-muted pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2"
                    name="chevron-down"
                  />
                </span>
              </div>

              <fieldset class="flex flex-col gap-2">
                <legend class="text-muted mb-2 text-xs font-semibold tracking-wide uppercase">Book lists</legend>
                {LISTS.map((list) => (
                  <label
                    class="hover:bg-card dark:hover:bg-card-dark -mx-2 flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors"
                    key={list.name}
                  >
                    <input
                      checked={filters.list === list.slug}
                      class={inputClasses.checkbox}
                      mix={on('change', () => commit({ list: filters.list === list.slug ? undefined : list.slug }))}
                      type="checkbox"
                    />
                    {list.name}
                  </label>
                ))}
              </fieldset>
            </div>
          </div>

          {activeCount > 0 ? (
            <div class="border-divider dark:border-divider-dark border-t pt-3">
              <button
                class={buttonClasses({ className: 'w-full', variant: 'secondary' })}
                mix={on('click', () => {
                  let { delay } = current()
                  void apply(delay ? { delay } : {})
                })}
                type="button"
              >
                Clear all filters
              </button>
            </div>
          ) : null}
        </div>
      )
    }
  },
)
