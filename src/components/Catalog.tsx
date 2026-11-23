import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { SearchX, SlidersHorizontal, X } from 'lucide-react'
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
    <section id="catalog" className="bg-brand-50/60 py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Wholesale catalogue"
            title="Stock your counter by the dozen"
            sub="Tier prices drop automatically as your lot grows. Prices are per piece / pair / set in BDT; premium bridal lots are quoted individually."
          />
          <label className="flex cursor-pointer items-center gap-3 self-start rounded-full bg-white px-4 py-2.5 shadow-card ring-1 ring-ink/5 lg:self-auto">
            <span className="text-sm font-semibold text-ink">Show wholesale prices</span>
            <button
              role="switch"
              aria-checked={showPrices}
              onClick={() => setShowPrices(!showPrices)}
              className={`relative h-6 w-11 rounded-full transition-colors ${showPrices ? 'bg-brand-700' : 'bg-ink/20'}`}
            >
              <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 34 }} className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${showPrices ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </label>
        </div>

        {/* toolbar */}
        <div className="relative z-20 mt-10 lg:sticky rounded-3xl bg-white/90 p-2 shadow-card ring-1 ring-ink/5 backdrop-blur-xl lg:top-[144px]">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <LayoutGroup id="cat">
              <div className="flex gap-1 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Category">
                {[{ id: 'all' as const, short: 'All' }, ...CATEGORIES].map((c) => {
                  const active = filters.category === c.id
                  return (
                    <button key={c.id} role="tab" aria-selected={active} onClick={() => set({ category: c.id })} className={`relative shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${active ? 'text-ink' : 'text-slate-600 hover:text-ink'}`}>
                      {active && <motion.span layoutId="cat-indicator" className="absolute inset-0 rounded-full bg-brand" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                      <span className="relative">{c.short} <span className="num opacity-60">{counts[c.id]}</span></span>
                    </button>
                  )
                })}
              </div>
            </LayoutGroup>

            <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
              <div className="flex rounded-full bg-brand-50 p-1 ring-1 ring-brand-100" role="group" aria-label="Origin">
                {(['all', 'Thailand', 'Kashmir'] as const).map((o) => (
                  <button key={o} onClick={() => set({ origin: o })} aria-pressed={filters.origin === o} className={`relative rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${filters.origin === o ? 'text-white' : 'text-ink/70 hover:text-ink'}`}>
                    {filters.origin === o && <motion.span layoutId="origin-indicator" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <span className="relative">{o === 'all' ? 'All origins' : o}</span>
                  </button>
                ))}
              </div>
              <label className="relative flex items-center">
                <SlidersHorizontal className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate" />
                <span className="sr-only">Sort</span>
                <select value={filters.sort} onChange={(e) => set({ sort: e.target.value as SortKey })} className="h-9 appearance-none rounded-full border border-ink/10 bg-white pl-8 pr-8 text-xs font-semibold text-ink focus:border-brand-700 focus:outline-none">
                  <option value="featured">Featured lots</option>
                  <option value="price-asc">Bulk rate: low → high</option>
                  <option value="price-desc">Bulk rate: high → low</option>
                  <option value="moq-asc">Lowest MOQ first</option>
                </select>
                <svg aria-hidden viewBox="0 0 10 6" className="pointer-events-none absolute right-3 h-2 w-2.5 text-slate"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-5 flex min-h-[32px] flex-wrap items-center gap-2 text-sm">
          <p className="num font-semibold text-ink">{results.length} wholesale {results.length === 1 ? 'line' : 'lines'}</p>
          <AnimatePresence>
            {activeChips.map((c) => (
              <motion.button key={c.k} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={c.clear} className="chip bg-ink py-1.5 text-white hover:bg-ink-3">
                {c.label} <X className="h-3 w-3" />
              </motion.button>
            ))}
          </AnimatePresence>
          {activeChips.length > 0 && <button onClick={() => setFilters({ ...DEFAULT_FILTERS, sort: filters.sort })} className="text-xs font-semibold text-brand-800 underline-offset-2 hover:underline">Reset all</button>}
        </div>

        <motion.div layout className="mt-6 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} showPrices={showPrices} onQuickView={onQuickView} />)}
          </AnimatePresence>
        </motion.div>

        {results.length === 0 && (
          <div className="mt-6 grid place-items-center rounded-3xl border border-dashed border-ink/15 bg-white px-6 py-16 text-center">
            <SearchX className="h-10 w-10 text-slate-400" />
            <p className="mt-4 font-display text-xl font-semibold">No lots match those filters</p>
            <p className="mt-1 max-w-sm text-sm text-slate-600">New lots land every week — ask the wholesale desk on WhatsApp for items not listed yet.</p>
            <button onClick={() => setFilters(DEFAULT_FILTERS)} className="btn-dark mt-6">Clear filters</button>
          </div>
        )}
      </div>
    </section>
  )
}
