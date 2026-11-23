/**
 * Mock wholesale catalogue.
 * To swap in real client photos, drop images into /public/products and update `image` paths.
 * Prices are indicative per-piece wholesale rates in BDT; edit `tiers` per product.
 */

export type Category = 'necklace' | 'earrings' | 'waist-bangles' | 'cosmetics'
export type Origin = 'Thailand' | 'Kashmir'
export type Collection = 'bridal' | 'jhumka' | 'waist' | 'accessories' | 'cosmetics'

export interface Variant { id: string; name: string; swatch: string; image: string }
export interface PackOption { label: string; units: number }
export interface PriceTier { min: number; price: number }

export interface Product {
  id: string
  sku: string
  name: string
  category: Category
  collections: Collection[]
  origin: Origin
  description: string
  material: string
  moq: number // minimum order quantity, in pieces / sets
  unitLabel: 'pc' | 'set' | 'pair'
  packs: PackOption[]
  tiers: PriceTier[] // ascending by min
  variants: Variant[]
  quoteOnly?: boolean
  badge?: 'New Lot' | 'Best Seller' | 'Limited Lot' | 'Fast Moving'
  stockLots: number
}

export const CATEGORIES: { id: Category; label: string; short: string }[] = [
  { id: 'necklace', label: 'Necklace Sets', short: 'Necklace Sets' },
  { id: 'earrings', label: 'Jhumkas & Earrings', short: 'Jhumkas' },
  { id: 'waist-bangles', label: 'Waist Chains & Bangles', short: 'Waist & Bangles' },
  { id: 'cosmetics', label: 'Cosmetics', short: 'Cosmetics' },
]

const P = (f: string) => `/products/${f}.jpg`
const v = (id: string, name: string, swatch: string, file: string): Variant => ({ id, name, swatch, image: P(file) })

const DOZEN = { label: 'Dozen', units: 12 }
const HALF = { label: 'Half Dozen', units: 6 }

