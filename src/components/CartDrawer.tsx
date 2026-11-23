import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AlertCircle, ArrowLeft, Copy, Check, Mail, Minus, PackageOpen, Plus, Trash2, X } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { useCart, type ResolvedLine } from '../context/CartContext'
import { useModalBehaviour } from '../lib/useLockBody'
import { EMAIL, formatBDT, waLink, WHATSAPP_DISPLAY } from '../lib/pricing'
import { ProductImage, WhatsAppIcon } from './ui'

interface Buyer { name: string; shop: string; district: string; phone: string; notes: string }
const EMPTY: Buyer = { name: '', shop: '', district: '', phone: '', notes: '' }
const BUYER_KEY = 'btc-buyer-v1'

const loadBuyer = (): Buyer => {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(BUYER_KEY) ?? '{}') } } catch { return EMPTY }
}

const makeRef = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `BTC-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

function buildSummary(ref: string, lines: ResolvedLine[], subtotal: number, units: number, b: Buyer) {
  const rows = lines.map((l, i) => {
    const packs = l.qty / l.packUnits
    const price = l.product.quoteOnly ? `est. ${formatBDT(l.unitPrice)} (quote)` : `${formatBDT(l.unitPrice)}/${l.product.unitLabel}`
    return `${i + 1}. ${l.product.name} [${l.product.sku}]\n   Colour: ${l.variant.name} | ${packs} × ${l.packLabel} = ${l.qty} ${l.product.unitLabel}s\n   ${price} → ${formatBDT(l.lineTotal)}`
  })
  return [
    `*BTC WHOLESALE ORDER INQUIRY*`,
    `Ref: ${ref}`,
    ``,
    `Buyer: ${b.name || '-'}`,
    `Shop / Business: ${b.shop || '-'}`,
    `District: ${b.district || '-'}`,
    `Phone: ${b.phone || '-'}`,
    ``,
    `*Items (${lines.length} lines, ${units} units)*`,
    ...rows,
    ``,
    `Estimated subtotal: ${formatBDT(subtotal)}`,
    `(Indicative wholesale estimate — final invoice after stock & quote confirmation. Delivery charge extra.)`,
    b.notes ? `\nNotes: ${b.notes}` : '',
  ].join('\n').trim()
}

function Line({ l }: { l: ResolvedLine }) {
  const { setQty, remove } = useCart()
  const packs = l.qty / l.packUnits
  const below = l.qty < l.product.moq
  return (
    <motion.li layout initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }} className="flex gap-3 overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-ink/[0.07]">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink"><ProductImage product={l.product} variant={l.variant} className="h-full w-full" /></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{l.product.name}</p>
            <p className="num truncate text-xs text-slate">{l.variant.name} · {l.packLabel} ({l.packUnits})</p>
          </div>
          <button onClick={() => remove(l.key)} aria-label={`Remove ${l.product.name}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate hover:bg-[#FDECEC] hover:text-[#8E1B2C]"><Trash2 className="h-4 w-4" /></button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex h-8 items-center rounded-full border border-ink/15">
            <button onClick={() => (packs <= 1 ? remove(l.key) : setQty(l.key, (packs - 1) * l.packUnits))} aria-label="Fewer packs" className="grid h-full w-8 place-items-center hover:bg-brand-50"><Minus className="h-3.5 w-3.5" /></button>
            <span className="num w-8 text-center text-sm font-bold">{packs}</span>
            <button onClick={() => setQty(l.key, (packs + 1) * l.packUnits)} aria-label="More packs" className="grid h-full w-8 place-items-center hover:bg-brand-50"><Plus className="h-3.5 w-3.5" /></button>
          </div>
          <div className="text-right">
            <p className="num text-sm font-extrabold text-ink">{formatBDT(l.lineTotal)}</p>
            <p className="num text-[11px] text-slate">{l.qty} × {formatBDT(l.unitPrice)}{l.product.quoteOnly && ' · est.'}</p>
          </div>
        </div>
        {below && <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#8E1B2C]"><AlertCircle className="h-3 w-3" />Below MOQ of {l.product.moq}</p>}
      </div>
    </motion.li>
  )
}

