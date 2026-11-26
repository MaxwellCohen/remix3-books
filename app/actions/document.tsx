import { unsafeHTML, type Handle, type RemixNode } from 'remix/component'
import { ImportMap } from 'remix/component/server'

import { MOBILE_SIDEBAR_ID, MobileBookSidebarTrigger } from '../components/public/mobile-book-sidebar.tsx'
import { Icon } from '../components/ui/icon.tsx'
import { BookSidebar } from '../features/book/components/book-sidebar.tsx'
import { BookSearch } from '../features/book/components/public/book-search.tsx'
import type { SearchParams } from '../lib/url-state.ts'
import { fontPreloadHrefs, scriptEntry, stylesheetHref } from '../assets.ts'

const SITE_NAME = 'Remix 3 Books'
const DESCRIPTION =
  'Browse two million Goodreads books with Remix 3, streaming search, and URL-driven filters.'

// Applies the stored theme before first paint (no flash).
const unsafeTheme = unsafeHTML(`(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||((t==="system"||!t)&&window.matchMedia("(prefers-color-scheme: dark)").matches);var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";}catch(e){}})();`)

export interface DocumentProps {
  children?: RemixNode
  head?: RemixNode
  searchParams: SearchParams
  title: string
}

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { children, head, searchParams, title } = handle.props
    let { href, importMap, preloads } = scriptEntry

    return (
      // The theme script and toggle own `class` and `style` (color-scheme); keep them across client navigations.
      <html data-rmx-preserve-attrs="class style" lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <title>{`${title} · ${SITE_NAME}`}</title>
          <meta content={DESCRIPTION} name="description" />
          <meta content="#fafafa" media="(prefers-color-scheme: light)" name="theme-color" />
          <meta content="#121212" media="(prefers-color-scheme: dark)" name="theme-color" />
          <meta content={DESCRIPTION} property="og:description" />
          <meta content={SITE_NAME} property="og:site_name" />
          <meta content={SITE_NAME} property="og:title" />
          <meta content="website" property="og:type" />
          <link href="/icon.svg" rel="icon" type="image/svg+xml" />
          {fontPreloadHrefs.map((fontHref) => (
            <link as="font" crossOrigin="anonymous" href={fontHref} key={fontHref} rel="preload" type="font/woff2" />
          ))}
          <link href={stylesheetHref} rel="stylesheet" />
          {head}
          <script innerHTML={unsafeTheme} />
          <ImportMap value={importMap} />
          {preloads.map((preloadHref) => (
            <link href={preloadHref} key={preloadHref} rel="modulepreload" />
          ))}
          <script src={href} type="module"></script>
        </head>
        <body class="bg-surface text-black antialiased dark:bg-surface-dark dark:text-white">
          <div class="group flex min-h-dvh">
            <aside
              class="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark sticky top-0 hidden h-dvh w-72 shrink-0 flex-col border-r px-5 py-5 md:flex"
              style={{ viewTransitionName: 'sidebar' }}
            >
              <BookSidebar idPrefix="desktop" searchParams={searchParams} />
            </aside>

            <div class="flex min-w-0 flex-1 flex-col">
              <header
                class="border-divider bg-surface/80 dark:border-divider-dark dark:bg-surface-dark/80 sticky top-0 z-20 flex items-center gap-2 border-b px-4 py-3 backdrop-blur-md backdrop-saturate-150 sm:gap-3 sm:px-6"
                style={{ viewTransitionName: 'site-header' }}
              >
                <MobileBookSidebarTrigger />
                <BookSearch searchParams={searchParams} />
              </header>

              <main class="flex min-w-0 flex-1 flex-col">{children}</main>
            </div>
          </div>

          <dialog
            aria-label="Book filters"
            class="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark fixed inset-y-0 left-0 z-50 m-0 hidden h-dvh max-h-none w-[min(20rem,calc(100vw-3rem))] max-w-full touch-pan-y flex-col overflow-x-hidden border-r pt-[max(1rem,env(safe-area-inset-top))] pr-4 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] text-black shadow-2xl outline-none backdrop:bg-black/45 backdrop:backdrop-blur-[2px] open:flex md:hidden! dark:text-white"
            data-rmx-preserve-attrs="open"
            id={MOBILE_SIDEBAR_ID}
            style={{ viewTransitionName: 'mobile-sidebar' }}
          >
            <form method="dialog">
              <button
                aria-label="Close filters"
                class="text-muted hover:bg-card focus-visible:ring-accent dark:hover:bg-card-dark absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 grid size-9 place-items-center rounded-md hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white"
                type="submit"
              >
                <Icon class="size-5" name="x" />
              </button>
            </form>
            <BookSidebar idPrefix="mobile" mobile searchParams={searchParams} />
          </dialog>
        </body>
      </html>
    )
  }
}
