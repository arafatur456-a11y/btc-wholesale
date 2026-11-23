import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AlertCircle, Check, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Product } from '../data/products'
import { useCart } from '../context/CartContext'
import { useModalBehaviour } from '../lib/useLockBody'
import { formatBDT, unitPriceFor, waLink } from '../lib/pricing'
import { OriginBadge, ProductImage, WhatsAppIcon } from './ui'

interface Props { product: Product | null; initialVariant?: string; showPrices: boolean; onClose: () => void }

function Body({ product, initialVariant, showPrices, onClose }: Props & { product: Product }) {
  const { add, setOpen } = useCart()
  const [vid, setVid] = useState(initialVariant ?? product.variants[0].id)
  const [showAlt, setShowAlt] = useState(false)
  const pick = (id: string, alt = false) => { setVid(id); setShowAlt(alt) }
  const [packIdx, setPackIdx] = useState(0)
  const pack = product.packs[packIdx]
  const minPacks = Math.ceil(product.moq / pack.units)
  const [packs, setPacks] = useState(minPacks)
  const [added, setAdded] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => closeRef.current?.focus(), [])
  useEffect(() => setPacks((p) => Math.max(p, Math.ceil(product.moq / product.packs[packIdx].units))), [packIdx, product])

  const variant = product.variants.find((v) => v.id === vid) ?? product.variants[0]
  const qty = packs * pack.units
  const belowMoq = qty < product.moq
  const unit = unitPriceFor(product, qty)
  const priced = showPrices && !product.quoteOnly
  const activeTier = [...product.tiers].reverse().find((t) => qty >= t.min)
  const nextTier = product.tiers.find((t) => t.min > qty)

  const addToBag = (openBag: boolean) => {
    if (belowMoq) return
    add(product, variant.id, pack.label, pack.units, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
    if (openBag) { onClose(); setOpen(true) }
  }

  const waText = `Assalamu Alaikum BTC, wholesale inquiry:\n${product.name} (${product.sku})\nColour: ${variant.name}\nQty: ${qty} ${product.unitLabel}s (${packs} × ${pack.label})\nPlease share best lot rate & availability.`

  return (
    <div className="grid max-h-[100dvh] overflow-y-auto md:max-h-[88vh] md:grid-cols-[1.05fr_1fr] md:overflow-hidden">
      {/* gallery */}
      <div className="relative bg-ink md:h-full">
        <div className="relative aspect-square md:aspect-auto md:h-[calc(100%-92px)]">
          <AnimatePresence mode="wait">
            <motion.div key={`${variant.id}-${showAlt}`} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 overflow-hidden">
              {/* blurred fill behind, full uncropped photo in front so wide sets keep their earrings in frame */}
              <div aria-hidden className="absolute inset-0 scale-110 opacity-50 blur-2xl">
                <ProductImage product={product} variant={variant} showAlt={showAlt} sizes="64px" className="h-full w-full" />
              </div>
              <div className="absolute inset-0">
                <ProductImage product={product} variant={variant} showAlt={showAlt} eager sizes="(min-width: 768px) 560px, 100vw" className="h-full w-full !object-contain" />
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute left-4 top-4"><OriginBadge origin={product.origin} size="md" tone="glass" /></div>
        </div>
        <div className="flex gap-2 overflow-x-auto bg-ink p-3 [scrollbar-width:thin]">
          {product.variants.flatMap((v) => [false, ...(v.alt ? [true] : [])].map((alt) => {
            const on = v.id === vid && showAlt === alt
            return (
              <button key={`${v.id}-${alt}`} onClick={() => pick(v.id, alt)} aria-label={alt ? `${v.name}, second photo` : v.name} aria-pressed={on} className={`relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl ring-2 transition ${on ? 'ring-brand' : 'ring-transparent opacity-70 hover:opacity-100'}`}>
                <ProductImage product={product} variant={v} showAlt={alt} sizes="68px" className="h-full w-full" />
              </button>
            )
          }))}
        </div>
      </div>

      {/* details */}
      <div className="flex flex-col md:overflow-y-auto">
        <div className="flex items-start justify-between gap-4 p-6 pb-0 sm:p-8 sm:pb-0">
          <div>
            <p className="num text-xs font-semibold uppercase tracking-wider text-slate">{product.sku}</p>
            <h2 id="qv-title" className="display mt-2 text-[1.75rem] leading-[1.1] sm:text-[2rem]">{product.name}</h2>
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close quick view" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-ink hover:bg-brand-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <p className="text-[15px] leading-relaxed text-slate-600">{product.description}</p>
          <p className="text-[13px] text-slate"><span className="font-semibold text-ink">Material:</span> {product.material}</p>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink">Colour · <span className="font-semibold normal-case tracking-normal text-slate-600">{variant.name}</span></p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button key={v.id} onClick={() => pick(v.id)} aria-pressed={v.id === vid} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${v.id === vid ? 'border-ink bg-ink text-white' : 'border-ink/15 text-ink hover:border-ink/40'}`}>
                  <span className="h-3.5 w-3.5 rounded-full ring-1 ring-white/40" style={{ background: v.swatch }} />{v.name}
                </button>
              ))}
            </div>
          </div>

          {/* tier table */}
          <div className="overflow-hidden rounded-2xl ring-1 ring-line-strong">
            <div className="flex items-center justify-between bg-ice px-4 py-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-ink">Wholesale tiers</p>
              <p className="num text-xs font-semibold text-slate-600">per {product.unitLabel}</p>
            </div>
            <table className="num w-full text-sm">
              <tbody>
                {product.tiers.map((t, i) => {
                  const to = product.tiers[i + 1]?.min
                  const on = activeTier?.min === t.min
                  return (
                    <tr key={t.min} className={`border-t border-ink/5 transition-colors ${on ? 'bg-gold-50' : ''}`}>
                      <td className="px-4 py-2.5 text-slate-600">{to ? `${t.min}–${to - 1}` : `${t.min}+`} {product.unitLabel}s</td>
                      <td className="px-4 py-2.5 text-right font-bold text-ink">
                        {priced ? formatBDT(t.price) : <span className="font-semibold text-gold-dark">On quote</span>}
                        {on && <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-ink">YOUR TIER</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* pack + qty */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink">Pack option</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.packs.map((p, i) => (
                  <button key={p.label} onClick={() => setPackIdx(i)} aria-pressed={i === packIdx} className={`num rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${i === packIdx ? 'border-brand-700 bg-brand-50 text-ink ring-1 ring-brand-700' : 'border-ink/15 text-ink hover:border-ink/40'}`}>
                    {p.label}<span className="block font-medium text-slate">{p.units} {product.unitLabel}s</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="qv-qty" className="text-xs font-bold uppercase tracking-wider text-ink">Number of packs</label>
              <div className="mt-2.5 flex h-[52px] items-center rounded-xl border border-ink/15">
                <button onClick={() => setPacks((p) => Math.max(1, p - 1))} aria-label="Fewer packs" className="grid h-full w-12 place-items-center text-ink hover:bg-brand-50"><Minus className="h-4 w-4" /></button>
                <input id="qv-qty" inputMode="numeric" value={packs} onChange={(e) => setPacks(Math.max(1, Math.min(999, Number(e.target.value.replace(/\D/g, '')) || 1)))} className="num h-full w-full min-w-0 border-x border-ink/10 bg-transparent text-center text-base font-bold focus:outline-none" />
                <button onClick={() => setPacks((p) => Math.min(999, p + 1))} aria-label="More packs" className="grid h-full w-12 place-items-center text-ink hover:bg-brand-50"><Plus className="h-4 w-4" /></button>
              </div>
              <p className="num mt-1.5 text-xs text-slate">= {qty} {product.unitLabel}s · MOQ {product.moq}</p>
            </div>
          </div>

          <AnimatePresence>
            {belowMoq && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 rounded-xl bg-[#FDECEC] px-3 py-2 text-xs font-semibold text-[#8E1B2C]">
                <AlertCircle className="h-4 w-4 shrink-0" /> Below minimum order — add at least {minPacks} {pack.label.toLowerCase()} pack{minPacks > 1 ? 's' : ''}.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* sticky action bar */}
        <div className="sticky bottom-0 mt-auto border-t border-ink/10 bg-white/95 p-4 backdrop-blur sm:px-8">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate">{priced ? `Est. lot value @ ${formatBDT(unit)}/${product.unitLabel}` : 'Indicative lot value (final on quote)'}</p>
              <p className="num text-2xl font-extrabold text-ink">{formatBDT(unit * qty)}</p>
            </div>
            {nextTier && priced && <p className="num max-w-[45%] text-right text-[11.5px] font-semibold text-brand-800">Add {nextTier.min - qty} more for {formatBDT(nextTier.price)}/{product.unitLabel}</p>}
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <motion.button whileTap={{ scale: 0.97 }} disabled={belowMoq} onClick={() => addToBag(false)} className={`btn h-12 ${added ? 'bg-ink text-white' : 'bg-brand text-ink hover:bg-brand-600'}`}>
              {added ? <><Check className="h-4 w-4" /> Added to bulk order</> : <><ShoppingBag className="h-4 w-4" /> Add to Bulk Order</>}
            </motion.button>
            <a href={waLink(waText)} target="_blank" rel="noreferrer" aria-label="Ask about this item on WhatsApp" className="btn-wa w-12 px-0"><WhatsAppIcon className="h-5 w-5" /></a>
          </div>
          <button disabled={belowMoq} onClick={() => addToBag(true)} className="mt-2 w-full text-center text-xs font-semibold text-slate-600 underline-offset-2 hover:text-ink hover:underline disabled:opacity-50">Add & review bulk bag →</button>
        </div>
      </div>
    </div>
  )
}

export default function QuickView(props: Props) {
  const reduce = useReducedMotion()
  useModalBehaviour(!!props.product, props.onClose)
  return (
    <AnimatePresence>
      {props.product && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-md" onClick={props.onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qv-title"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotateX: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            style={{ transformPerspective: 1200 }}
            className="relative w-full max-w-5xl overflow-hidden rounded-t-[28px] bg-white shadow-frame md:rounded-[24px]"
          >
            <Body {...props} product={props.product} key={props.product.id} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
