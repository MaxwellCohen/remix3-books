import { buttonClasses } from '../../../components/ui/button.tsx'
import { EmptyState } from '../../../components/ui/empty-state.tsx'

export function BookNotFound() {
  return () => (
    <EmptyState body="We couldn't find a book with that id." title="Book not found">
      <a class={buttonClasses({ className: 'mt-1', variant: 'secondary' })} href="/">
        Back to the shelf
      </a>
    </EmptyState>
  )
}
