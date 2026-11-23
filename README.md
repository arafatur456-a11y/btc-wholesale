# Billal Trading Corporation — Wholesale Storefront

B2B wholesale storefront for **BTC — Imported Jewellery & Cosmetics** (Thailand & Kashmir imports, wholesale only).

Stack: React 19 + TypeScript + Vite, Tailwind CSS 3, Framer Motion, lucide-react.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Where things live

| What | File |
| --- | --- |
| Products, prices (BDT tiers), MOQs, packs, origins | `src/data/products.ts` |
| Phone / WhatsApp / email, BDT formatting | `src/lib/pricing.ts` |
| Bulk bag state (saved in the browser) | `src/context/CartContext.tsx` |
| Sections | `src/components/*` (Header, Hero, Collections, Catalog, ProductCard, QuickView, HowItWorks, CartDrawer, Footer) |
| Brand colours, hairline tokens & fonts (Fraunces + Plus Jakarta Sans) | `tailwind.config.js`, `src/index.css`, `index.html` |

## Swapping in real photos

Product images are crops from the Facebook catalogue screenshots (`public/products/*.jpg`, ~180px originals upscaled).
Replace them with full-resolution photos (square, 1000px+ recommended) and update each variant's `image` path.
Cosmetics use illustrated placeholders (`image: 'cos:lip'` etc.) — change those to `/products/your-photo.jpg`.

## Order flow

Bulk bag → buyer details → **WhatsApp** (`wa.me/8801992774429` with a structured order summary) or **email**
(`mailto:` to billaltradingcorporation@gmail.com). There is no backend; prices shown are indicative estimates.
