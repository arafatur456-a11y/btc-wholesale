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
}

const TABS: Tab[] = [
  {
    id: 'th', label: 'Thailand Imports', kicker: 'Origin · Thailand', title: 'Bangkok-sharp finish, fast-moving lots',
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
    images: ['/products/mix-24.jpg', '/products/neck-13.jpg', '/products/bead-0.jpg', '/products/neck-20.jpg'],
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
    <section id="collections" className="section-y bg-ice">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Origins & collections" title={<>Two import routes. <em className="font-light italic text-brand-800">Five counters to stock.</em></>} />
          <p className="max-w-sm text-[15px] leading-[1.75] text-slate-600">Preview what is in this month&rsquo;s lots, then open the catalogue already filtered to that collection.</p>
        </div>

        <div role="tablist" aria-label="Collections" className="mt-16 flex gap-2 overflow-x-auto border-b border-line-strong [scrollbar-width:none] sm:gap-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={`relative shrink-0 px-2 pb-4 pt-1 text-[14px] transition-colors first:pl-0 sm:px-0 ${active === t.id ? 'font-semibold text-ink' : 'text-slate-600 hover:text-ink'}`}
            >
              {t.label}
              {active === t.id && <motion.span layoutId="collection-tab" className="absolute inset-x-0 -bottom-px h-[2px] bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab.id}
            role="tabpanel"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10"
          >
            <div className="flex flex-col justify-between gap-12 lg:col-span-5 lg:py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate">{tab.kicker}</p>
                <h3 className="display mt-5 text-[2rem] leading-[1.1] sm:text-[2.5rem]">{tab.title}</h3>
                <p className="mt-6 max-w-md text-[15.5px] leading-[1.8] text-slate-600">{tab.body}</p>
              </div>
              <div>
                <dl className="grid grid-cols-3 border-y border-line-strong">
                  {[
                    { k: 'Wholesale lines', v: stats.skus.toString() },
                    { k: 'Colourways', v: stats.variants.toString() },
                    { k: 'Rates from', v: formatBDT(stats.from) },
                  ].map((s, i) => (
                    <div key={s.k} className={`py-6 ${i ? 'border-l border-line-strong pl-5' : ''}`}>
                      <dd className="display num text-[26px] leading-none sm:text-[30px]">{s.v}</dd>
                      <dt className="mt-2 text-[12px] text-slate-600">{s.k}</dt>
                    </div>
                  ))}
                </dl>
                <button onClick={() => onApply(tab.apply)} className="btn-dark group mt-10">
                  View {stats.skus} lines in the catalogue <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-7">
              {tab.images.slice(0, 2).map((src, i) => (
                <motion.figure
                  key={src}
                  initial={{ opacity: 0, y: 24, rotateX: 6 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformPerspective: 1000 }}
                  className={`group relative aspect-[4/5] overflow-hidden rounded-[22px] bg-ink ring-1 ring-black/5 ${i === 1 ? 'mt-12 sm:mt-20' : ''}`}
                >
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]" />
                </motion.figure>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
