import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { PRODUCTS } from '../data/products'
import { waLink } from '../lib/pricing'
import { WhatsAppIcon } from './ui'
import { useIsMobile } from '../lib/motion'

const SHOWCASE = [
  { key: 'bridal', title: 'Bridal Choker & Tikka Sets', origin: 'Kashmir', meta: 'From 3 sets per lot', img: '/products/mix-24.jpg' },
  { key: 'kundan', title: 'Kundan V-Drop Necklace Sets', origin: 'Kashmir', meta: 'From ½ dozen sets', img: '/products/neck-05.jpg' },
  { key: 'jhumka', title: 'Antique Stone Jhumkas', origin: 'Thailand', meta: 'From 2 dozen pairs', img: '/products/jhum-03.jpg' },
  { key: 'waist', title: 'Gold Motif Waist Chains', origin: 'Thailand', meta: 'From 1 dozen', img: '/products/waist-0.jpg' },
]
const N = SHOWCASE.length

/**
 * Desktop keeps the slow, luxury pacing. Mobile (<768px) starts promptly and moves on a
 * duration-based spring with almost no bounce: quick to respond, but eased in and out so it
 * glides instead of snapping. Scroll-linked motion is over-damped so touch-scroll jitter is absorbed.
 */
const TIMING = {
  desktop: {
    autoplay: 5200,
    firstAutoplay: 5200,
    slot: { type: 'spring' as const, stiffness: 60, damping: 17, mass: 1 },
    fan: { stiffness: 110, damping: 26, mass: 0.5 },
    fanOffset: ['start 30%', 'end start'] as const,
    tilt: { stiffness: 80, damping: 18, mass: 0.9 },
    caption: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
    enter: { duration: 1, step: 0.08, stack: { duration: 1.2, delay: 0.2 } },
    lite: false,
  },
  mobile: {
    autoplay: 3800,
    firstAutoplay: 2400, // first card change comes sooner, so the showcase feels alive right away
    slot: { type: 'spring' as const, visualDuration: 0.62, bounce: 0.06 },
    fan: { stiffness: 90, damping: 24, mass: 0.6, restDelta: 0.0005 },
    fanOffset: ['start 85%', 'end start'] as const,
    tilt: { stiffness: 80, damping: 18, mass: 0.9 },
    caption: { duration: 0.32, ease: [0.25, 0.1, 0.25, 1] as const },
    enter: { duration: 0.6, step: 0.05, stack: { duration: 0.7, delay: 0.08 } },
    lite: true, // skip pointer-only sheen and the animated blur glow: fewer layers to paint per frame
  },
}
type Timing = (typeof TIMING)['desktop'] | (typeof TIMING)['mobile']

// depth slots for the fanned stack; slot 3 holds the card that just left the front
const SLOT = [
  { x: '0%', y: '0%', z: 0, rotate: 0, scale: 1, opacity: 1 },
  { x: '15%', y: '-3%', z: -70, rotate: 5, scale: 0.92, opacity: 1 },
  { x: '28%', y: '-6%', z: -140, rotate: 10, scale: 0.84, opacity: 0.8 },
  { x: '-26%', y: '4%', z: 40, rotate: -10, scale: 0.96, opacity: 0 },
]

interface CardProps {
  item: (typeof SHOWCASE)[number]
  k: number
  fan: MotionValue<number>
  sheen: MotionValue<string>
  tint: MotionValue<string>
  reduce: boolean
  slotTransition: Timing['slot']
  lite: boolean
  onPick: () => void
}

