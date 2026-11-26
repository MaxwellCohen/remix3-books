import type { Handle } from 'remix/component'

import { buttonClasses } from '../components/ui/button.tsx'
import { EmptyState } from '../components/ui/empty-state.tsx'
import type { SearchParams } from '../lib/url-state.ts'
import { Document } from './document.tsx'

export function NotFoundPage(handle: Handle<{ searchParams: SearchParams }>) {
  return () => (
    <Document searchParams={handle.props.searchParams} title="Not found">
      <EmptyState body="That page doesn't exist." title="Page not found">
        <a class={buttonClasses({ className: 'mt-1', variant: 'secondary' })} href="/">
          Back to the shelf
        </a>
      </EmptyState>
    </Document>
  )
}
