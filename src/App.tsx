import { MotionConfig } from 'framer-motion'
import { useCallback, useState } from 'react'
import CartDrawer from './components/CartDrawer'
import Catalog from './components/Catalog'
import Collections from './components/Collections'
import Footer, { Contact } from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import QuickView from './components/QuickView'
import { WhatsAppIcon } from './components/ui'
import { CartProvider } from './context/CartContext'
import type { Category, Product } from './data/products'
import { DEFAULT_FILTERS, scrollToId, type Filters } from './lib/filters'
import { waLink } from './lib/pricing'

export default function App() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [showPrices, setShowPrices] = useState(true)
  const [qv, setQv] = useState<{ product: Product; variant: string } | null>(null)

  const goCatalog = () => requestAnimationFrame(() => scrollToId('catalog'))
  const onCategory = (c: Category | 'all') => { setFilters((f) => ({ ...f, category: c, collection: 'all' })); goCatalog() }
  const onSearch = (q: string) => { setFilters({ ...DEFAULT_FILTERS, query: q }); goCatalog() }
  const onApply = (patch: Partial<Filters>) => { setFilters({ ...DEFAULT_FILTERS, ...patch }); goCatalog() }
  const closeQv = useCallback(() => setQv(null), [])

  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <a href="#catalog" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Skip to catalogue</a>
        <Header activeCategory={filters.category} onCategory={onCategory} onSearch={onSearch} query={filters.query} />
        <main>
          <Hero onExplore={() => scrollToId('catalog')} />
          <Collections onApply={onApply} />
          <Catalog filters={filters} setFilters={setFilters} showPrices={showPrices} setShowPrices={setShowPrices} onQuickView={(p, v) => setQv({ product: p, variant: v })} />
          <HowItWorks />
          <Contact />
        </main>
        <Footer onCategory={onCategory} />
        <QuickView product={qv?.product ?? null} initialVariant={qv?.variant} showPrices={showPrices} onClose={closeQv} />
        <CartDrawer />
        <a href={waLink('Assalamu Alaikum BTC Wholesale Desk!')} target="_blank" rel="noreferrer" aria-label="Chat with BTC on WhatsApp" className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#1FAF55] text-white shadow-lift transition-transform hover:scale-105">
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      </CartProvider>
    </MotionConfig>
  )
}
