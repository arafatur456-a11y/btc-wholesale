import { motion } from 'framer-motion'
import { ClipboardList, MessageSquareText, PackageCheck, Truck } from 'lucide-react'
import { SectionHeading } from './ui'

const STEPS = [
  { icon: ClipboardList, title: 'Select collections & MOQs', body: 'Browse Thailand & Kashmir lots, pick colours and pack size — every item starts at its minimum order quantity.' },
  { icon: PackageCheck, title: 'Review your bulk lot', body: 'Adjust dozens and boxes in the Bulk Bag. Tier pricing updates live so you can see where the next price break sits.' },
  { icon: MessageSquareText, title: 'Send via WhatsApp or inquiry', body: 'One tap creates a structured order summary for our wholesale desk. We confirm stock, final rates and delivery cost.' },
  { icon: Truck, title: 'Fast dispatch across Bangladesh', body: 'Payment confirmed, lots are packed and handed to courier or cargo — typically 1–3 days to any district.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden bg-ink py-20 text-white lg:py-28">
      <div aria-hidden className="pointer-events-none absolute -right-48 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full border-[40px] border-brand/10" />
      <div className="container-x relative">
        <SectionHeading dark eyebrow="How wholesale ordering works" title={<>From catalogue to your counter<br className="hidden sm:block" /> in four steps</>} sub="No account required. Built for busy shop owners who order on WhatsApp — with the structure of a proper purchase order." />
        <ol className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div aria-hidden className="absolute left-0 right-0 top-[34px] hidden h-px bg-gradient-to-r from-brand/0 via-brand/40 to-brand/0 lg:block" />
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl bg-ink-2 p-6 ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-brand text-ink shadow-[0_0_0_6px_#14181A]"><Icon className="h-6 w-6" /></span>
                <span className="num font-display text-4xl font-semibold text-white/15">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
