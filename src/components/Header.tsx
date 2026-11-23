import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, Phone, Search, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { CATEGORIES, type Category } from '../data/products'
import { useCart } from '../context/CartContext'
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_DISPLAY, waLink } from '../lib/pricing'
import { WhatsAppIcon } from './ui'

interface Props {
  activeCategory: Category | 'all'
  onCategory: (c: Category | 'all') => void
  onSearch: (q: string) => void
  query: string
}

export default function Header({ activeCategory, onCategory, onSearch, query }: Props) {
  const { count, setOpen, lastAdded } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [q, setQ] = useState(query)
  const [bump, setBump] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 12))

  useEffect(() => setQ(query), [query])
  useEffect(() => {
    if (!lastAdded) return
    setBump(true)
    const t = setTimeout(() => setBump(false), 450)
    return () => clearTimeout(t)
  }, [lastAdded])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSearch(q.trim())
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40">
      {/* utility strip */}
      <div className="bg-ink text-white">
        <div className="container-x flex h-9 items-center justify-between gap-4 text-[12px]">
          <p className="truncate font-medium text-white/85">
            <span className="mr-2 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-brand align-middle" />
            Wholesale business only — retailers, boutiques & resellers across Bangladesh
          </p>
          <div className="hidden items-center gap-5 sm:flex">
            <a href={`tel:${PHONE_TEL}`} className="num inline-flex items-center gap-1.5 text-white/85 hover:text-white"><Phone className="h-3.5 w-3.5" />{PHONE_DISPLAY}</a>
            <a href={waLink('Assalamu Alaikum, I want wholesale catalogue & rates.')} target="_blank" rel="noreferrer" className="num inline-flex items-center gap-1.5 text-white/85 hover:text-white"><WhatsAppIcon className="h-3.5 w-3.5" />{WHATSAPP_DISPLAY}</a>
          </div>
        </div>
      </div>

      <div className={`border-b transition-all duration-300 ${scrolled ? 'border-ink/10 bg-white/90 shadow-[0_8px_30px_-18px_rgba(20,24,26,.35)] backdrop-blur-xl' : 'border-transparent bg-white'}`}>
        <div className="container-x flex h-16 items-center gap-3 lg:gap-6">
          <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="Billal Trading Corporation home">
            <img src="/brand/logo.jpg" alt="" className="h-10 w-10 rounded-full ring-2 ring-white shadow-card" />
            <span className="leading-tight">
              <span className="block font-display text-[17px] font-semibold tracking-tight text-ink">Billal Trading</span>
              <span className="block text-[10.5px] font-semibold uppercase tracking-[0.16em] text-slate">Corporation · BTC</span>
            </span>
          </a>

          <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-gold/50 bg-gold-50 px-3 py-1 text-[11.5px] font-bold text-gold-dark xl:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />Wholesale Only • TH &amp; KR Imports
          </span>

          <form onSubmit={submit} role="search" className="relative ml-auto hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              placeholder="Search sets, jhumkas, SKU…"
              aria-label="Search wholesale catalogue"
              className="h-11 w-full rounded-full border border-ink/10 bg-brand-50 pl-10 pr-24 text-sm placeholder:text-slate focus:border-brand-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white hover:bg-ink-3">Search</button>
          </form>

          <motion.button
            animate={bump ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            onClick={() => setOpen(true)}
            className="relative ml-auto inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-brand pl-3.5 pr-4 text-sm font-semibold text-ink shadow-card hover:bg-brand-600 md:ml-0"
            aria-label={`Open bulk order bag, ${count} items`}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">Bulk Bag</span>
            <span className="num grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1.5 text-[11px] font-bold text-white">{count}</span>
          </motion.button>

          <button onClick={() => setMobileOpen((o) => !o)} className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 lg:hidden" aria-label="Menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* category row */}
        <nav aria-label="Categories" className="hidden border-t border-ink/5 lg:block">
          <div className="container-x flex h-11 items-center gap-1">
            {[{ id: 'all' as const, label: 'All Wholesale' }, ...CATEGORIES].map((c) => {
              const active = activeCategory === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => onCategory(c.id)}
                  className={`relative rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${active ? 'text-ink' : 'text-slate-600 hover:text-ink'}`}
                >
                  {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-brand-100" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="relative">{c.label}</span>
                </button>
              )
            })}
            <span className="mx-2 h-4 w-px bg-ink/10" />
            <a href="#how" className="px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:text-ink">How Ordering Works</a>
            <a href="#contact" className="px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:text-ink">Contact</a>
            <span className="ml-auto text-[12px] font-medium text-slate">Lots ship nationwide · 1–3 days</span>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-ink/5 bg-white lg:hidden"
            >
              <div className="container-x space-y-4 py-4">
                <form onSubmit={submit} role="search" className="relative md:hidden">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search sets, jhumkas, SKU…" aria-label="Search wholesale catalogue" className="input h-11 rounded-full pl-10" />
                </form>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold-50 px-3 py-1 text-[11.5px] font-bold text-gold-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />Wholesale Only • TH &amp; KR Imports
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[{ id: 'all' as const, label: 'All Wholesale' }, ...CATEGORIES].map((c) => (
                    <button key={c.id} onClick={() => { onCategory(c.id); setMobileOpen(false) }} className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold ${activeCategory === c.id ? 'border-brand-700 bg-brand-50' : 'border-ink/10'}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4 text-sm font-semibold text-slate-600">
                  <a href="#how" onClick={() => setMobileOpen(false)}>How Ordering Works</a>
                  <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
