import { clientEntry, on, type Handle } from 'remix/component'

import { Icon } from '../ui/icon.tsx'
import type { IconName } from '../ui/icons.ts'
import { cn } from '../../lib/utils.ts'

type Theme = 'light' | 'dark' | 'system'

const OPTIONS: { icon: IconName; label: string; theme: Theme }[] = [
  { icon: 'sun', label: 'Light mode', theme: 'light' },
  { icon: 'moon', label: 'Dark mode', theme: 'dark' },
  { icon: 'monitor', label: 'System theme', theme: 'system' },
]

function readStoredTheme(): Theme {
  try {
    let stored = localStorage.getItem('theme')
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
  } catch {
    return 'system'
  }
}

function applyTheme(theme: Theme) {
  let systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  let dark = theme === 'dark' || (theme === 'system' && systemDark)
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

export const ThemeToggle = clientEntry(
  import.meta.url,
  function ThemeToggle(handle: Handle<{ variant?: 'inline' | 'pill' }>) {
    // Unknown on the server; read from storage once the component is in the page.
    let active: Theme | undefined

    handle.queueTask(() => {
      active = readStoredTheme()
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener(
        'change',
        () => {
          if (readStoredTheme() === 'system') applyTheme('system')
        },
        { signal: handle.signal },
      )
      handle.update()
    })

    return () => (
      <div
        class={
          handle.props.variant === 'inline'
            ? 'inline-flex items-center gap-0.5'
            : 'border-divider dark:border-divider-dark inline-flex items-center rounded-full border p-0.5'
        }
        style={{ viewTransitionName: 'theme-toggle' }}
      >
        {OPTIONS.map((option) => (
          <button
            aria-label={option.label}
            aria-pressed={active === option.theme}
            class={cn(
              'rounded-full p-1.5 transition-colors',
              active === option.theme
                ? 'bg-card dark:bg-card-dark text-black dark:text-white'
                : 'text-muted hover:text-black dark:hover:text-white',
            )}
            key={option.theme}
            mix={on('click', () => {
              active = option.theme
              try {
                localStorage.setItem('theme', option.theme)
              } catch {}
              applyTheme(option.theme)
              handle.update()
            })}
            type="button"
          >
            <Icon class="size-4" name={option.icon} />
          </button>
        ))}
      </div>
    )
  },
)