/** One card: outer layer = scroll-linked fan-out, inner layer = carousel slot spring. */
function StackCard({ item, k, fan, sheen, tint, reduce, slotTransition, lite, onPick }: CardProps) {
  const isFront = k === 0
  const depthIdx = Math.min(k, 2)
  // as the hero scrolls away, the stack spreads apart in 3D: back cards swing out further
  const fx = useTransform(fan, [0, 1], ['0%', `${depthIdx * 9}%`])
  const fy = useTransform(fan, [0, 1], ['0%', `${-depthIdx * 3 - (isFront ? -4 : 0)}%`])
  const fz = useTransform(fan, [0, 1], [0, isFront ? 60 : -depthIdx * 50])
  const fr = useTransform(fan, [0, 1], [0, depthIdx * 4 + (isFront ? -3 : 0)])
  const fry = useTransform(fan, [0, 1], [0, -8 - depthIdx * 6])
  const slot = SLOT[Math.min(k, 3)]

  return (
    <motion.div
      className="absolute inset-0"
      style={reduce ? { zIndex: 10 - k } : { x: fx, y: fy, z: fz, rotateZ: fr, rotateY: fry, zIndex: 10 - k, transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      <motion.button
        type="button"
        tabIndex={isFront ? 0 : -1}
        onClick={() => !isFront && onPick()}
        aria-hidden={!isFront}
        aria-label={isFront ? `${item.title}, ${item.origin} import` : undefined}
        initial={false}
        animate={{ x: slot.x, y: slot.y, z: slot.z, rotate: slot.rotate, scale: slot.scale, opacity: slot.opacity }}
        transition={reduce ? { duration: 0 } : slotTransition}
        style={{ transformStyle: 'preserve-3d', transformOrigin: '50% 100%', willChange: 'transform, opacity' }}
        className={`absolute inset-0 cursor-pointer rounded-[28px] p-[1.5px] ${lite ? 'shadow-lift' : 'shadow-frame'}`}
      >
        {/* rim light: warm gold → brand cyan */}
        <span aria-hidden className="absolute inset-0 rounded-[28px] bg-[conic-gradient(from_210deg_at_50%_50%,#C9A23F,#F3E2A6_18%,#1ECAD3_38%,#0B6A70_55%,#C9A23F_75%,#E8D08A_90%,#C9A23F)] opacity-90" />
        <span className="relative block h-full w-full overflow-hidden rounded-[26.5px] bg-ink">
          <img src={item.img} alt="" className="h-full w-full object-cover" draggable={false} />
          <span aria-hidden className="pointer-events-none absolute inset-2.5 rounded-[19px] ring-1 ring-white/15" />
          {!isFront && <span aria-hidden className="absolute inset-0 bg-ink/25" />}
          {isFront && !reduce && (
            <>
              {!lite && <motion.span aria-hidden style={{ background: sheen }} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />}
              <motion.span aria-hidden style={{ background: tint }} className={`pointer-events-none absolute inset-0 ${lite ? 'opacity-70' : 'mix-blend-overlay'}`} />
              <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <span className="absolute inset-y-0 -left-1/2 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </span>
            </>
          )}
        </span>
      </motion.button>
    </motion.div>
  )
}

function CardStack({ t }: { t: Timing }) {
  const reduce = !!useReducedMotion()
  const [front, setFront] = useState(0)
  const [paused, setPaused] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const swipe = useRef<{ x: number; y: number } | null>(null)

  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sp = t.tilt
  const rotY = useSpring(useTransform(mx, [0, 1], [-10, 10]), sp)
  const rotX = useSpring(useTransform(my, [0, 1], [8, -8]), sp)
  const sheen = useTransform([mx, my], ([x, y]: number[]) => `radial-gradient(120% 80% at ${x * 100}% ${y * 100}%, rgba(255,255,255,.55), rgba(255,255,255,0) 50%)`)

  // scroll-linked depth: progress 0 → 1 as the stack travels from rest to leaving the viewport
  const { scrollYProgress } = useScroll({ target: ref, offset: [...t.fanOffset] })
  const fan = useSpring(scrollYProgress, t.fan)
  const lift = useTransform(fan, [0, 1], [0, -70])
  const tiltBack = useTransform(fan, [0, 1], [0, 22])
  const swing = useTransform(fan, [0, 1], [0, -14])
  const tint = useTransform(fan, [0, 0.5, 1], ['rgba(201,162,63,0.18)', 'rgba(232,208,138,0.12)', 'rgba(30,202,211,0.32)'])
  const glow = useTransform(fan, [0, 1], ['rgba(201,162,63,0.35)', 'rgba(30,202,211,0.45)'])
  const floor = useTransform(glow, (c) => `radial-gradient(closest-side, ${c}, transparent)`)

  useEffect(() => {
    if (reduce || paused) return
    const id = setTimeout(() => { setFront((f) => (f + 1) % N); setAdvanced(true) }, advanced ? t.autoplay : t.firstAutoplay)
    return () => clearTimeout(id)
  }, [front, reduce, paused, advanced, t.autoplay, t.firstAutoplay])
  const delay = advanced ? t.autoplay : t.firstAutoplay

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const go = (d: number) => { setAdvanced(true); setFront((f) => (f + d + N) % N) }
  const cur = SHOWCASE[front]

  return (
    <div className="relative">
      <div
        ref={ref}
        onPointerMove={onMove}
        // hover-pause is for mouse only: on touch, a tap fires enter+leave and would restart the timer
        onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
        onPointerLeave={(e) => { mx.set(0.5); my.set(0.5); if (e.pointerType === 'mouse') setPaused(false) }}
        // horizontal swipe on touch: responds immediately with the same cushioned spring
        onPointerDown={(e) => { if (e.pointerType !== 'mouse') swipe.current = { x: e.clientX, y: e.clientY } }}
        onPointerUp={(e) => {
          const st = swipe.current; swipe.current = null
          if (!st) return
          const dx = e.clientX - st.x, dy = e.clientY - st.y
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1)
        }}
        onPointerCancel={() => { swipe.current = null }}
        className="relative mx-auto w-[72%] max-w-[400px] -translate-x-[8%] pb-[6%] pt-[8%]"
        style={{ perspective: 1600, touchAction: 'pan-y' }}
        aria-roledescription="carousel"
        aria-label="Featured wholesale collections"
      >
        {/* floor glow that shifts gold → cyan with scroll */}
        {!reduce && !t.lite && <motion.div aria-hidden style={{ background: floor }} className="absolute -bottom-[2%] left-[5%] h-[18%] w-[110%] blur-2xl" />}
        {!reduce && t.lite && <div aria-hidden className="absolute -bottom-[2%] left-[5%] h-[18%] w-[110%] bg-[radial-gradient(closest-side,rgba(30,202,211,0.28),transparent)]" />}
        <motion.div style={reduce ? undefined : { rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }} className="relative">
          <motion.div style={reduce ? undefined : { rotateX: tiltBack, rotateY: swing, y: lift, transformStyle: 'preserve-3d' }} className="relative aspect-[4/5]">
            {SHOWCASE.map((item, i) => (
              <StackCard key={item.key} item={item} k={(i - front + N) % N} fan={fan} sheen={sheen} tint={tint} reduce={reduce} slotTransition={t.slot} lite={t.lite} onPick={() => { setAdvanced(true); setFront(i) }} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* caption */}
      <div className="mx-auto mt-8 flex w-[86%] max-w-[460px] items-end justify-between gap-6 border-t border-line pt-5">
        <div className="min-w-0" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={cur.key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={reduce ? { duration: 0 } : t.caption}>
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
        {!reduce && <motion.div key={`${front}-${paused}`} className="h-full origin-left bg-ink" initial={{ scaleX: 0 }} animate={{ scaleX: paused ? 0 : 1 }} transition={{ duration: paused ? 0.2 : delay / 1000, ease: 'linear' }} />}
      </div>
    </div>
  )
}

export default function Hero({ onExplore }: { onExplore: () => void }) {
  const t = useIsMobile() ? TIMING.mobile : TIMING.desktop
  // d = stagger index; mobile uses shorter durations and tighter stagger
  const fade = (d: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: t.enter.duration, delay: d * t.enter.step, ease: [0.22, 1, 0.36, 1] as const } })
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

          <motion.h1 {...fade(1)} className="display mt-8 text-[2.9rem] leading-[0.98] sm:text-[4.2rem] lg:text-[4.6rem] xl:text-[5.2rem]">
            Thailand &amp; Kashmir jewellery,{' '}
            <em className="font-light italic text-brand-800">wholesale by the lot.</em>
          </motion.h1>

          <motion.p {...fade(2)} className="mt-8 max-w-[34rem] text-[17px] leading-[1.75] text-slate-600">
            Bridal sets, antique jhumkas, waist chains and cosmetics — imported direct and supplied by the dozen and box to retailers, boutiques and bridal studios across Bangladesh.
          </motion.p>

          <motion.div {...fade(3)} className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button onClick={onExplore} className="btn-dark group h-14 px-8">
              Explore wholesale catalog
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a href={waLink('Assalamu Alaikum BTC Wholesale Desk, I am a retailer and want your latest wholesale catalogue & rates.')} target="_blank" rel="noreferrer" className="btn-ghost h-14 px-7">
              <WhatsAppIcon className="h-[18px] w-[18px] text-[#1FAF55]" /> WhatsApp wholesale desk
            </a>
          </motion.div>

          <motion.p {...fade(4)} className="mt-8 text-[13px] text-slate">
            Trade buyers only · Minimum order quantities apply per item
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ ...t.enter.stack, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-6">
          <CardStack t={t} />
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
