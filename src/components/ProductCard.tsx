import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../data/products'
import { useCart } from '../context/CartContext'
import { formatBDT, lowestPrice } from '../lib/pricing'
import { ScrollDepth } from '../lib/motion'
import { ProductImage, Tilt } from './ui'

interface Props { product: Product; showPrices: boolean; onQuickView: (p: Product, variantId: string) => void; index: number; related?: boolean }

export default function ProductCard({ product, showPrices, onQuickView, index, related = false }: Props) {
  const { add } = useCart()
  const [vid, setVid] = useState(product.variants[0].id)
  const [added, setAdded] = useState(false)
  const variant = product.variants.find((v) => v.id === vid) ?? product.variants[0]
  const pack = product.packs[0]
  const moqQty = Math.ceil(product.moq / pack.units) * pack.units
  const priced = showPrices && !product.quoteOnly
  const open = () => onQuickView(product, variant.id)
  const col = index % 4

  const quickAdd = () => {
    add(product, variant.id, pack.label, pack.units, moqQty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.8, delay: col * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      {/* scroll-linked 3D entrance: outer columns swing in from the sides */}
      <ScrollDepth tilt={14} turn={(col - 1.5) * -5} depth={-80 - col * 15} className="h-full">
        <Tilt className="group h-full rounded-[24px]">
          <div className="flex h-full cursor-pointer flex-col rounded-[24px] bg-white p-2.5 shadow-card ring-1 ring-line transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1 group-hover:shadow-lift group-hover:ring-brand/50" onClick={open}>
            {/* media */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-ink">
              <ProductImage product={product} variant={variant} className="transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]" />
              <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100" />

              {/* frosted action bar (always visible on touch) */}
              <div className="absolute inset-x-2.5 bottom-2.5 flex items-center gap-1.5 rounded-full bg-white/90 p-1.5 shadow-lift ring-1 ring-black/5 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] [@media(hover:hover)]:translate-y-[calc(100%+12px)] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100">
                <button
                  onClick={(e) => { e.stopPropagation(); open() }}
                  aria-label={`Quick view ${product.name}`}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full text-[12.5px] font-semibold text-ink transition-colors hover:bg-ice"
                >
                  Quick view <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={(e) => { e.stopPropagation(); quickAdd() }}
                  aria-label={`Add minimum lot of ${product.name} (${moqQty} ${product.unitLabel}s) to bulk bag`}
                  className={`num inline-flex h-9 items-center gap-1 rounded-full px-3.5 text-[12.5px] font-semibold transition-colors ${added ? 'bg-ink text-white' : 'bg-brand text-ink hover:bg-brand-600'}`}
                >
                  {added ? <><Check className="h-3.5 w-3.5" />Added</> : <><Plus className="h-3.5 w-3.5" />Add lot</>}
                </motion.button>
              </div>
            </div>

            {/* meta */}
            <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
              <p className="num flex items-center gap-1.5 text-[12px] text-slate-600">
                {related && <><span className="font-semibold text-brand-800">Related lot</span><span className="text-line-strong">•</span></>}
                <span className={`h-1.5 w-1.5 rounded-full ${product.origin === 'Thailand' ? 'bg-brand-600' : 'bg-gold'}`} />
                {product.origin}<span className="text-line-strong">•</span>MOQ {product.moq} {product.unitLabel}s
              </p>
              <h3 className="mb-4 mt-2 line-clamp-2 min-h-[2.5em] text-[15.5px] font-semibold leading-[1.25] text-ink transition-colors group-hover:text-brand-800">{product.name}</h3>

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3.5">
                <p className="num min-w-0 truncate text-[15px] leading-none text-ink">
                  {priced ? (
                    <><span className="text-[11.5px] text-slate">from </span><span className="font-semibold">{formatBDT(lowestPrice(product))}</span><span className="text-[12px] text-slate"> / {product.unitLabel}</span></>
                  ) : (
                    <span className="text-[13.5px] font-semibold text-gold-dark">Price on request</span>
                  )}
                </p>
                <div className="-mr-1 flex shrink-0 items-center" role="radiogroup" aria-label={`${product.name} colour`} onClick={(e) => e.stopPropagation()}>
                  {product.variants.slice(0, 4).map((v) => (
                    <button key={v.id} role="radio" aria-checked={v.id === vid} aria-label={v.name} title={v.name} onClick={() => setVid(v.id)} className="grid h-6 w-6 place-items-center rounded-full">
                      <span className={`block h-3.5 w-3.5 rounded-full ring-offset-2 transition-shadow ${v.id === vid ? 'ring-1 ring-ink' : 'ring-1 ring-black/10'}`} style={{ background: v.swatch }} />
                    </button>
                  ))}
                  {product.variants.length > 4 && <span className="num pl-0.5 text-[11px] text-slate">+{product.variants.length - 4}</span>}
                </div>
              </div>
            </div>
          </div>
        </Tilt>
      </ScrollDepth>
    </motion.article>
  )
}
