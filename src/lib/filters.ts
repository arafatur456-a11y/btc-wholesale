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

/** Live height of the sticky header (announcement strip + bar), excluding any open menu panel. */
export const headerOffset = () => {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'))
  return Number.isFinite(v) && v > 0 ? v : (document.querySelector('header')?.getBoundingClientRect().height ?? 0)
}

let activeScroll = 0

/**
 * Scroll so the section's top edge sits exactly under the sticky header.
 * Computed from the live layout at call time (call it only after menus have finished collapsing).
 * If anything above the target changes height mid-scroll (late images, fonts, filter animations),
 * a settle pass re-measures and corrects, so the landing is exact. Any user scroll input cancels it.
 */
export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth'
  const targetY = () => Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - headerOffset()))
  window.scrollTo({ top: targetY(), behavior })

  const token = ++activeScroll
  const userInput = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
  const cancel = () => { activeScroll++ }
  userInput.forEach((ev) => window.addEventListener(ev, cancel, { once: true, passive: true }))
  const cleanup = () => userInput.forEach((ev) => window.removeEventListener(ev, cancel))

  let lastY = -1
  let still = 0
  let corrections = 0
  const started = performance.now()
  const tick = () => {
    if (token !== activeScroll) return cleanup()
    const y = Math.round(window.scrollY)
    still = y === lastY ? still + 1 : 0
    lastY = y
    if (still >= 6) {
      // scrolling has stopped: verify the landing
      const off = targetY() - y
      const maxY = document.documentElement.scrollHeight - window.innerHeight
      if (Math.abs(off) > 1 && corrections < 3 && !(off > 0 && y >= maxY - 1)) {
        corrections++
        still = 0
        window.scrollTo({ top: targetY(), behavior: Math.abs(off) < 160 ? 'auto' : behavior })
      } else return cleanup()
    }
    if (performance.now() - started > 6000) return cleanup()
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
