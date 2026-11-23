import type { Product } from '../data/products'

export const WHATSAPP_NUMBER = '8801992774429'
export const WHATSAPP_DISPLAY = '+880 1992-774429'
export const PHONE_DISPLAY = '01916-962231'
export const PHONE_TEL = '+8801916962231'
export const EMAIL = 'billaltradingcorporation@gmail.com'

const bdt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })
export const formatBDT = (n: number) => `৳${bdt.format(Math.round(n))}`

export const unitPriceFor = (p: Product, qty: number) => {
  let price = p.tiers[0].price
  for (const t of p.tiers) if (qty >= t.min) price = t.price
  return price
}

export const lowestPrice = (p: Product) => p.tiers[p.tiers.length - 1].price
export const basePrice = (p: Product) => p.tiers[0].price

/** Round a desired quantity up to a whole number of packs that also meets MOQ. */
export const snapQty = (qty: number, packUnits: number, moq: number) => {
  const q = Math.max(qty, moq)
  return Math.ceil(q / packUnits) * packUnits
}

export const waLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
