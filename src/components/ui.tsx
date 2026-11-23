import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import type { ReactNode, PointerEvent } from 'react'
import type { Origin, Product, Variant } from '../data/products'
import { ScrollDepth } from '../lib/motion'
import { ORIGIN_META } from '../data/products'

/* ---------- Origin label (quiet, text-first) ---------- */
export function OriginBadge({ origin, size = 'sm', tone = 'light' }: { origin: Origin; size?: 'sm' | 'md'; tone?: 'light' | 'glass' }) {
  const th = origin === 'Thailand'
  const base = tone === 'glass' ? 'bg-white/90 text-ink backdrop-blur ring-1 ring-black/5' : 'text-slate-600'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${size === 'md' ? 'px-3 py-1.5 text-xs' : 'text-[12px]'} ${tone === 'glass' ? base : base}`}>
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${th ? 'bg-brand-600' : 'bg-gold'}`} />
      {ORIGIN_META[origin].code}
    </span>
  )
}

export function StatusBadge({ label }: { label: NonNullable<Product['badge']> }) {
  return <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-ink ring-1 ring-black/5 backdrop-blur">{label}</span>
}

/* ---------- Product imagery (photo, or illustrated placeholder for cosmetics) ---------- */
function CosmeticArt({ kind, color, name }: { kind: string; color: string; name: string }) {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`${name} illustration`} className="h-full w-full">
      <defs>
        <radialGradient id={`bg-${kind}-${color}`} cx="50%" cy="35%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#D7F3F4" />
        </radialGradient>
        <linearGradient id="goldcap" x1="0" x2="1">
          <stop offset="0" stopColor="#8A6B1F" /><stop offset=".45" stopColor="#E8D08A" /><stop offset="1" stopColor="#9A7A26" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#bg-${kind}-${color})`} />
      <ellipse cx="100" cy="168" rx="62" ry="8" fill="#0B6A70" opacity=".12" />
      {kind === 'lip' && (
        <g transform="rotate(-14 100 100)">
          <rect x="78" y="92" width="44" height="72" rx="6" fill="#14181A" />
          <rect x="80" y="84" width="40" height="14" rx="3" fill="url(#goldcap)" />
          <path d="M84 84 V50 Q84 36 100 30 Q116 36 116 50 V84 Z" fill={color} />
          <path d="M90 82 V52 Q90 42 98 37" stroke="#fff" strokeOpacity=".35" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      )}
      {kind === 'compact' && (
        <g>
          <ellipse cx="100" cy="112" rx="58" ry="52" fill="#14181A" />
          <ellipse cx="100" cy="108" rx="48" ry="42" fill={color} />
          <ellipse cx="100" cy="108" rx="48" ry="42" fill="none" stroke="url(#goldcap)" strokeWidth="5" />
          <path d="M70 92 Q86 74 112 74" stroke="#fff" strokeOpacity=".4" strokeWidth="6" fill="none" strokeLinecap="round" />
          <text x="100" y="114" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="15" fill="#14181A" fillOpacity=".55">BTC</text>
        </g>
      )}
      {kind === 'kajal' && (
        <g transform="rotate(-30 100 100)">
          <rect x="90" y="40" width="20" height="120" rx="8" fill="#14181A" />
          <rect x="90" y="100" width="20" height="10" fill="url(#goldcap)" />
          <path d="M92 40 Q100 20 108 40 Z" fill={color} />
          <rect x="94" y="48" width="4" height="46" rx="2" fill="#fff" opacity=".25" />
        </g>
      )}
      {kind === 'palette' && (
        <g>
          <rect x="34" y="52" width="132" height="100" rx="10" fill="#14181A" />
          {Array.from({ length: 12 }).map((_, i) => {
            const x = 44 + (i % 4) * 30, y = 62 + Math.floor(i / 4) * 28
            const op = 0.45 + ((i * 37) % 55) / 100
            return <rect key={i} x={x} y={y} width="24" height="22" rx="4" fill={color} opacity={op} />
          })}
          <rect x="34" y="52" width="132" height="100" rx="10" fill="none" stroke="url(#goldcap)" strokeWidth="3" />
        </g>
      )}
    </svg>
  )
}

export function ProductImage({ product, variant, className = '', eager = false }: { product: Product; variant: Variant; className?: string; eager?: boolean }) {
  if (variant.image.startsWith('cos:')) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <CosmeticArt kind={variant.image.slice(4)} color={variant.swatch} name={product.name} />
      </div>
    )
  }
  return (
    <img
      src={variant.image}
      alt={`${product.name} — ${variant.name}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
      draggable={false}
    />
  )
}

/* ---------- 3D tilt wrapper with spring physics + light sheen ---------- */
export function Tilt({ children, className = '', max = 6, glare = true }: { children: ReactNode; className?: string; max?: number; glare?: boolean }) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const cfg = { stiffness: 150, damping: 22, mass: 0.7 }
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), cfg)
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), cfg)
  const sheen = useTransform([px, py], ([x, y]: number[]) => `linear-gradient(${105 + (x - 0.5) * 40}deg, transparent ${20 + y * 20}%, rgba(255,255,255,.22) ${40 + x * 20}%, transparent ${62 + x * 20}%)`)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => { px.set(0.5); py.set(0.5) }

  return (
    <div style={{ perspective: 1200 }} className={className}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="relative h-full"
      >
        {children}
        {glare && !reduce && (
          <motion.div aria-hidden style={{ background: sheen }} className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        )}
      </motion.div>
    </div>
  )
}

/* ---------- Section heading ---------- */
export function SectionHeading({ eyebrow, title, sub, align = 'left', dark = false }: { eyebrow: string; title: ReactNode; sub?: ReactNode; align?: 'left' | 'center'; dark?: boolean }) {
  return (
    <ScrollDepth tilt={16} depth={-110} parallax={14} origin={align === 'center' ? '50% 100%' : '0% 100%'} className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className={`eyebrow ${dark ? '!text-brand' : ''}`}>{eyebrow}</p>
        <h2 className={`display mt-6 text-[2.4rem] leading-[1.04] sm:text-5xl lg:text-[3.6rem] ${dark ? '!text-white' : ''}`}>{title}</h2>
        {sub && <p className={`mt-6 max-w-xl text-[16px] leading-[1.75] ${dark ? 'text-white/65' : 'text-slate-600'}`}>{sub}</p>}
      </motion.div>
    </ScrollDepth>
  )
}

export function WhatsAppIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.22 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  )
}
