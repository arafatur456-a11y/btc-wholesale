import { motion } from 'framer-motion'
import { SectionHeading } from './ui'

const STEPS = [
  { title: 'Select collections & MOQs', body: 'Browse Thailand and Kashmir lots, choose colours and pack size. Every line starts at its minimum order quantity.' },
  { title: 'Review your bulk lot', body: 'Adjust dozens and boxes in the Bulk Bag. Tier rates update live, so you can see where the next price break sits.' },
  { title: 'Send on WhatsApp or email', body: 'One tap creates a structured order summary for our desk. We confirm stock, final rates and delivery cost.' },
  { title: 'Dispatched nationwide', body: 'Once payment is confirmed, lots are packed and handed to courier or cargo — typically 1–3 days to your district.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="section-y relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="pointer-events-none absolute -right-60 -top-60 h-[640px] w-[640px] rounded-full border border-brand/20" />
      <div className="container-x relative">
        <SectionHeading
          dark
          eyebrow="How wholesale ordering works"
          title={<>From catalogue to counter, <em className="font-light italic text-brand">in four steps.</em></>}
          sub="No account needed. Built for shop owners who order on WhatsApp, with the structure of a proper purchase order."
        />
        <ol className="mt-20 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ title, body }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`border-b border-white/15 py-10 sm:pr-8 lg:border-b-0 lg:py-12 ${i % 2 ? 'sm:border-l sm:pl-8' : ''} ${i === 2 ? 'lg:border-l lg:pl-8' : ''}`}
            >
              <span className="display num block text-[56px] font-light leading-none !text-brand">0{i + 1}</span>
              <h3 className="mt-10 text-[17px] font-semibold">{title}</h3>
              <p className="mt-3 max-w-xs text-[14.5px] leading-[1.75] text-white/60">{body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
