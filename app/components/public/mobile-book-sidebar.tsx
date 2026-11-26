import { clientEntry, on, type Handle } from 'remix/component'

import { buttonClasses } from '../ui/button.tsx'
import { Icon } from '../ui/icon.tsx'

export const MOBILE_SIDEBAR_ID = 'mobile-book-sidebar'

// The drawer itself is a server-rendered native modal <dialog> (see document.tsx);
// this trigger opens it and closes it on backdrop or link clicks.
export const MobileBookSidebarTrigger = clientEntry(
  import.meta.url,
  function MobileBookSidebarTrigger(handle: Handle) {
    handle.queueTask(() => {
      let dialog = document.getElementById(MOBILE_SIDEBAR_ID)
      if (!(dialog instanceof HTMLDialogElement)) return
      dialog.addEventListener(
        'click',
        (event) => {
          let target = event.target as HTMLElement
          if (target === dialog || target.closest('a[href]')) dialog.close()
        },
        { signal: handle.signal },
      )
    })

    return () => (
      <button
        aria-label="Open filters"
        class={buttonClasses({ className: 'md:hidden', size: 'icon', variant: 'ghost' })}
        mix={on('click', () => {
          let dialog = document.getElementById(MOBILE_SIDEBAR_ID)
          if (dialog instanceof HTMLDialogElement) dialog.showModal()
        })}
        type="button"
      >
        <Icon class="size-4" name="sliders-horizontal" />
      </button>
    )
  },
)
