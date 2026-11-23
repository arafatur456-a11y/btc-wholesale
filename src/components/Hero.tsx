import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, BadgeCheck, Layers, Plane, Truck } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { waLink } from '../lib/pricing'
import { WhatsAppIcon } from './ui'

const SHOWCASE = [
  { key: 'bridal', title: 'Bridal & Party Sets', origin: 'Kashmir Import', img: '/products/mix-24.jpg', meta: 'From 3 sets / lot', tone: 'from-[#6E1A26]/80' },
  { key: 'jhumka', title: 'Antique Stone Jhumkas', origin: 'Thailand Import', img: '/products/jhum-03.jpg', meta: 'From 2 dozen pairs', tone: 'from-brand-900/80' },
  { key: 'waist', title: 'Waist Chains', origin: 'Thailand Import', img: '/products/waist-0.jpg', meta: 'From 1 dozen', tone: 'from-ink/80' },
  { key: 'kundan', title: 'Kundan Necklace Sets', origin: 'Kashmir Import', img: '/products/neck-05.jpg', meta: 'From ½ dozen sets', tone: 'from-[#4A0F1A]/80' },
]

// slot positions around a shallow 3D arc: front, right, back, left
const SLOTS = [
  { x: '0%', z: 120, rotateY: 0, scale: 1, opacity: 1, zIndex: 4, blur: 0 },
  { x: '58%', z: -60, rotateY: -32, scale: 0.78, opacity: 0.95, zIndex: 3, blur: 0 },
  { x: '0%', z: -220, rotateY: 0, scale: 0.6, opacity: 0.55, zIndex: 1, blur: 2 },
  { x: '-58%', z: -60, rotateY: 32, scale: 0.78, opacity: 0.95, zIndex: 3, blur: 0 },
]

const TRUST = [
  { icon: Plane, title: 'Direct TH & Kashmir sourcing', sub: 'No middlemen, import-fresh lots' },
  { icon: Layers, title: 'Bulk lot pricing', sub: 'Tiered rates by dozen & box' },
  { icon: Truck, title: 'Nationwide BD dispatch', sub: 'Courier & cargo, 1–3 days' },
]

