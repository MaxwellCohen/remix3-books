import { TypedEventTarget } from 'remix/component'

// One window listener shared by every client entry that shows navigation pending UI
// (the equivalent of React Router's `useNavigation()`).
type Events = { change: Event }

class NavigationState extends TypedEventTarget<Events> {
  pendingTo: URL | null = null
  #token = 0
  #listening = false

  listen() {
    if (this.#listening || typeof window === 'undefined') return
    this.#listening = true
    window.addEventListener(
      'rmx:navigation',
      (event) => {
        if (event.frameTarget) return
        let token = ++this.#token
        this.pendingTo = new URL(event.to, location.href)
        this.dispatchEvent(new Event('change'))
        let settle = () => {
          if (token !== this.#token) return
          this.pendingTo = null
          this.dispatchEvent(new Event('change'))
        }
        event.finished.then(settle, settle)
      },
      true,
    )
  }
}

export const navigationState = new NavigationState()
