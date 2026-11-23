import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIES, type Category } from '../data/products'
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_DISPLAY, waLink } from '../lib/pricing'
import { SectionHeading } from './ui'

export function Contact() {
  const rows = [
    { label: 'WhatsApp wholesale desk', value: WHATSAPP_DISPLAY, href: waLink('Assalamu Alaikum BTC, I want wholesale rates.'), ext: true },
    { label: 'Office phone', value: PHONE_DISPLAY, href: `tel:${PHONE_TEL}` },
    { label: 'Email inquiries', value: EMAIL, href: `mailto:${EMAIL}?subject=${encodeURIComponent('Wholesale inquiry')}` },
  ]
  return (
    <section id="contact" className="section-y bg-white">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Contact the wholesale desk" title={<>Talk to us before <em className="font-light italic text-brand-800">your next restock.</em></>} sub="Share your shop name and district. We will send the current lot list, photos of new arrivals and your tier rates." />
          <div className="mt-12 border-l-2 border-gold pl-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-dark">Wholesale-only policy</p>
            <p className="mt-3 max-w-md text-[14.5px] leading-[1.75] text-slate-600">We supply registered shops, boutiques, online resellers and bridal studios. Single-piece retail orders are not accepted; minimum order quantities apply per item.</p>
          </div>
        </div>

        <ul className="border-t border-line-strong lg:col-span-6 lg:col-start-7 lg:self-end">
          {rows.map((r, i) => (
            <motion.li
              key={r.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="border-b border-line-strong"
            >
              <a href={r.href} target={r.ext ? '_blank' : undefined} rel={r.ext ? 'noreferrer' : undefined} className="group flex items-center justify-between gap-6 py-8">
                <span className="min-w-0">
                  <span className="block text-[12px] text-slate-600">{r.label}</span>
                  <span className="display num mt-2 block break-all text-[22px] leading-tight transition-colors group-hover:text-brand-800 sm:text-[28px]">{r.value}</span>
                </span>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line-strong transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </a>
            </motion.li>
          ))}
          <li className="num flex flex-wrap gap-x-8 gap-y-2 pt-6 text-[13px] text-slate-600">
            <span>Desk hours: Sat–Thu, 10:00–20:00</span>
            <span>Nationwide courier &amp; cargo dispatch</span>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default function Footer({ onCategory }: { onCategory: (c: Category | 'all') => void }) {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-12 py-20 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4">
            <img src="/brand/logo.jpg" alt="" className="h-12 w-12 rounded-full" />
            <div>
              <p className="display text-[22px] !text-white">Billal Trading Corporation</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">Imported Jewellery &amp; Cosmetics</p>
            </div>
          </div>
          <p className="mt-8 max-w-sm text-[14px] leading-[1.75] text-white/60">Importer and wholesaler of imitation jewellery and cosmetics from Thailand and Kashmir, supplying retailers across Bangladesh. Wholesale business only.</p>
        </div>
        <div className="lg:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">Catalogue</p>
          <ul className="mt-6 space-y-3 text-[14px]">
            {CATEGORIES.map((c) => <li key={c.id}><button onClick={() => onCategory(c.id)} className="text-left text-white/75 transition-colors hover:text-white">{c.label}</button></li>)}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">Trade</p>
          <ul className="mt-6 space-y-3 text-[14px] text-white/75">
            <li><a href="#how" className="hover:text-white">How ordering works</a></li>
            <li><a href="#collections" className="hover:text-white">Thailand imports</a></li>
            <li><a href="#collections" className="hover:text-white">Kashmir imports</a></li>
            <li><a href="#contact" className="hover:text-white">Wholesale policy</a></li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">Contact</p>
          <ul className="num mt-6 space-y-3 text-[14px] text-white/75">
            <li><a href={`tel:${PHONE_TEL}`} className="hover:text-white">{PHONE_DISPLAY}</a></li>
            <li><a href={waLink('Assalamu Alaikum BTC, I want wholesale rates.')} target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp {WHATSAPP_DISPLAY}</a></li>
            <li><a href={`mailto:${EMAIL}`} className="break-all hover:text-white">{EMAIL}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-[12px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Billal Trading Corporation</p>
          <p>Rates are indicative wholesale estimates in BDT, subject to lot availability.</p>
        </div>
      </div>
    </footer>
  )
}
