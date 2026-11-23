import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ClipboardList, PackageCheck, Send, Truck } from 'lucide-react'
import { useRef } from 'react'
import { useSmooth } from '../lib/motion'
import { SectionHeading } from './ui'

const STEPS = [
  { icon: ClipboardList, title: 'Select collections & MOQs', body: 'Browse Thailand and Kashmir lots, choose colours and pack size. Every line starts at its minimum order quantity.' },
  { icon: PackageCheck, title: 'Review your bulk lot', body: 'Adjust dozens and boxes in the Bulk Bag. Tier rates update live, so you can see where the next price break sits.' },
  { icon: Send, title: 'Send on WhatsApp or email', body: 'One tap creates a structured order summary for our desk. We confirm stock, final rates and delivery cost.' },
  { icon: Truck, title: 'Dispatched nationwide', body: 'Once payment is confirmed, lots are packed and handed to courier or cargo — typically 1–3 days to your district.' },
]

function Step({ step, i, progress, reduce }: { step: (typeof STEPS)[number]; i: number; progress: MotionValue<number>; reduce: boolean }) {
  // staggered windows: each card starts rising slightly after the previous one
  const start = i * 0.1
  const end = 0.55 + i * 0.1
  const y = useTransform(progress, [start, end], [90 + i * 30, 0])
  const rotateX = useTransform(progress, [start, end], [28, 0])
  const z = useTransform(progress, [start, end], [-160, 0])
  const opacity = useTransform(progress, [start, start + 0.25], [0.2, 1])
  // after settling, cards gain a gentle staircase elevation as the band keeps scrolling
  const lift = useTransform(progress, [end, 1], [0, -10 - i * 6])
  const Icon = step.icon

  return (
    <motion.li
      style={reduce ? undefined : { y, rotateX, z, opacity, transformOrigin: '50% 100%', transformStyle: 'preserve-3d', willChange: 'transform' }}
      className="relative"
    >
      <motion.div
        style={reduce ? undefined : { y: lift }}
        className="group relative h-full overflow-hidden rounded-[24px] bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-7 ring-1 ring-white/10 transition-[box-shadow] duration-500 hover:ring-brand/40 lg:p-8"
      >
        <span aria-hidden className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent" />
        <span aria-hidden className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 lg:opacity-60" />
        <div className="relative flex items-start justify-between">
          <span className="display num text-[60px] font-light leading-none !text-brand">0{i + 1}</span>
          <span className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-gold/50 text-gold-light"><Icon className="h-[18px] w-[18px]" /></span>
        </div>
        <h3 className="relative mt-10 text-[17px] font-semibold">{step.title}</h3>
        <p className="relative mt-3 text-[14.5px] leading-[1.75] text-white/60">{step.body}</p>
      </motion.div>
    </motion.li>
  )
}

export default function HowItWorks() {
  const reduce = !!useReducedMotion()
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end 35%'] })
  const progress = useSmooth(scrollYProgress)

  return (
    <section id="how" className="section-y relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="pointer-events-none absolute -right-60 -top-60 h-[640px] w-[640px] rounded-full border border-brand/20" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-brand/10 blur-3xl" />
      <div className="container-x relative">
        <SectionHeading
          dark
          eyebrow="How wholesale ordering works"
          title={<>From catalogue to counter, <em className="font-light italic text-brand">in four steps.</em></>}
          sub="No account needed. Built for shop owners who order on WhatsApp, with the structure of a proper purchase order."
        />
        <ol ref={ref} className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: 1400 }}>
          {STEPS.map((step, i) => <Step key={step.title} step={step} i={i} progress={progress} reduce={reduce} />)}
        </ol>
      </div>
    </section>
  )
}