export default function CartDrawer() {
  const { lines, open, setOpen, subtotal, totalUnits, hasQuoteItems, clear } = useCart()
  const reduce = useReducedMotion()
  const [step, setStep] = useState<'bag' | 'send'>('bag')
  const [buyer, setBuyer] = useState<Buyer>(loadBuyer)
  const [ref] = useState(makeRef)
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState<null | 'wa' | 'mail'>(null)
  const close = () => { setOpen(false); setTimeout(() => { setStep('bag'); setSent(null) }, 300) }
  useModalBehaviour(open, close)

  const belowMoq = lines.some((l) => l.qty < l.product.moq)
  const summary = useMemo(() => buildSummary(ref, lines, subtotal, totalUnits, buyer), [ref, lines, subtotal, totalUnits, buyer])
  const valid = buyer.name.trim() && buyer.shop.trim() && /^(?:\+?88)?01[3-9]\d{8}$/.test(buyer.phone.replace(/[\s-]/g, ''))

  const upd = (k: keyof Buyer) => (e: { target: { value: string } }) => {
    const next = { ...buyer, [k]: e.target.value }
    setBuyer(next)
    try { localStorage.setItem(BUYER_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  const sendWA = (e?: FormEvent) => {
    e?.preventDefault()
    if (!valid) return
    window.open(waLink(summary), '_blank', 'noopener')
    setSent('wa')
  }
  const sendMail = () => {
    if (!valid) return
    const subject = `Wholesale inquiry ${ref} — ${buyer.shop}`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary.replace(/\*/g, ''))}`
    setSent('mail')
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch { /* clipboard blocked */ }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="absolute inset-0 bg-ink/55 backdrop-blur-sm" aria-hidden />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Wholesale bulk order bag"
            initial={reduce ? { opacity: 0 } : { x: '100%' }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-brand-50 shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-ink/10 bg-white px-5 py-4">
              {step === 'send' && <button onClick={() => setStep('bag')} aria-label="Back to bag" className="grid h-9 w-9 place-items-center rounded-full hover:bg-brand-50"><ArrowLeft className="h-5 w-5" /></button>}
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl font-semibold text-ink">{step === 'bag' ? 'Bulk Order Bag' : 'Send wholesale inquiry'}</p>
                <p className="num text-xs text-slate">{step === 'bag' ? `${lines.length} lines · ${totalUnits} units` : `Ref ${ref}`}</p>
              </div>
              <button onClick={close} aria-label="Close bulk bag" autoFocus className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 hover:bg-brand-100"><X className="h-5 w-5" /></button>
            </div>

            {/* steps indicator */}
            <div className="flex gap-1.5 bg-white px-5 pb-3">
              {['Review lot', 'Buyer details & send'].map((s, i) => (
                <div key={s} className="flex-1">
                  <div className="h-1 overflow-hidden rounded-full bg-ink/10"><motion.div className="h-full bg-brand-700" initial={false} animate={{ width: i === 0 || step === 'send' ? '100%' : '0%' }} /></div>
                  <p className={`mt-1 text-[11px] font-semibold ${i === 0 || step === 'send' ? 'text-ink' : 'text-slate'}`}>{s}</p>
                </div>
              ))}
            </div>

            {lines.length === 0 ? (
              <div className="grid flex-1 place-items-center px-8 text-center">
                <div>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white shadow-card"><PackageOpen className="h-7 w-7 text-brand-700" /></div>
                  <p className="mt-5 font-display text-xl font-semibold">Your bulk bag is empty</p>
                  <p className="mt-1 text-sm text-slate-600">Add lots from the catalogue — each item starts at its minimum order quantity.</p>
                  <a href="#catalog" onClick={close} className="btn-dark mt-6">Browse wholesale catalog</a>
                </div>
              </div>
            ) : step === 'bag' ? (
              <>
                <ul className="flex-1 space-y-2.5 overflow-y-auto p-4">
                  <AnimatePresence initial={false}>{lines.map((l) => <Line key={l.key} l={l} />)}</AnimatePresence>
                  <li className="pt-1 text-center"><button onClick={clear} className="text-xs font-semibold text-slate hover:text-[#8E1B2C]">Clear bag</button></li>
                </ul>
                <div className="border-t border-ink/10 bg-white p-5">
                  <dl className="num space-y-1.5 text-sm">
                    <div className="flex justify-between text-slate-600"><dt>Total units</dt><dd className="font-semibold text-ink">{totalUnits}</dd></div>
                    <div className="flex justify-between text-slate-600"><dt>Delivery</dt><dd className="font-semibold text-ink">Quoted by district</dd></div>
                    <div className="flex items-end justify-between border-t border-dashed border-ink/10 pt-2"><dt className="font-bold text-ink">Estimated subtotal</dt><dd className="text-2xl font-extrabold text-ink">{formatBDT(subtotal)}</dd></div>
                  </dl>
                  {hasQuoteItems && <p className="mt-2 rounded-lg bg-gold-50 px-3 py-2 text-[11.5px] font-medium text-gold-dark">Includes bridal/premium lots priced on quote — shown at indicative rates.</p>}
                  {belowMoq && <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#8E1B2C]"><AlertCircle className="h-3.5 w-3.5" />Some lines are below MOQ — adjust before sending.</p>}
                  <button disabled={belowMoq} onClick={() => setStep('send')} className="btn-dark mt-4 h-12 w-full">Continue to send inquiry</button>
                </div>
              </>
            ) : (
              <form onSubmit={sendWA} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 space-y-4 overflow-y-auto p-5">
                  {sent && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-brand-200">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-ink"><Check className="h-5 w-5" /></span>
                      <div className="text-sm">
                        <p className="font-bold text-ink">Inquiry ready in {sent === 'wa' ? 'WhatsApp' : 'your email app'}</p>
                        <p className="text-slate-600">Press send there. Our desk replies with stock confirmation & final rates, usually within business hours.</p>
                      </div>
                    </motion.div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <label className="col-span-2 text-xs font-semibold text-ink sm:col-span-1">Your name *<input required value={buyer.name} onChange={upd('name')} className="input mt-1" autoComplete="name" /></label>
                    <label className="col-span-2 text-xs font-semibold text-ink sm:col-span-1">Shop / business *<input required value={buyer.shop} onChange={upd('shop')} className="input mt-1" autoComplete="organization" /></label>
                    <label className="text-xs font-semibold text-ink">District<input value={buyer.district} onChange={upd('district')} placeholder="e.g. Chattogram" className="input mt-1" /></label>
                    <label className="text-xs font-semibold text-ink">Mobile *<input required value={buyer.phone} onChange={upd('phone')} placeholder="01XXXXXXXXX" inputMode="tel" autoComplete="tel" className="input num mt-1" /></label>
                    <label className="col-span-2 text-xs font-semibold text-ink">Notes for the desk<textarea value={buyer.notes} onChange={upd('notes')} rows={2} placeholder="Mixed colours, delivery by courier, trade licence no…" className="input mt-1 resize-none" /></label>
                  </div>
                  {buyer.phone && !valid && buyer.name && buyer.shop && <p className="text-xs font-semibold text-[#8E1B2C]">Enter a valid Bangladeshi mobile number (01XXXXXXXXX).</p>}

                  <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
                    <div className="flex items-center justify-between border-b border-ink/5 px-4 py-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-ink">Order summary preview</p>
                      <button type="button" onClick={copy} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-800 hover:underline">{copied ? <><Check className="h-3.5 w-3.5" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy</>}</button>
                    </div>
                    <pre className="num max-h-56 overflow-auto whitespace-pre-wrap px-4 py-3 font-sans text-[11.5px] leading-relaxed text-slate-600">{summary}</pre>
                  </div>
                </div>
                <div className="space-y-2 border-t border-ink/10 bg-white p-5">
                  <button type="submit" disabled={!valid} className="btn-wa h-12 w-full"><WhatsAppIcon className="h-5 w-5" />Send order on WhatsApp</button>
                  <button type="button" disabled={!valid} onClick={sendMail} className="btn-ghost h-11 w-full"><Mail className="h-4 w-4" />Email inquiry instead</button>
                  <p className="num text-center text-[11px] text-slate">WhatsApp {WHATSAPP_DISPLAY} · {EMAIL}</p>
                </div>
              </form>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}

