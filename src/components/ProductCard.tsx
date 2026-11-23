import { motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../data/products'
import { useCart } from '../context/CartContext'
import { formatBDT, lowestPrice } from '../lib/pricing'
import { ProductImage, Tilt } from './ui'

interface Props { product: Product; showPrices: boolean; onQuickView: (p: Product, variantId: string) => void; index: number }

export default function ProductCard({ product, showPrices, onQuickView, index }: Props) {
  const { add } = useCart()
  const [vid, setVid] = useState(product.variants[0].id)
  const [added, setAdded] = useState(false)
  const variant = product.variants.find((v) => v.id === vid) ?? product.variants[0]
  const pack = product.packs[0]
  const moqPacks = Math.ceil(product.moq / pack.units)
  const moqQty = moqPacks * pack.units
  const priced = showPrices && !product.quoteOnly
  const open = () => onQuickView(product, variant.id)

  const quickAdd = () => {
    add(product, variant.id, pack.label, pack.units, moqQty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.9, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col"
    >
      {/* media */}
      <Tilt className="rounded-[20px]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-ink ring-1 ring-black/5">
          <button onClick={open} className="block h-full w-full" aria-label={`Quick view ${product.name}`}>
            <ProductImage product={product} variant={variant} className="transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]" />
          </button>

          {/* hover / focus actions (always visible on touch) */}
          <div className="absolute inset-x-3 bottom-3 flex gap-2 translate-y-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
            <button onClick={open} className="h-11 flex-1 rounded-full bg-white/95 text-[13px] font-semibold text-ink backdrop-blur transition-colors hover:bg-white">
              Quick view
            </button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={quickAdd}
              aria-label={`Add minimum order of ${product.name} (${moqQty} ${product.unitLabel}s) to bulk bag`}
              className={`num inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors ${added ? 'bg-ink text-white' : 'bg-brand text-ink hover:bg-brand-600'}`}
            >
              {added ? <><Check className="h-4 w-4" />Added</> : <><Plus className="h-4 w-4" />MOQ</>}
            </motion.button>
          </div>
        </div>
      </Tilt>

      {/* meta */}
      <div className="flex flex-1 flex-col pt-5">
        <p className="num text-[12px] text-slate-600">
          <span className={`mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full ${product.origin === 'Thailand' ? 'bg-brand-600' : 'bg-gold'}`} />
          {product.origin}<span className="mx-1.5 text-line-strong">•</span>MOQ {product.moq} {product.unitLabel}s
        </p>
        <h3 className="mt-2 line-clamp-2 min-h-[2.5em] text-[15.5px] font-semibold leading-[1.25] text-ink">
          <button onClick={open} className="text-left transition-colors hover:text-brand-800">{product.name}</button>
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="num min-w-0 text-[15px] leading-tight text-ink">
            {priced ? (
              <><span className="text-[11.5px] text-slate">from </span><span className="font-semibold">{formatBDT(lowestPrice(product))}</span><span className="text-[12px] text-slate"> / {product.unitLabel}</span></>
            ) : (
              <span className="text-[13.5px] font-semibold text-gold-dark">Price on request</span>
            )}
          </p>
          <div className="flex shrink-0 items-center gap-1" role="radiogroup" aria-label={`${product.name} colour`}>
            {product.variants.slice(0, 4).map((v) => (
              <button
                key={v.id}
                role="radio"
                aria-checked={v.id === vid}
                aria-label={v.name}
                title={v.name}
                onClick={() => setVid(v.id)}
                className="grid h-6 w-6 place-items-center rounded-full"
              >
                <span className={`block h-3.5 w-3.5 rounded-full ring-offset-2 transition-shadow ${v.id === vid ? 'ring-1 ring-ink' : 'ring-1 ring-black/10'}`} style={{ background: v.swatch }} />
              </button>
            ))}
            {product.variants.length > 4 && <span className="num pl-0.5 text-[11px] text-slate">+{product.variants.length - 4}</span>}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
