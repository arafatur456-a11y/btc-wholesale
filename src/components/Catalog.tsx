import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { SearchX, X } from 'lucide-react'
import { useMemo } from 'react'
import { CATEGORIES, PRODUCTS, type Product } from '../data/products'
import type { Filters, SortKey } from '../lib/filters'
import { DEFAULT_FILTERS } from '../lib/filters'
import { basePrice, lowestPrice } from '../lib/pricing'
import ProductCard from './ProductCard'
import { SectionHeading } from './ui'

interface Props {
  filters: Filters
  setFilters: (f: Filters) => void
  showPrices: boolean
  setShowPrices: (b: boolean) => void
  onQuickView: (p: Product, variantId: string) => void
}

const COLLECTION_LABEL: Record<string, string> = { bridal: 'Bridal & Stone Sets', jhumka: 'Jhumka Collection', waist: 'Waist Chains', accessories: 'Waist Chains & Accessories', cosmetics: 'Cosmetics' }

export default function Catalog({ filters, setFilters, showPrices, setShowPrices, onQuickView }: Props) {
  const set = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch })

  const results = useMemo(() => {
    const q = filters.query.toLowerCase()
    const list = PRODUCTS.filter((p) =>
      (filters.category === 'all' || p.category === filters.category) &&
      (filters.origin === 'all' || p.origin === filters.origin) &&
      (filters.collection === 'all' || p.collections.includes(filters.collection)) &&
      (!q || [p.name, p.sku, p.description, p.material, p.origin, ...p.variants.map((v) => v.name)].join(' ').toLowerCase().includes(q)),
    )
    const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
      featured: () => 0,
      'price-asc': (a, b) => lowestPrice(a) - lowestPrice(b),
      'price-desc': (a, b) => basePrice(b) - basePrice(a),
      'moq-asc': (a, b) => a.moq - b.moq,
    }
    return [...list].sort(sorters[filters.sort])
  }, [filters])

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: PRODUCTS.length }
    CATEGORIES.forEach((c) => (m[c.id] = PRODUCTS.filter((p) => p.category === c.id).length))
    return m
  }, [])

  const activeChips = [
    filters.collection !== 'all' && { k: 'collection', label: COLLECTION_LABEL[filters.collection], clear: () => set({ collection: 'all' }) },
    filters.query && { k: 'query', label: `“${filters.query}”`, clear: () => set({ query: '' }) },
    filters.origin !== 'all' && { k: 'origin', label: `${filters.origin} only`, clear: () => set({ origin: 'all' }) },
  ].filter(Boolean) as { k: string; label: string; clear: () => void }[]

  return (
    <section id="catalog" className="section-y border-t border-line bg-white">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Wholesale catalogue"
            title={<>Stock your counter, <em className="font-light italic text-brand-800">by the dozen.</em></>}
            sub="Rates are per piece, pair or set in BDT and step down automatically as your lot grows. Bridal and premium lots are quoted individually."
          />
          <label className="flex cursor-pointer items-center gap-3 self-start text-[13px] text-slate-600 lg:self-auto">
            Show wholesale rates
            <button
              role="switch"
              aria-checked={showPrices}
              aria-label="Show wholesale rates"
              onClick={() => setShowPrices(!showPrices)}
              className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${showPrices ? 'bg-ink' : 'bg-line-strong'}`}
            >
              <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 36 }} className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${showPrices ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </label>
        </div>

        {/* toolbar */}
        <div className="relative z-20 mt-16 border-y border-line bg-white/90 backdrop-blur-xl lg:sticky lg:top-[109px]">
          <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-8">
            <LayoutGroup id="cat">
              <div className="-mb-px flex gap-1 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Category">
                {[{ id: 'all' as const, short: 'All' }, ...CATEGORIES].map((c, ci) => {
                  const active = filters.category === c.id
                  return (
                    <button key={c.id} role="tab" aria-selected={active} onClick={() => set({ category: c.id })} className={`relative shrink-0 px-3 py-5 text-[14px] transition-colors first:pl-0 ${active ? 'font-semibold text-ink' : 'text-slate-600 hover:text-ink'}`}>
                      {c.short}<sup className="num ml-1 text-[10px] font-medium text-slate">{counts[c.id]}</sup>
                      {active && <motion.span layoutId="cat-indicator" className={`absolute bottom-0 right-3 h-[2px] bg-ink ${ci === 0 ? 'left-0' : 'left-3'}`} transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                    </button>
                  )
                })}
              </div>
            </LayoutGroup>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line py-3 lg:ml-auto lg:border-t-0 lg:py-0">
              <div className="flex items-center gap-1" role="group" aria-label="Origin">
                {(['all', 'Thailand', 'Kashmir'] as const).map((o) => {
                  const on = filters.origin === o
                  return (
                    <button key={o} onClick={() => set({ origin: o })} aria-pressed={on} className={`relative inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] transition-colors ${on ? 'font-semibold text-ink' : 'text-slate-600 hover:text-ink'}`}>
                      {on && <motion.span layoutId="origin-indicator" className="absolute inset-0 rounded-full bg-ice ring-1 ring-line-strong" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                      {o !== 'all' && <span className={`relative h-1.5 w-1.5 rounded-full ${o === 'Thailand' ? 'bg-brand-600' : 'bg-gold'}`} />}
                      <span className="relative">{o === 'all' ? 'All origins' : o}</span>
                    </button>
                  )
                })}
              </div>
              <label className="relative flex items-center">
                <span className="sr-only">Sort</span>
                <select value={filters.sort} onChange={(e) => set({ sort: e.target.value as SortKey })} className="h-9 appearance-none bg-transparent pr-6 text-[13px] font-semibold text-ink focus:outline-none">
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Sort: Rate, low to high</option>
                  <option value="price-desc">Sort: Rate, high to low</option>
                  <option value="moq-asc">Sort: Lowest MOQ</option>
                </select>
                <svg aria-hidden viewBox="0 0 10 6" className="pointer-events-none absolute right-0 h-2 w-2.5 text-ink"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex min-h-[32px] flex-wrap items-center gap-2 text-[13px]">
          <p className="num text-slate-600"><span className="font-semibold text-ink">{results.length}</span> wholesale {results.length === 1 ? 'line' : 'lines'}</p>
          <AnimatePresence>
            {activeChips.map((c) => (
              <motion.button key={c.k} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} onClick={c.clear} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line-strong px-3 text-[12px] font-semibold text-ink hover:border-ink">
                {c.label} <X className="h-3 w-3" />
              </motion.button>
            ))}
          </AnimatePresence>
          {activeChips.length > 0 && <button onClick={() => setFilters({ ...DEFAULT_FILTERS, sort: filters.sort })} className="btn-link ml-1 text-[12px]">Reset</button>}
        </div>

        <motion.div layout className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} showPrices={showPrices} onQuickView={onQuickView} />)}
          </AnimatePresence>
        </motion.div>

        {results.length === 0 && (
          <div className="mt-6 grid place-items-center border-y border-line px-6 py-24 text-center">
            <SearchX className="h-8 w-8 text-slate-400" />
            <p className="display mt-6 text-2xl">No lots match those filters</p>
            <p className="mt-2 max-w-sm text-[14px] text-slate-600">New lots land every week. Ask the wholesale desk on WhatsApp for pieces not listed yet.</p>
            <button onClick={() => setFilters(DEFAULT_FILTERS)} className="btn-dark mt-8">Clear filters</button>
          </div>
        )}
      </div>
    </section>
  )
}
