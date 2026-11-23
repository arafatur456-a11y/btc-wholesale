import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { PRODUCTS, type Product, type Variant } from '../data/products'
import { unitPriceFor } from '../lib/pricing'

export interface CartLine { key: string; productId: string; variantId: string; packLabel: string; packUnits: number; qty: number }
export interface ResolvedLine extends CartLine { product: Product; variant: Variant; unitPrice: number; lineTotal: number }

interface CartCtx {
  lines: ResolvedLine[]
  count: number
  totalUnits: number
  subtotal: number
  hasQuoteItems: boolean
  open: boolean
  setOpen: (o: boolean) => void
  add: (p: Product, variantId: string, packLabel: string, packUnits: number, qty: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  lastAdded: number
}

const Ctx = createContext<CartCtx | null>(null)
const STORAGE_KEY = 'btc-bulk-bag-v1'

const load = (): CartLine[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : []
    return Array.isArray(parsed) ? parsed.filter((l) => PRODUCTS.some((p) => p.id === l.productId)) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>(load)
  const [open, setOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState(0)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(raw)) } catch { /* storage unavailable */ }
  }, [raw])

  const add = useCallback<CartCtx['add']>((p, variantId, packLabel, packUnits, qty) => {
    const key = `${p.id}__${variantId}__${packUnits}`
    setRaw((prev) => {
      const hit = prev.find((l) => l.key === key)
      if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
      return [...prev, { key, productId: p.id, variantId, packLabel, packUnits, qty }]
    })
    setLastAdded(Date.now())
  }, [])

  const setQty = useCallback((key: string, qty: number) => setRaw((prev) => prev.map((l) => (l.key === key ? { ...l, qty } : l))), [])
  const remove = useCallback((key: string) => setRaw((prev) => prev.filter((l) => l.key !== key)), [])
  const clear = useCallback(() => setRaw([]), [])

  const value = useMemo<CartCtx>(() => {
    // tier pricing applies to total qty across variants of the same product
    const perProduct = new Map<string, number>()
    raw.forEach((l) => perProduct.set(l.productId, (perProduct.get(l.productId) ?? 0) + l.qty))
    const lines: ResolvedLine[] = raw.flatMap((l) => {
      const product = PRODUCTS.find((p) => p.id === l.productId)
      if (!product) return []
      const variant = product.variants.find((x) => x.id === l.variantId) ?? product.variants[0]
      const unitPrice = unitPriceFor(product, perProduct.get(l.productId) ?? l.qty)
      return [{ ...l, product, variant, unitPrice, lineTotal: unitPrice * l.qty }]
    })
    return {
      lines,
      count: lines.length,
      totalUnits: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.lineTotal, 0),
      hasQuoteItems: lines.some((l) => l.product.quoteOnly),
      open, setOpen, add, setQty, remove, clear, lastAdded,
    }
  }, [raw, open, add, setQty, remove, clear, lastAdded])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart must be used within CartProvider')
  return c
}
