import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CATEGORIES, type Category } from '../data/products'
import { useCart } from '../context/CartContext'
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_DISPLAY, waLink } from '../lib/pricing'
import { scrollToId } from '../lib/filters'

interface Props {
  activeCategory: Category | 'all'
  onCategory: (c: Category | 'all') => void
  onSearch: (q: string) => void
  query: string
}

const NAV = [{ id: 'all' as const, label: 'All' }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))]

export default function Header({ activeCategory, onCategory, onSearch, query }: Props) {
  const { count, setOpen, lastAdded } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState(query)
  const [bump, setBump] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  // navigation queued until the menu/search panel has fully collapsed, so offsets are measured on the final layout
  const pending = useRef<(() => void) | null>(null)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))

  useEffect(() => setQ(query), [query])

  // publish the collapsed header height (strip + bar + 1px border) for scroll-margin-top and JS scrolling
  useEffect(() => {
    const set = () => {
      const h = (stripRef.current?.offsetHeight ?? 0) + (barRef.current?.offsetHeight ?? 0) + 1
      document.documentElement.style.setProperty('--header-h', `${h}px`)
    }
    set()
    const ro = new ResizeObserver(set)
    if (stripRef.current) ro.observe(stripRef.current)
    if (barRef.current) ro.observe(barRef.current)
    return () => ro.disconnect()
  }, [])

  /** Close any open panel, then run the navigation once it has finished collapsing. */
  const navigate = (action: () => void) => {
    if (!menu && !searchOpen) return action()
    pending.current = action
    setMenu(false)
    setSearchOpen(false)
  }
  const flush = () => {
    const run = pending.current
    pending.current = null
    run?.()
  }
  const goSection = (id: string) => (e: { preventDefault: () => void }) => {
    e.preventDefault()
    navigate(() => {
      scrollToId(id)
      history.replaceState(null, '', `#${id}`)
    })
  }
  useEffect(() => { if (searchOpen) inputRef.current?.focus() }, [searchOpen])
  useEffect(() => {
    if (!lastAdded) return
    setBump(true)
    const t = setTimeout(() => setBump(false), 500)
    return () => clearTimeout(t)
  }, [lastAdded])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    navigate(() => onSearch(term))
  }

  return (
    <header className="sticky top-0 z-40">
      {/* announcement */}
      <div ref={stripRef} className="border-b border-line bg-ice">
        <div className="container-x flex h-9 items-center justify-center gap-6 text-[12px] text-slate-600 lg:justify-between">
          <p className="truncate">
            <span className="font-semibold text-ink">Wholesale only</span>
            <span className="mx-2 text-line-strong">|</span>
            Thailand &amp; Kashmir imports for retailers across Bangladesh
          </p>
          <div className="num hidden items-center gap-6 lg:flex">
            <a href={`tel:${PHONE_TEL}`} className="hover:text-ink">Call {PHONE_DISPLAY}</a>
            <a href={waLink('Assalamu Alaikum, I want wholesale catalogue & rates.')} target="_blank" rel="noreferrer" className="hover:text-ink">WhatsApp {WHATSAPP_DISPLAY}</a>
          </div>
        </div>
      </div>

      <div className={`border-b transition-[background-color,box-shadow,border-color] duration-500 ${scrolled ? 'border-line bg-white/95 shadow-[0_10px_30px_-24px_rgba(20,24,26,.35)] backdrop-blur-xl' : 'border-transparent bg-white'}`}>
        <div ref={barRef} className="container-x flex h-[72px] items-center gap-6">
          <a href="#top" onClick={(e) => { e.preventDefault(); navigate(() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })) }} className="flex shrink-0 items-center gap-3" aria-label="Billal Trading Corporation, home">
            <img src="/brand/logo.jpg" alt="" className="h-10 w-10 rounded-full" />
            <span className="leading-none">
              <span className="display block text-[19px] !tracking-[-0.01em]">Billal Trading</span>
              <span className="mt-1 block text-[9.5px] font-semibold uppercase tracking-[0.28em] text-slate">Corporation</span>
            </span>
          </a>

          <nav aria-label="Categories" className="mx-auto hidden items-center gap-1 xl:flex">
            {NAV.map((c) => {
              const active = activeCategory === c.id
              return (
                <button key={c.id} onClick={() => navigate(() => onCategory(c.id))} className={`relative px-3.5 py-2 text-[13.5px] font-medium transition-colors ${active ? 'text-ink' : 'text-slate-600 hover:text-ink'}`}>
                  {c.label}
                  {active && <motion.span layoutId="nav-underline" className="absolute inset-x-3.5 -bottom-px h-px bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                </button>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <button onClick={() => setSearchOpen((o) => !o)} aria-label="Search catalogue" aria-expanded={searchOpen} className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-ice">
              {searchOpen ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
            </button>
            <motion.button
              animate={bump ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 0.45 }}
              onClick={() => setOpen(true)}
              className="inline-flex h-11 items-center gap-2.5 rounded-full border border-ink/15 pl-4 pr-1.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-ink/40"
              aria-label={`Open bulk order bag, ${count} lines`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Bulk Bag</span>
              <span className={`num grid h-8 min-w-8 place-items-center rounded-full px-2 text-[12px] font-bold transition-colors ${count ? 'bg-brand text-ink' : 'bg-ice text-slate-600'}`}>{count}</span>
            </motion.button>
            <button onClick={() => setMenu((o) => !o)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ice xl:hidden" aria-label="Menu" aria-expanded={menu}>
              {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false} onExitComplete={flush}>
          {searchOpen && (
            <motion.div key="search" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden border-t border-line bg-white">
              <form onSubmit={submit} role="search" className="container-x flex items-center gap-4 py-5">
                <Search className="h-5 w-5 shrink-0 text-slate" />
                <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search kundan sets, jhumkas, waist chains, SKU…" aria-label="Search wholesale catalogue" className="display h-12 min-w-0 flex-1 bg-transparent text-xl placeholder:text-slate-400 focus:outline-none sm:text-2xl" />
                <button type="submit" className="btn-dark hidden h-11 px-6 sm:inline-flex">Search</button>
              </form>
            </motion.div>
          )}
          {menu && (
            <motion.div key="menu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden border-t border-line bg-white xl:hidden">
              <div className="container-x py-4">
                <ul className="divide-y divide-line">
                  {NAV.map((c) => (
                    <li key={c.id}>
                      <button onClick={() => navigate(() => onCategory(c.id))} className={`flex w-full items-center justify-between py-3.5 text-left text-[15px] ${activeCategory === c.id ? 'font-semibold text-ink' : 'text-slate-600'}`}>
                        {c.id === 'all' ? 'All wholesale lines' : c.label}
                        {activeCategory === c.id && <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />}
                      </button>
                    </li>
                  ))}
                  <li><a href="#how" onClick={goSection('how')} className="block py-3.5 text-[15px] text-slate-600">How ordering works</a></li>
                  <li><a href="#contact" onClick={goSection('contact')} className="block py-3.5 text-[15px] text-slate-600">Contact the desk</a></li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
