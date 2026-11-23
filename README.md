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

## Product photos

Real BTC photography lives in `public/products/btc/`, two widths per photo: `name.jpg` (1200px, quick view)
and `name-sm.jpg` (640px, cards). The browser picks via `srcset`. Photos are rotated upright and stripped of
camera metadata (EXIF/GPS) on export.

In `src/data/products.ts`, `B('id', 'Colour', '#swatch', 'slug', 'optional-second-photo-slug')` uses a real photo;
the optional second photo crossfades in on card hover and appears as an extra quick-view thumbnail.
Products still on older low-res crops use `v(...)` with files in `public/products/`. Cosmetics use
illustrated placeholders (`'cos:lip'` etc.) until real photos are added. "Featured" sort lists real-photo products first.

## Order flow

Bulk bag → buyer details → **WhatsApp** (`wa.me/8801992774429` with a structured order summary) or **email**
(`mailto:` to billaltradingcorporation@gmail.com). There is no backend; prices shown are indicative estimates.
