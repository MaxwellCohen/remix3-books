import { cn } from '../../lib/utils.ts'

const base =
  'border-divider placeholder-gray focus:border-accent focus:ring-accent/25 dark:border-divider-dark disabled:bg-card disabled:text-muted dark:disabled:bg-card-dark w-full rounded-md border bg-white px-3 py-2 text-sm text-black transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#1c1c1c] dark:text-white'

export const inputClasses = {
  checkbox: 'accent-action size-4 w-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-60',
  default: base,
  search: cn(base, 'h-11 rounded-lg pr-10 pl-10 text-base sm:text-sm'),
}

export const selectClasses =
  'border-divider focus:border-accent focus:ring-accent/25 dark:border-divider-dark disabled:bg-card disabled:text-muted dark:disabled:bg-card-dark w-full appearance-none rounded-md border bg-white px-3 py-2 pr-8 text-sm text-black transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#1c1c1c] dark:text-white'

export const iconButtonClasses =
  'text-muted hover:bg-card focus-visible:ring-accent/40 dark:hover:bg-card-dark inline-flex shrink-0 items-center justify-center rounded-md transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-white size-8'
