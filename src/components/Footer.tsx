import { motion } from 'framer-motion'
import { Clock, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { CATEGORIES, type Category } from '../data/products'
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_DISPLAY, waLink } from '../lib/pricing'
import { SectionHeading, WhatsAppIcon } from './ui'

export function Contact() {
  const cards = [
    { icon: WhatsAppIcon, label: 'WhatsApp wholesale desk', value: WHATSAPP_DISPLAY, href: waLink('Assalamu Alaikum BTC, I want wholesale rates.'), cta: 'Chat now', ext: true, accent: 'bg-[#1FAF55] text-white' },
    { icon: Phone, label: 'Call the office', value: PHONE_DISPLAY, href: `tel:${PHONE_TEL}`, cta: 'Call now', accent: 'bg-brand text-ink' },
    { icon: Mail, label: 'Email inquiries', value: EMAIL, href: `mailto:${EMAIL}?subject=${encodeURIComponent('Wholesale inquiry')}`, cta: 'Send email', accent: 'bg-ink text-white' },
  ]
  return (
    <section id="contact" className="bg-white py-20 lg:py-28">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-end">
          <SectionHeading eyebrow="Contact the wholesale desk" title="Talk to us before your next restock" sub="Share your shop name and district — we'll send the current lot list, photos of new arrivals and your tier rates." />
          <div className="flex items-start gap-3 rounded-2xl bg-gold-50 p-5 ring-1 ring-gold/40">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
            <p className="text-sm leading-relaxed text-ink"><span className="font-bold">Wholesale-only policy.</span> We supply registered shops, boutiques, online resellers and bridal parlours. Single-piece retail orders are not accepted — minimum order quantities apply per item.</p>
          </div>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {cards.map(({ icon: Icon, label, value, href, cta, ext, accent }, i) => (
            <motion.a
              key={label}
              href={href}
              target={ext ? '_blank' : undefined}
              rel={ext ? 'noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group flex flex-col rounded-3xl bg-brand-50 p-6 ring-1 ring-brand-100 transition-shadow hover:shadow-lift"
            >
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${accent}`}><Icon className="h-5 w-5" /></span>
              <p className="mt-6 text-xs font-bold uppercase tracking-wider text-slate">{label}</p>
              <p className="num mt-1 break-all text-lg font-bold text-ink sm:text-xl">{value}</p>
              <span className="mt-6 text-sm font-semibold text-brand-800 group-hover:underline">{cta} →</span>
            </motion.a>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl p-4 ring-1 ring-ink/10"><Clock className="h-5 w-5 text-brand-700" /><p className="text-sm text-slate-600"><span className="font-semibold text-ink">Desk hours:</span> Sat–Thu, 10:00 AM – 8:00 PM</p></div>
          <div className="flex items-center gap-3 rounded-2xl p-4 ring-1 ring-ink/10"><MapPin className="h-5 w-5 text-brand-700" /><p className="text-sm text-slate-600"><span className="font-semibold text-ink">Dispatch:</span> Nationwide — all 64 districts by courier & cargo</p></div>
        </div>
      </div>
    </section>
  )
}

export default function Footer({ onCategory }: { onCategory: (c: Category | 'all') => void }) {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/brand/logo.jpg" alt="" className="h-12 w-12 rounded-full" />
            <div>
              <p className="font-display text-lg font-semibold">Billal Trading Corporation</p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Imported Jewellery & Cosmetics</p>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">Importer and wholesaler of imitation jewellery & cosmetics from Thailand and Kashmir, supplying retailers across Bangladesh.</p>
          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-gold/50 px-3 py-1 text-[11.5px] font-bold text-gold-light"><span className="h-1.5 w-1.5 rounded-full bg-gold" />Wholesale business only</span>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-white/50">Catalogue</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.map((c) => <li key={c.id}><button onClick={() => onCategory(c.id)} className="text-white/80 hover:text-brand">{c.label}</button></li>)}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-white/50">Trade</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            <li><a href="#how" className="hover:text-brand">How ordering works</a></li>
            <li><a href="#collections" className="hover:text-brand">Thailand imports</a></li>
            <li><a href="#collections" className="hover:text-brand">Kashmir imports</a></li>
            <li><a href="#contact" className="hover:text-brand">Wholesale policy</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-white/50">Contact</p>
          <ul className="num mt-4 space-y-3 text-sm text-white/85">
            <li><a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2 hover:text-brand"><Phone className="h-4 w-4 text-brand" />{PHONE_DISPLAY}</a></li>
            <li><a href={waLink('Assalamu Alaikum BTC, I want wholesale rates.')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-brand"><WhatsAppIcon className="h-4 w-4 text-brand" />{WHATSAPP_DISPLAY}</a></li>
            <li><a href={`mailto:${EMAIL}`} className="inline-flex items-start gap-2 break-all hover:text-brand"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{EMAIL}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Billal Trading Corporation. All rights reserved.</p>
          <p>Prices are indicative wholesale estimates in BDT and subject to lot availability.</p>
        </div>
      </div>
    </footer>
  )
}
