import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PRODUCTS, type Product } from '../data/products'
import type { Filters } from '../lib/filters'
import { formatBDT, lowestPrice } from '../lib/pricing'
import { SectionHeading } from './ui'

interface Tab {
  id: string
  label: string
  kicker: string
  title: string
  body: string
  apply: Partial<Filters>
  match: (p: Product) => boolean
  images: string[]
  dark?: boolean
}

const TABS: Tab[] = [
  {
    id: 'th', label: 'Thailand Imports', kicker: 'Origin · TH', title: 'Bangkok-sharp finish, fast-moving lots',
    body: 'AD stone collars, cat-eye jhumkas, waist chains and cosmetics imported from Thailand. Consistent plating, tight colour-matching across a dozen — ideal for daily-wear counters.',
    apply: { origin: 'Thailand' }, match: (p) => p.origin === 'Thailand',
    images: ['/products/neck-01.jpg', '/products/jhum-22.jpg', '/products/waist-3.jpg', '/products/bead-3.jpg'],
  },
  {
    id: 'kr', label: 'Kashmir Imports', kicker: 'Origin · Kashmir', title: 'Artisan kundan, meena & antique craft',
    body: 'Heavier bridal and festive work from Kashmir: kundan V-drops, temple jhumkas, rani haars and textured kada bangles. Built for bridal parlours and premium showrooms.',
    apply: { origin: 'Kashmir' }, match: (p) => p.origin === 'Kashmir',
    images: ['/products/neck-05.jpg', '/products/jhum-00.jpg', '/products/mix-22.jpg', '/products/mix-01.jpg'],
  },
  {
    id: 'bridal', label: 'Bridal & Stone Sets', kicker: 'Collection', title: 'Bridal, party & stone necklace sets',
    body: 'Complete sets with earrings — and tikka on bridal kits. Sold by half-dozen or box of 3 for premium pieces. Request a quote for mixed-colour bridal assortments.',
    apply: { collection: 'bridal' }, match: (p) => p.collections.includes('bridal'),
    images: ['/products/mix-24.jpg', '/products/neck-13.jpg', '/products/bead-0.jpg', '/products/neck-20.jpg'], dark: true,
  },
  {
    id: 'jhumka', label: 'Jhumka Collection', kicker: 'Collection', title: 'Antique & stone jhumkas by the dozen',
    body: 'Our highest-velocity line. Card-packed pairs in 20+ stone colours, sold per dozen or 5-dozen box with deeper tier pricing past 120 pairs.',
    apply: { collection: 'jhumka' }, match: (p) => p.collections.includes('jhumka'),
    images: ['/products/jhum-03.jpg', '/products/jhum-24.jpg', '/products/mix-31.jpg', '/products/jhum-15.jpg'],
  },
  {
    id: 'waist', label: 'Waist Chains & Accessories', kicker: 'Collection', title: 'Kamarbandh, kada & evening clutches',
    body: 'Waist chains in five motifs, textured kada bangle sets, and mother-of-pearl and shell-charm clutches — great add-on margin for jewellery counters.',
    apply: { collection: 'accessories' }, match: (p) => p.collections.includes('accessories'),
    images: ['/products/waist-0.jpg', '/products/mix-00.jpg', '/products/mix-04.jpg', '/products/mix-15.jpg'],
  },
]

export default function Collections({ onApply }: { onApply: (f: Partial<Filters>) => void }) {
  const [active, setActive] = useState(TABS[0].id)
  const tab = TABS.find((t) => t.id === active)!
  const stats = useMemo(() => {
    const items = PRODUCTS.filter(tab.match)
    return {
      skus: items.length,
      variants: items.reduce((s, p) => s + p.variants.length, 0),
      from: Math.min(...items.map(lowestPrice)),
    }
  }, [tab])

  return (
    <section id="collections" className="bg-white py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Origins & collections" title={<>Two import routes.<br className="hidden sm:block" /> Five counters to stock.</>} />
          <p className="max-w-sm text-[15px] leading-relaxed text-slate-600">Pick an origin or collection to preview what's in this month's lots, then jump straight into the filtered catalogue.</p>
        </div>

        <div role="tablist" aria-label="Collections" className="mt-10 flex gap-1 overflow-x-auto rounded-full bg-brand-50 p-1.5 ring-1 ring-brand-100 [scrollbar-width:none]">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={`relative shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5 ${active === t.id ? 'text-white' : 'text-ink/70 hover:text-ink'}`}
            >
              {active === t.id && <motion.span layoutId="collection-tab" className="absolute inset-0 rounded-full bg-ink shadow-card" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab.id}
            role="tabpanel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`mt-6 grid overflow-hidden rounded-[28px] lg:grid-cols-[1fr_1.15fr] ${tab.dark ? 'bg-ink text-white' : 'bg-brand-50 text-ink ring-1 ring-brand-100'}`}
          >
            <div className="flex flex-col justify-between gap-8 p-7 sm:p-10">
              <div>
                <p className={`text-xs font-bold uppercase tracking-[0.18em] ${tab.dark ? 'text-gold-light' : 'text-brand-800'}`}>{tab.kicker}</p>
                <h3 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-[2.1rem]">{tab.title}</h3>
                <p className={`mt-4 max-w-md leading-relaxed ${tab.dark ? 'text-white/75' : 'text-slate-600'}`}>{tab.body}</p>
              </div>
              <dl className={`grid grid-cols-3 gap-4 border-t pt-6 ${tab.dark ? 'border-white/15' : 'border-ink/10'}`}>
                {[
                  { k: 'Wholesale SKUs', v: stats.skus.toString() },
                  { k: 'Colour variants', v: stats.variants.toString() },
                  { k: 'Bulk rate from', v: formatBDT(stats.from) },
                ].map((s) => (
                  <div key={s.k}>
                    <dt className={`text-[11px] font-semibold uppercase tracking-wider ${tab.dark ? 'text-white/55' : 'text-slate'}`}>{s.k}</dt>
                    <dd className="num mt-1 font-display text-2xl font-semibold">{s.v}</dd>
                  </div>
                ))}
              </dl>
              <button
                onClick={() => onApply(tab.apply)}
                className={`btn group w-full sm:w-auto sm:self-start ${tab.dark ? 'bg-brand text-ink hover:bg-brand-600' : 'bg-ink text-white hover:bg-ink-3'}`}
              >
                View {stats.skus} products in catalogue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-3">
              {tab.images.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.92, rotateX: 12 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformPerspective: 800 }}
                  className="group relative aspect-square overflow-hidden rounded-[20px] bg-ink"
                >
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