function ShowcaseStage() {
  const reduce = useReducedMotion()
  const [front, setFront] = useState(0)
  const [paused, setPaused] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sp = { stiffness: 90, damping: 18, mass: 0.8 }
  const rotY = useSpring(useTransform(mx, [-1, 1], [-10, 10]), sp)
  const rotX = useSpring(useTransform(my, [-1, 1], [8, -8]), sp)
  const ringX = useSpring(useTransform(mx, [-1, 1], [-18, 18]), sp)
  const ringY = useSpring(useTransform(my, [-1, 1], [-12, 12]), sp)

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end start'] })
  const scrollTilt = useTransform(scrollYProgress, [0, 1], [0, 14])
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 60])

  useEffect(() => {
    if (reduce || paused) return
    const t = setInterval(() => setFront((f) => (f + 1) % SHOWCASE.length), 4200)
    return () => clearInterval(t)
  }, [reduce, paused])

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  return (
    <div
      ref={stageRef}
      onPointerMove={onMove}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => { mx.set(0); my.set(0); setPaused(false) }}
      className="relative mx-auto aspect-[1/1] w-full max-w-[560px] select-none"
      style={{ perspective: 1400 }}
      aria-roledescription="carousel"
      aria-label="Featured wholesale collections"
    >
      {/* turquoise disc + gold orbit ring (echo of the BTC mark) */}
      <motion.div aria-hidden style={{ x: ringX, y: ringY }} className="absolute inset-[6%] rounded-full bg-gradient-to-br from-brand to-brand-600 shadow-lift" />
      <motion.div aria-hidden style={{ x: ringX, y: ringY }} className="absolute inset-[2%] rounded-full border-[10px] border-white/90 [clip-path:polygon(0_0,62%_0,62%_100%,0_100%)]" />
      <div aria-hidden className="absolute inset-[-2%] animate-spinslow rounded-full border border-dashed border-gold/50" />
      <div aria-hidden className="absolute left-1/2 top-[86%] h-10 w-[62%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-2xl" />

      <motion.div
        style={reduce ? undefined : { rotateY: rotY, rotateX: rotX, y: scrollY, rotateZ: 0, transformStyle: 'preserve-3d' }}
        className="absolute inset-0"
      >
        <motion.div style={reduce ? undefined : { rotateX: scrollTilt, transformStyle: 'preserve-3d' }} className="absolute inset-0">
          {SHOWCASE.map((item, i) => {
            const slot = SLOTS[(i - front + SHOWCASE.length) % SHOWCASE.length]
            const isFront = slot.zIndex === 4
            return (
              <motion.button
                key={item.key}
                type="button"
                onClick={() => setFront(i)}
                aria-label={`Show ${item.title}`}
                aria-current={isFront}
                initial={false}
                animate={{ x: slot.x, z: slot.z, rotateY: slot.rotateY, scale: slot.scale, opacity: slot.opacity, filter: `blur(${slot.blur}px)` }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 70, damping: 16, mass: 0.9 }}
                style={{ zIndex: slot.zIndex, transformStyle: 'preserve-3d' }}
                className="absolute left-[22%] top-[14%] w-[56%] cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-[22px] bg-ink p-1.5 shadow-lift ring-1 ring-gold/60">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[17px]">
                    <img src={item.img} alt="" className="h-full w-full object-cover" draggable={false} />
                    <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t ${item.tone} to-transparent`} />
                    {isFront && !reduce && (
                      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute inset-y-0 -left-1/3 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-left text-white">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light">{item.origin}</p>
                      <p className="mt-1 font-display text-lg font-semibold leading-tight sm:text-xl">{item.title}</p>
                      <p className="num mt-1 text-xs text-white/80">{item.meta}</p>
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </motion.div>

      {/* floating wholesale tag */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-0 top-[6%] z-10 rounded-2xl bg-white/95 px-3.5 py-2.5 shadow-card ring-1 ring-ink/5 backdrop-blur sm:right-[-2%]"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate">This week</p>
        <p className="num font-display text-lg font-semibold text-ink">38 new lots</p>
      </motion.div>
      <motion.div
        animate={reduce ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="absolute bottom-[8%] left-0 z-10 flex items-center gap-2 rounded-2xl bg-ink px-3.5 py-2.5 text-white shadow-lift sm:left-[-2%]"
      >
        <BadgeCheck className="h-5 w-5 text-brand" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">Wholesale only</p>
          <p className="text-sm font-semibold">Verified trade buyers</p>
        </div>
      </motion.div>

      {/* dots */}
      <div className="absolute inset-x-0 bottom-[-4%] z-10 flex justify-center gap-2">
        {SHOWCASE.map((s, i) => (
          <button key={s.key} onClick={() => setFront(i)} aria-label={`Show ${s.title}`} className="grid h-6 w-6 place-items-center">
            <span className={`block h-1.5 rounded-full transition-all ${i === front ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25'}`} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Hero({ onExplore }: { onExplore: () => void }) {
  const reduce = useReducedMotion()
  const words = ['retailers', 'boutiques', 'resellers', 'bridal parlours']
  const [w, setW] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setW((x) => (x + 1) % words.length), 2400)
    return () => clearInterval(t)
  }, [reduce, words.length])

  const fade = (d: number) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] as const } })

  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full border-[48px] border-brand/10" />
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

      <div className="container-x relative grid items-center gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-24 lg:pt-16">
        <div>
          <motion.div {...fade(0)} className="flex flex-wrap items-center gap-2">
            <span className="chip bg-ink py-1.5 text-white"><span className="h-1.5 w-1.5 rounded-full bg-brand" />Wholesale Business Only</span>
            <span className="chip bg-white py-1.5 text-ink ring-1 ring-ink/10">Imitation Jewellery & Cosmetics</span>
          </motion.div>

          <motion.h1 {...fade(0.08)} className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[4.1rem]">
            Thailand & Kashmir imports,{' '}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">priced by the lot</span>
              <svg aria-hidden viewBox="0 0 300 18" className="absolute -bottom-1 left-0 z-0 h-3 w-full text-gold sm:h-4" preserveAspectRatio="none"><path d="M2 13 C 80 2, 220 2, 298 11" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" /></svg>
            </span>
            .
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Billal Trading Corporation supplies Bangladeshi{' '}
            <span className="relative inline-grid align-bottom font-semibold text-brand-800">
              <AnimatePresence mode="wait">
                <motion.span key={words[w]} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.3 }}>
                  {words[w]}
                </motion.span>
              </AnimatePresence>
            </span>{' '}
            with bridal sets, antique jhumkas, waist chains and cosmetics — straight from import, in dozens and boxes.
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={onExplore} className="btn-dark group h-[52px] px-6 text-[15px]">
              Explore Wholesale Catalog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <a href={waLink('Assalamu Alaikum BTC Wholesale Desk, I am a retailer and want your latest wholesale catalogue & rates.')} target="_blank" rel="noreferrer" className="btn-wa h-[52px] px-6 text-[15px]">
              <WhatsAppIcon className="h-5 w-5" /> Direct WhatsApp Wholesale Desk
            </a>
          </motion.div>

          <motion.ul {...fade(0.32)} className="mt-10 grid gap-4 border-t border-ink/10 pt-6 sm:grid-cols-3">
            {TRUST.map(({ icon: Icon, title, sub }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-800"><Icon className="h-5 w-5" /></span>
                <span>
                  <span className="block text-sm font-bold leading-snug text-ink">{title}</span>
                  <span className="block text-[13px] text-slate">{sub}</span>
                </span>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="px-2 sm:px-8 lg:px-0">
          <ShowcaseStage />
        </motion.div>
      </div>

      {/* origin marquee */}
      <div className="relative border-y border-ink/5 bg-white py-3.5">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-[13px] font-semibold text-slate-600 motion-reduce:animate-none">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10" aria-hidden={k === 1}>
              {['Kundan Sets', 'Thailand AD Stone', 'Kashmiri Meena', 'Antique Jhumkas', 'Waist Chains', 'Kada Bangles', 'Bridal Tikka Sets', 'Evening Clutches', 'Lip & Kajal', 'Beaded Rani Haar'].map((t) => (
                <span key={t} className="inline-flex items-center gap-3"><span className="h-1.5 w-1.5 rotate-45 bg-gold" />{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
