import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { PRODUCTS } from '../data/products'
import { waLink } from '../lib/pricing'
import { WhatsAppIcon } from './ui'

const SHOWCASE = [
  { key: 'bridal', title: 'Bridal Choker & Tikka Sets', origin: 'Kashmir', meta: 'From 3 sets per lot', img: '/products/mix-24.jpg' },
  { key: 'kundan', title: 'Kundan V-Drop Necklace Sets', origin: 'Kashmir', meta: 'From ½ dozen sets', img: '/products/neck-05.jpg' },
  { key: 'jhumka', title: 'Antique Stone Jhumkas', origin: 'Thailand', meta: 'From 2 dozen pairs', img: '/products/jhum-03.jpg' },
  { key: 'waist', title: 'Gold Motif Waist Chains', origin: 'Thailand', meta: 'From 1 dozen', img: '/products/waist-0.jpg' },
]
const N = SHOWCASE.length
const AUTOPLAY = 5200

// depth slots for the fanned stack; slot 3 is the "just dealt" exit position
const SLOT = [
  { x: '0%', y: '0%', z: 0, rotate: 0, scale: 1, opacity: 1 },
  { x: '15%', y: '-3%', z: -60, rotate: 5, scale: 0.92, opacity: 1 },
  { x: '28%', y: '-6%', z: -120, rotate: 10, scale: 0.84, opacity: 0.75 },
  { x: '-26%', y: '4%', z: 40, rotate: -10, scale: 0.96, opacity: 0 },
]

