import { motion } from 'framer-motion'
import { Check, Eye, Package, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../data/products'
import { useCart } from '../context/CartContext'
import { basePrice, formatBDT, lowestPrice } from '../lib/pricing'
import { OriginBadge, ProductImage, StatusBadge, Tilt } from './ui'

interface Props { product: Product; showPrices: boolean; onQuickView: (p: Product, variantId: string) => void; index: number }

export default function ProductCard({ product, showPrices, onQuickView, index }: Props) {
  const { add } = useCart()
  const [vid, setVid] = useState(product.variants[0].id)
  const [added, setAdded] = useState(false)
  const variant = product.variants.find((v) => v.id === vid) ?? product.variants[0]
  const pack = product.packs[0]
  const moqPacks = Math.ceil(product.moq / pack.units)
  const priced = showPrices && !product.quoteOnly

  const quickAdd = () => {
    add(product, variant.id, pack.label, pack.units, moqPacks * pack.units)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Tilt className="group h-full">
        <div className="flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-card ring-1 ring-ink/[0.06] transition-shadow duration-300 group-hover:shadow-lift">
          {/* media */}
          <div className="relative aspect-square overflow-hidden bg-ink">
            <button onClick={() => onQuickView(product, variant.id)} className="block h-full w-full" aria-label={`Quick view ${product.name}`}>
              <ProductImage product={product} variant={variant} className="transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
            </button>
            <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2" style={{ transform: 'translateZ(30px)' }}>
              <OriginBadge origin={product.origin} />
              {product.badge && <StatusBadge label={product.badge} />}
            </div>

            {/* hover reveal: MOQ + pack + quick view */}
            <div className="absolute inset-x-3 bottom-3 translate-y-[calc(100%+12px)] transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0 [@media(hover:none)]:hidden">
              <div className="flex items-center gap-2 rounded-2xl bg-white/95 p-2 pl-3 shadow-lift ring-1 ring-ink/5 backdrop-blur">
                <div className="min-w-0 flex-1 text-[11.5px] leading-tight">
                  <p className="num font-bold text-ink">MOQ {product.moq} {product.unitLabel}s</p>
                  <p className="truncate text-slate">Packed by {product.packs.map((p) => p.label.toLowerCase()).join(' / ')}</p>
                </div>
                <button onClick={() => onQuickView(product, variant.id)} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-2 text-xs font-semibold text-white hover:bg-ink-3">
                  <Eye className="h-3.5 w-3.5" /> Quick view
                </button>
              </div>
            </div>
          </div>

          {/* body */}
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate">
              <span className="num">{product.sku}</span>
              <span className="num inline-flex items-center gap-1 normal-case tracking-normal"><Package className="h-3 w-3" />MOQ {product.moq}</span>
            </div>
            <h3 className="mt-1.5 line-clamp-2 min-h-[2.6em] text-[15px] font-bold leading-[1.3] text-ink">
              <button onClick={() => onQuickView(product, variant.id)} className="text-left hover:text-brand-800">{product.name}</button>
            </h3>

            <div className="mt-3 flex min-h-[24px] items-center gap-1.5" role="radiogroup" aria-label="Colour">
              {product.variants.slice(0, 5).map((v) => (
                <button
                  key={v.id}
                  role="radio"
                  aria-checked={v.id === vid}
                  aria-label={v.name}
                  title={v.name}
                  onClick={() => setVid(v.id)}
                  className={`h-6 w-6 rounded-full ring-offset-2 transition ${v.id === vid ? 'ring-2 ring-ink' : 'ring-1 ring-ink/15 hover:ring-ink/40'}`}
                  style={{ background: v.swatch }}
                />
              ))}
              <span className="ml-1 truncate text-xs text-slate">{variant.name}</span>
            </div>

            <div className="mt-auto pt-4">
              <div className="flex items-end justify-between gap-2 border-t border-dashed border-ink/10 pt-3">
                {priced ? (
                  <div>
                    <p className="text-[11px] font-semibold text-slate">Wholesale / {product.unitLabel}</p>
                    <p className="num text-lg font-extrabold leading-tight text-ink">
                      {formatBDT(lowestPrice(product))}<span className="text-sm font-semibold text-slate"> – {formatBDT(basePrice(product))}</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[11px] font-semibold text-slate">{product.quoteOnly ? 'Bridal / premium lot' : 'Trade price'}</p>
                    <p className="text-[15px] font-extrabold leading-tight text-gold-dark">Request wholesale quote</p>
                  </div>
                )}
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={quickAdd}
                  aria-label={`Add MOQ of ${product.name} to bulk bag`}
                  className={`num inline-flex h-10 shrink-0 items-center gap-1 rounded-full px-3.5 text-xs font-bold transition-colors ${added ? 'bg-ink text-white' : 'bg-brand text-ink hover:bg-brand-600'}`}
                >
                  {added ? <><Check className="h-4 w-4" />Added</> : <><Plus className="h-4 w-4" />{moqPacks} {moqPacks > 1 ? `× ${pack.units}` : pack.label}</>}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.article>
  )
}
