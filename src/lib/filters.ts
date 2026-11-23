import type { Category, Collection, Origin } from '../data/products'

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'moq-asc'
export interface Filters {
  category: Category | 'all'
  origin: Origin | 'all'
  collection: Collection | 'all'
  query: string
  sort: SortKey
}
export const DEFAULT_FILTERS: Filters = { category: 'all', origin: 'all', collection: 'all', query: '', sort: 'featured' }

export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