function CardStack() {
  const reduce = useReducedMotion()
  const [front, setFront] = useState(0)
  const [paused, setPaused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sp = { stiffness: 80, damping: 18, mass: 0.9 }
  const rotY = useSpring(useTransform(mx, [0, 1], [-9, 9]), sp)
  const rotX = useSpring(useTransform(my, [0, 1], [7, -7]), sp)
  const sheen = useTransform([mx, my], ([x, y]: number[]) => `radial-gradient(120% 80% at ${x * 100}% ${y * 100}%, rgba(255,255,255,.28), rgba(255,255,255,0) 45%)`)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const lift = useTransform(scrollYProgress, [0, 1], [0, -40])
  const tiltBack = useTransform(scrollYProgress, [0, 1], [0, 10])

  useEffect(() => {
    if (reduce || paused) return
    const t = setTimeout(() => setFront((f) => (f + 1) % N), AUTOPLAY)
    return () => clearTimeout(t)
  }, [front, reduce, paused])

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const go = (d: number) => setFront((f) => (f + d + N) % N)
  const cur = SHOWCASE[front]

  return (
    <div className="relative">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => { mx.set(0.5); my.set(0.5); setPaused(false) }}
        className="relative mx-auto w-[72%] max-w-[400px] -translate-x-[8%] pb-[6%] pt-[8%]"
        style={{ perspective: 1600 }}
        aria-roledescription="carousel"
        aria-label="Featured wholesale collections"
      >
        <motion.div style={reduce ? undefined : { rotateX: rotX, rotateY: rotY, y: lift, transformStyle: 'preserve-3d' }} className="relative">
          <motion.div style={reduce ? undefined : { rotateX: tiltBack, transformStyle: 'preserve-3d' }} className="relative aspect-[4/5]">
            {SHOWCASE.map((item, i) => {
              const k = (i - front + N) % N
              // slot 3 holds the card that just left the front; the rest fan out behind it
              const visualSlot = SLOT[Math.min(k, 3)]
              const isFront = k === 0
              return (
                <motion.button
                  key={item.key}
                  type="button"
                  tabIndex={isFront ? 0 : -1}
                  onClick={() => !isFront && setFront(i)}
                  aria-hidden={!isFront}
                  aria-label={isFront ? `${item.title}, ${item.origin} import` : undefined}
                  initial={false}
                  animate={{ x: visualSlot.x, y: visualSlot.y, z: visualSlot.z, rotate: visualSlot.rotate, scale: visualSlot.scale, opacity: visualSlot.opacity }}
                  transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 60, damping: 17, mass: 1 }}
                  style={{ zIndex: 10 - k, transformStyle: 'preserve-3d', transformOrigin: '50% 100%' }}
                  className="absolute inset-0 cursor-pointer overflow-hidden rounded-[26px] bg-ink shadow-frame ring-1 ring-black/10"
                >
                  <img src={item.img} alt="" className="h-full w-full object-cover" draggable={false} />
                  {/* inner frame + gold hairline */}
                  <span aria-hidden className="pointer-events-none absolute inset-2.5 rounded-[19px] ring-1 ring-gold/40" />
                  {isFront && !reduce && (
                    <>
                      <motion.span aria-hidden style={{ background: sheen }} className="pointer-events-none absolute inset-0" />
                      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                        <span className="absolute inset-y-0 -left-1/2 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </span>
                    </>
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* caption */}
      <div className="mx-auto mt-8 flex w-[86%] max-w-[460px] items-end justify-between gap-6 border-t border-line pt-5">
        <div className="min-w-0" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={cur.key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>
              <p className="num text-[11px] font-semibold uppercase tracking-[0.22em] text-slate">
                {String(front + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                <span className="mx-2 text-line-strong">—</span>
                {cur.origin} import
              </p>
              <p className="display mt-2 truncate text-[22px] leading-tight">{cur.title}</p>
              <p className="num mt-1 text-[13px] text-slate-600">{cur.meta}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => go(-1)} aria-label="Previous collection" className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-ink"><ArrowLeft className="h-4 w-4" /></button>
          <button onClick={() => go(1)} aria-label="Next collection" className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-ink"><ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="mx-auto mt-4 h-px w-[86%] max-w-[460px] overflow-hidden bg-line">
        {!reduce && <motion.div key={`${front}-${paused}`} className="h-full origin-left bg-ink" initial={{ scaleX: 0 }} animate={{ scaleX: paused ? 0 : 1 }} transition={{ duration: paused ? 0.2 : AUTOPLAY / 1000, ease: 'linear' }} />}
      </div>
    </div>
  )
}

export default function Hero({ onExplore }: { onExplore: () => void }) {
  const fade = (d: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: d, ease: [0.22, 1, 0.36, 1] as const } })
  const variants = PRODUCTS.reduce((s, p) => s + p.variants.length, 0)

  const STATS = [
    { v: 'Thailand & Kashmir', k: 'Direct import routes' },
    { v: `${PRODUCTS.length} lines`, k: 'In the current catalogue' },
    { v: `${variants} colourways`, k: 'Across sets, jhumkas & more' },
    { v: '1–3 days', k: 'Dispatch across Bangladesh' },
  ]

  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div aria-hidden className="pointer-events-none absolute right-[-12%] top-[-18%] h-[780px] w-[780px] rounded-full bg-[radial-gradient(closest-side,rgba(30,202,211,.16),rgba(30,202,211,0))]" />
      <div aria-hidden className="pointer-events-none absolute right-[4%] top-[8%] hidden h-[560px] w-[560px] rounded-full border border-brand/25 lg:block" />

      <div className="container-x relative grid items-center gap-16 pb-20 pt-16 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="lg:col-span-6">
          <motion.p {...fade(0)} className="eyebrow"><span>Imported jewellery &amp; cosmetics<span className="hidden sm:inline"> · Wholesale</span></span></motion.p>

          <motion.h1 {...fade(0.08)} className="display mt-8 text-[2.9rem] leading-[0.98] sm:text-[4.2rem] lg:text-[4.6rem] xl:text-[5.2rem]">
            Thailand &amp; Kashmir jewellery,{' '}
            <em className="font-light italic text-brand-800">wholesale by the lot.</em>
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-8 max-w-[34rem] text-[17px] leading-[1.75] text-slate-600">
            Bridal sets, antique jhumkas, waist chains and cosmetics — imported direct and supplied by the dozen and box to retailers, boutiques and bridal studios across Bangladesh.
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button onClick={onExplore} className="btn-dark group h-14 px-8">
              Explore wholesale catalog
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a href={waLink('Assalamu Alaikum BTC Wholesale Desk, I am a retailer and want your latest wholesale catalogue & rates.')} target="_blank" rel="noreferrer" className="btn-ghost h-14 px-7">
              <WhatsAppIcon className="h-[18px] w-[18px] text-[#1FAF55]" /> WhatsApp wholesale desk
            </a>
          </motion.div>

          <motion.p {...fade(0.32)} className="mt-8 text-[13px] text-slate">
            Trade buyers only · Minimum order quantities apply per item
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-6">
          <CardStack />
        </motion.div>
      </div>

      {/* stats rail */}
      <div className="border-y border-line">
        <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.k} className={`py-7 sm:py-8 ${i % 2 ? 'pl-5 sm:pl-8' : 'pr-5'} ${i > 0 ? 'lg:border-l lg:border-line lg:pl-8' : ''} ${i % 2 ? 'border-l border-line' : ''} ${i > 1 ? 'border-t border-line lg:border-t-0' : ''}`}>
              <dd className="display num text-[19px] leading-tight sm:text-[22px]">{s.v}</dd>
              <dt className="mt-1.5 text-[12.5px] text-slate-600">{s.k}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