export const PRODUCTS: Product[] = [
  {
    id: 'kundan-v-drop-set', sku: 'BTC-NK-1042', name: 'Kundan V-Drop Necklace Set',
    category: 'necklace', collections: ['bridal'], origin: 'Kashmir',
    description: 'Polki-style kundan necklace with a teardrop centre stone and matching drop earrings. Strong party & wedding season mover.',
    material: 'Antique gold plating, kundan & glass stones',
    moq: 6, unitLabel: 'set', packs: [HALF, DOZEN], badge: 'Best Seller', stockLots: 14,
    tiers: [{ min: 6, price: 1250 }, { min: 24, price: 1140 }, { min: 60, price: 1050 }],
    variants: [v('ruby', 'Ruby Red', '#B3122E', 'neck-05'), v('blush', 'Blush Pink', '#E7A2AE', 'neck-04'), v('emerald', 'Emerald', '#13704A', 'neck-10')],
  },
  {
    id: 'square-solitaire-collar', sku: 'BTC-NK-1018', name: 'Square Solitaire Collar Set',
    category: 'necklace', collections: ['bridal'], origin: 'Thailand',
    description: 'Clean American-diamond collar with square solitaire centre and stud drops. Minimal, versatile — retails well year-round.',
    material: 'Rhodium-tone plating, AD stones',
    moq: 6, unitLabel: 'set', packs: [HALF, DOZEN], badge: 'Fast Moving', stockLots: 22,
    tiers: [{ min: 6, price: 890 }, { min: 24, price: 820 }, { min: 60, price: 760 }],
    variants: [v('crystal', 'Crystal Clear', '#E5E7EB', 'neck-01'), v('champagne', 'Champagne', '#D9C08F', 'neck-02'), v('garnet', 'Garnet', '#5B1020', 'neck-00')],
  },
  {
    id: 'peacock-feather-set', sku: 'BTC-NK-1077', name: 'Peacock Feather Victorian Set',
    category: 'necklace', collections: ['bridal'], origin: 'Kashmir',
    description: 'Statement Victorian peacock-feather necklace with long chandelier earrings. Premium bridal counter piece.',
    material: 'Victorian antique finish, CZ & kundan',
    moq: 3, unitLabel: 'set', packs: [{ label: 'Box of 3', units: 3 }, HALF], badge: 'Limited Lot', stockLots: 5, quoteOnly: true,
    tiers: [{ min: 3, price: 2650 }, { min: 12, price: 2450 }],
    variants: [v('rose', 'Rose Gold', '#C98B7A', 'neck-12'), v('ivory', 'Ivory Stone', '#EFE6D2', 'neck-13'), v('wine', 'Wine', '#7A2638', 'neck-11')],
  },
  {
    id: 'asymmetric-lariat', sku: 'BTC-NK-1090', name: 'Asymmetric Kundan Lariat Set',
    category: 'necklace', collections: ['bridal'], origin: 'Thailand',
    description: 'Contemporary one-side lariat with kundan line and beaded tassel finish. Trend pick for Gen-Z boutique buyers.',
    material: 'Gold-tone plating, kundan, glass beads',
    moq: 6, unitLabel: 'set', packs: [HALF, DOZEN], badge: 'New Lot', stockLots: 11,
    tiers: [{ min: 6, price: 980 }, { min: 24, price: 910 }, { min: 60, price: 850 }],
    variants: [v('emerald', 'Emerald', '#13704A', 'neck-14'), v('ruby', 'Ruby', '#9E1530', 'neck-15')],
  },
  {
    id: 'fringe-cascade-set', sku: 'BTC-NK-1105', name: 'Crystal Cascade Fringe Set',
    category: 'necklace', collections: ['bridal'], origin: 'Thailand',
    description: 'Layered cascade fringe necklace with matching long shoulder-duster earrings. Eye-catching under shop lights.',
    material: 'Antique silver-gold dual tone, CZ',
    moq: 6, unitLabel: 'set', packs: [HALF, DOZEN], stockLots: 9,
    tiers: [{ min: 6, price: 1380 }, { min: 24, price: 1290 }],
    variants: [v('emerald', 'Emerald Fringe', '#13704A', 'neck-23'), v('champagne', 'Champagne', '#CFB98E', 'neck-24')],
  },
  {
    id: 'moissanite-look-choker', sku: 'BTC-NK-1066', name: 'Moissanite-Look Stone Choker',
    category: 'necklace', collections: ['bridal'], origin: 'Kashmir',
    description: 'Geometric stone choker with mint and crystal accents plus matching statement earrings.',
    material: 'Antique gold plating, AD & mint glass',
    moq: 6, unitLabel: 'set', packs: [HALF, DOZEN], stockLots: 12,
    tiers: [{ min: 6, price: 1150 }, { min: 24, price: 1060 }, { min: 60, price: 990 }],
    variants: [v('mint', 'Mint Green', '#7FB89A', 'neck-20'), v('crystal', 'Crystal', '#E5E7EB', 'neck-21'), v('jade', 'Jade', '#2E6B4F', 'neck-22')],
  },
  {
    id: 'mala-strand-rani-haar', sku: 'BTC-NK-1121', name: 'Beaded Rani Haar with Peacock Pendant',
    category: 'necklace', collections: ['bridal'], origin: 'Kashmir',
    description: 'Multi-strand beaded rani haar with Victorian peacock pendant and pearl jhumka pair. Wedding season essential.',
    material: 'Glass seed beads, Victorian pendant, faux pearl',
    moq: 6, unitLabel: 'set', packs: [HALF, DOZEN], badge: 'Best Seller', stockLots: 16,
    tiers: [{ min: 6, price: 1420 }, { min: 24, price: 1320 }, { min: 60, price: 1220 }],
    variants: [v('green', 'Bottle Green', '#1F5A3A', 'bead-0'), v('pink', 'Baby Pink', '#E6A9BC', 'bead-1'), v('ruby', 'Ruby', '#9E1530', 'neck-25')],
  },
  {
    id: 'layered-pearl-choker', sku: 'BTC-NK-1133', name: 'Layered Bead Choker with Stone Drop',
    category: 'necklace', collections: ['bridal'], origin: 'Thailand',
    description: 'Five-row bead choker with oval stone centre and stone-drop earrings. Lightweight, ships flat.',
    material: 'Glass beads, faux pearl, CZ',
    moq: 6, unitLabel: 'set', packs: [HALF, DOZEN], badge: 'New Lot', stockLots: 18,
    tiers: [{ min: 6, price: 760 }, { min: 24, price: 700 }, { min: 60, price: 650 }],
    variants: [v('pearl', 'Pearl White', '#F1ECE1', 'bead-3'), v('green', 'Emerald Beads', '#1F5A3A', 'bead-2'), v('maroon', 'Maroon', '#7A1428', 'bead-4')],
  },
  {
    id: 'bridal-choker-tikka', sku: 'BTC-BR-2010', name: 'Royal Bridal Choker + Maang Tikka',
    category: 'necklace', collections: ['bridal'], origin: 'Kashmir',
    description: 'Complete bridal kit: coin-work choker, maang tikka and tiered jhumka earrings. Packed in individual card boxes.',
    material: 'Antique matte gold, kundan, glass pearls',
    moq: 3, unitLabel: 'set', packs: [{ label: 'Box of 3', units: 3 }, HALF], badge: 'Limited Lot', stockLots: 6, quoteOnly: true,
    tiers: [{ min: 3, price: 3150 }, { min: 12, price: 2900 }],
    variants: [v('maroon', 'Maroon Pearl', '#6E1A26', 'mix-21'), v('green', 'Mehendi Green', '#2F5D3A', 'mix-22'), v('rose', 'Rose', '#A33A4D', 'mix-23'), v('gold', 'Pure Gold', '#C9A23F', 'mix-24')],
  },
  {
    id: 'antique-heavy-bridal', sku: 'BTC-BR-2024', name: 'Antique Heavy Bridal Bib Set',
    category: 'necklace', collections: ['bridal'], origin: 'Kashmir',
    description: 'Heavy bib-style bridal necklace with tikka and jhumkas. Top-shelf piece for bridal parlours & premium showrooms.',
    material: 'Antique oxidised gold, kundan, pearl drops',
    moq: 2, unitLabel: 'set', packs: [{ label: 'Pair of sets', units: 2 }, { label: 'Box of 4', units: 4 }], stockLots: 4, quoteOnly: true,
    tiers: [{ min: 2, price: 4800 }, { min: 8, price: 4450 }],
    variants: [v('antique', 'Antique Gold', '#A9874A', 'bead-5'), v('ruby', 'Ruby Pearl', '#8E1B2C', 'mix-30')],
  },

  // ---- Jhumkas & earrings
  {
    id: 'meenakari-stone-jhumka', sku: 'BTC-JH-3001', name: 'Meenakari Stone Jhumka',
    category: 'earrings', collections: ['jhumka'], origin: 'Thailand',
    description: 'Oxidised antique jhumka with cat-eye stone top. Our fastest-moving earring line — restocked every lot.',
    material: 'Oxidised alloy, cat-eye stone, ghungroo beads',
    moq: 24, unitLabel: 'pair', packs: [DOZEN, { label: 'Box (5 dz)', units: 60 }], badge: 'Best Seller', stockLots: 40,
    tiers: [{ min: 24, price: 185 }, { min: 120, price: 165 }, { min: 300, price: 148 }],
    variants: [v('turq', 'Turquoise', '#2BC3C9', 'jhum-03'), v('peach', 'Peach', '#E49A6B', 'jhum-25'), v('black', 'Onyx', '#1E1E1E', 'jhum-23'), v('ruby', 'Ruby', '#A3122B', 'jhum-24'), v('honey', 'Honey', '#B47A3E', 'jhum-12')],
  },
  {
    id: 'twin-drop-jhumka', sku: 'BTC-JH-3014', name: 'Twin-Drop Cat-Eye Jhumka',
    category: 'earrings', collections: ['jhumka'], origin: 'Thailand',
    description: 'Double-stone drop over a textured dome jhumka. Card-packed, ready for counter display.',
    material: 'Antique gold alloy, cat-eye glass',
    moq: 24, unitLabel: 'pair', packs: [DOZEN, { label: 'Box (5 dz)', units: 60 }], badge: 'Fast Moving', stockLots: 30,
    tiers: [{ min: 24, price: 195 }, { min: 120, price: 175 }, { min: 300, price: 158 }],
    variants: [v('blush', 'Blush', '#E6B8B0', 'jhum-15'), v('turq', 'Turquoise', '#2BC3C9', 'jhum-35'), v('tangerine', 'Tangerine', '#E5762F', 'jhum-10'), v('amber', 'Amber', '#B27B40', 'jhum-30')],
  },
  {
    id: 'temple-crown-jhumka', sku: 'BTC-JH-3022', name: 'Temple Crown Jhumka',
    category: 'earrings', collections: ['jhumka'], origin: 'Kashmir',
    description: 'Temple-style crown top with meena colour fill and a deep bell jhumka. Festive-season staple.',
    material: 'Antique gold alloy, meena enamel',
    moq: 24, unitLabel: 'pair', packs: [DOZEN, { label: 'Box (5 dz)', units: 60 }], stockLots: 26,
    tiers: [{ min: 24, price: 210 }, { min: 120, price: 190 }, { min: 300, price: 172 }],
    variants: [v('multi', 'Multicolour', '#C04A5E', 'jhum-00'), v('red', 'Sindoor Red', '#C21F32', 'jhum-01'), v('black', 'Black Meena', '#2A2A2A', 'jhum-02'), v('pink', 'Rani Pink', '#D0517A', 'jhum-04')],
  },
  {
    id: 'drop-stone-jhumka', sku: 'BTC-JH-3035', name: 'Pear-Drop Stone Jhumka',
    category: 'earrings', collections: ['jhumka'], origin: 'Kashmir',
    description: 'Elegant pear-cut stone above a filigree jhumka. Lightweight for daily wear retail.',
    material: 'Oxidised alloy, glass stone',
    moq: 24, unitLabel: 'pair', packs: [DOZEN, { label: 'Box (5 dz)', units: 60 }], badge: 'New Lot', stockLots: 20,
    tiers: [{ min: 24, price: 175 }, { min: 120, price: 158 }, { min: 300, price: 142 }],
    variants: [v('olive', 'Olive', '#55603A', 'jhum-05'), v('turq', 'Turquoise', '#2BC3C9', 'jhum-22'), v('beige', 'Beige', '#CFB08A', 'jhum-21'), v('emerald', 'Bottle Green', '#244A35', 'jhum-31')],
  },
  {
    id: 'mirror-kundan-earring', sku: 'BTC-ER-3110', name: 'Kundan Square Statement Earring',
    category: 'earrings', collections: ['jhumka'], origin: 'Thailand',
    description: 'Bold square kundan top with drop stone and mini jhumka tail. Premium earring counter pick.',
    material: 'Gold-tone plating, kundan, glass',
    moq: 12, unitLabel: 'pair', packs: [HALF, DOZEN], badge: 'Fast Moving', stockLots: 15,
    tiers: [{ min: 12, price: 340 }, { min: 48, price: 310 }, { min: 120, price: 285 }],
    variants: [v('ruby', 'Ruby', '#A3122B', 'mix-31'), v('pink', 'Rose Pink', '#D46A85', 'mix-32'), v('emerald', 'Emerald', '#13704A', 'mix-35'), v('duo', 'Ruby + Green', '#6F3A2A', 'mix-33')],
  },

  // ---- Waist chains & bangles & accessories
  {
    id: 'flower-coin-waist-chain', sku: 'BTC-WC-4002', name: 'Gold Motif Waist Chain (Kamarbandh)',
    category: 'waist-bangles', collections: ['waist', 'accessories'], origin: 'Thailand',
    description: 'Adjustable link waist chain with sculpted gold motifs. Card-tagged, individually poly-packed.',
    material: 'Gold-plated alloy, adjustable hook',
    moq: 12, unitLabel: 'pc', packs: [DOZEN, { label: 'Box (3 dz)', units: 36 }], badge: 'New Lot', stockLots: 24,
    tiers: [{ min: 12, price: 290 }, { min: 48, price: 265 }, { min: 144, price: 240 }],
    variants: [v('flower', 'Flower Coin', '#C9A23F', 'waist-0'), v('leaf', 'Leaf', '#C9A23F', 'waist-1'), v('coin', 'Hammered Coin', '#C9A23F', 'waist-2'), v('greek', 'Greek Key', '#C9A23F', 'waist-3'), v('starfish', 'Starfish', '#C9A23F', 'waist-4')],
  },
  {
    id: 'rose-gold-kada-bangles', sku: 'BTC-BG-4110', name: 'Textured Kada Bangle Set (4 pcs)',
    category: 'waist-bangles', collections: ['accessories'], origin: 'Kashmir',
    description: 'Hand-textured kada bangles sold as a set of four. Sizes 2.4 / 2.6 / 2.8 available per lot.',
    material: 'Copper-tone alloy, textured micro-bead finish',
    moq: 12, unitLabel: 'set', packs: [DOZEN, { label: 'Box (3 dz)', units: 36 }], badge: 'Fast Moving', stockLots: 19,
    tiers: [{ min: 12, price: 420 }, { min: 48, price: 385 }, { min: 144, price: 355 }],
    variants: [v('copper', 'Rose Copper', '#B9734F', 'mix-00'), v('antique', 'Antique Copper', '#9C5E3B', 'mix-01'), v('gold', 'Matte Gold', '#B98A3E', 'mix-02')],
  },
  {
    id: 'mother-of-pearl-clutch', sku: 'BTC-AC-5004', name: 'Mother-of-Pearl Stone Clutch',
    category: 'waist-bangles', collections: ['accessories'], origin: 'Thailand',
    description: 'Hard-case evening clutch with mother-of-pearl inlay and stone appliqué. Detachable chain strap.',
    material: 'Metal frame, MOP shell inlay, stones',
    moq: 6, unitLabel: 'pc', packs: [HALF, DOZEN], badge: 'Limited Lot', stockLots: 7,
    tiers: [{ min: 6, price: 1650 }, { min: 24, price: 1520 }],
    variants: [v('pearl', 'Pearl White', '#EDE7DC', 'mix-04'), v('ocean', 'Ocean Blue', '#6FA9C9', 'mix-05'), v('round', 'Round Ocean', '#5C93B5', 'mix-03'), v('floral', 'Floral Inlay', '#D8CFC0', 'mix-10')],
  },
  {
    id: 'gold-shell-potli', sku: 'BTC-AC-5016', name: 'Golden Shell-Charm Minaudière',
    category: 'waist-bangles', collections: ['accessories'], origin: 'Kashmir',
    description: 'Hand-wired gold minaudière with stone cluster and cowrie shell tassels. Party & bridal accessory counter.',
    material: 'Gold wire-work, stone cluster, cowrie shells',
    moq: 6, unitLabel: 'pc', packs: [HALF, DOZEN], stockLots: 8, quoteOnly: true,
    tiers: [{ min: 6, price: 1880 }, { min: 24, price: 1740 }],
    variants: [v('oval', 'Oval', '#C9A23F', 'mix-15'), v('drop', 'Teardrop', '#C9A23F', 'mix-12'), v('triangle', 'Triangle', '#C9A23F', 'mix-14'), v('pouch', 'Pouch', '#C9A23F', 'mix-13')],
  },
  {
    id: 'kundan-mirror-purse', sku: 'BTC-AC-5021', name: 'Kundan Mirror Half-Moon Purse',
    category: 'waist-bangles', collections: ['accessories'], origin: 'Kashmir',
    description: 'Half-moon purse fully set with kundan mirrors and multicolour stones. Wedding gifting favourite.',
    material: 'Gold-tone frame, kundan, glass stones',
    moq: 6, unitLabel: 'pc', packs: [HALF, DOZEN], badge: 'New Lot', stockLots: 6,
    tiers: [{ min: 6, price: 1490 }, { min: 24, price: 1380 }],
    variants: [v('multi', 'Multicolour', '#C04A5E', 'mix-11')],
  },

  // ---- Cosmetics (illustrated placeholders — replace with real lot photos)
  {
    id: 'matte-lip-crayon', sku: 'BTC-CS-6001', name: 'Velvet Matte Lip Crayon',
    category: 'cosmetics', collections: ['cosmetics'], origin: 'Thailand',
    description: 'Long-wear matte lip crayon with built-in sharpener. 12 shades per display box.',
    material: '3.5 g · Thai-manufactured · batch-coded',
    moq: 24, unitLabel: 'pc', packs: [DOZEN, { label: 'Display box (24)', units: 24 }], badge: 'Fast Moving', stockLots: 35,
    tiers: [{ min: 24, price: 120 }, { min: 144, price: 105 }, { min: 480, price: 94 }],
    variants: [v('brick', 'Brick Red', '#9C2F2A', 'cos:lip'), v('nude', 'Warm Nude', '#C27F63', 'cos:lip'), v('berry', 'Berry', '#7A1F45', 'cos:lip'), v('coral', 'Coral', '#E0604E', 'cos:lip')],
  },
  {
    id: 'pressed-powder-compact', sku: 'BTC-CS-6014', name: 'Silk Finish Pressed Compact',
    category: 'cosmetics', collections: ['cosmetics'], origin: 'Thailand',
    description: 'Oil-control pressed powder in a mirrored compact. Shade range for South Asian skin tones.',
    material: '10 g · mirror compact · puff included',
    moq: 24, unitLabel: 'pc', packs: [DOZEN, { label: 'Carton (48)', units: 48 }], stockLots: 21,
    tiers: [{ min: 24, price: 210 }, { min: 144, price: 188 }, { min: 480, price: 170 }],
    variants: [v('ivory', 'Ivory', '#F0D9BD', 'cos:compact'), v('sand', 'Natural Sand', '#D9B48C', 'cos:compact'), v('honey', 'Honey Beige', '#C2905F', 'cos:compact')],
  },
  {
    id: 'kajal-stick', sku: 'BTC-CS-6020', name: 'Smudge-Proof Kajal Stick',
    category: 'cosmetics', collections: ['cosmetics'], origin: 'Kashmir',
    description: 'Twist-up kohl kajal, intense black, water-resistant. High-velocity counter item.',
    material: '0.35 g · twist-up · batch-coded',
    moq: 48, unitLabel: 'pc', packs: [DOZEN, { label: 'Box (4 dz)', units: 48 }], badge: 'Best Seller', stockLots: 50,
    tiers: [{ min: 48, price: 68 }, { min: 240, price: 60 }, { min: 600, price: 54 }],
    variants: [v('black', 'Intense Black', '#141414', 'cos:kajal'), v('brown', 'Deep Brown', '#4A2E22', 'cos:kajal')],
  },
  {
    id: 'shimmer-palette', sku: 'BTC-CS-6033', name: '12-Shade Shimmer Eye Palette',
    category: 'cosmetics', collections: ['cosmetics'], origin: 'Thailand',
    description: 'Mixed matte + shimmer eye palette in festive tones. Shrink-wrapped, carton-packed.',
    material: '12 × 1.2 g · mirror lid',
    moq: 12, unitLabel: 'pc', packs: [HALF, DOZEN], badge: 'New Lot', stockLots: 14,
    tiers: [{ min: 12, price: 340 }, { min: 72, price: 310 }, { min: 240, price: 285 }],
    variants: [v('bronze', 'Bronze Glam', '#9C6B3A', 'cos:palette'), v('rose', 'Rose Gold', '#C98B7A', 'cos:palette'), v('smoke', 'Smoky', '#4B4B55', 'cos:palette')],
  },
]

export const ORIGIN_META: Record<Origin, { code: string; label: string; blurb: string }> = {
  Thailand: { code: 'Thailand', label: 'Thailand Import', blurb: 'Bangkok-sourced AD stone sets, cat-eye jhumkas, waist chains and cosmetics — consistent plating, fast-moving lots.' },
  Kashmir: { code: 'Kashmir', label: 'Kashmir Import', blurb: 'Kundan, meena and antique-finish bridal craft from Kashmir artisans — heavier pieces for bridal and premium counters.' },
}
