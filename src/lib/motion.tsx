import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

/** Shared spring for scroll-linked motion: settles smoothly without lagging the scroll. */
export const SCROLL_SPRING = { stiffness: 120, damping: 28, mass: 0.4, restDelta: 0.0005 }

export function useSmooth(v: MotionValue<number>) {
  return useSpring(v, SCROLL_SPRING)
}

interface DepthProps {
  children: ReactNode
  className?: string
  /** degrees of rotateX when the element enters from the bottom of the viewport */
  tilt?: number
  /** degrees of rotateY at entry (use opposite signs for left/right columns) */
  turn?: number
  /** px of vertical parallax across the element's full pass through the viewport */
  parallax?: number
  /** px of translateZ at entry (negative = starts further away) */
  depth?: number
  perspective?: number
  origin?: string
}

/**
 * Scroll-linked 3D entrance: the element starts tilted back & recessed as it enters
 * the viewport, then springs flat by the time it reaches ~60% of the screen. Transforms only,
 * so there is no layout shift. Flattened entirely under prefers-reduced-motion.
 */
export function ScrollDepth({ children, className = '', tilt = 10, turn = 0, parallax = 0, depth = -60, perspective = 1400, origin = '50% 100%' }: DepthProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'start 40%'] })
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const e = useSmooth(enter)
  const rotateX = useTransform(e, [0, 1], [tilt, 0])
  const rotateY = useTransform(e, [0, 1], [turn, 0])
  const z = useTransform(e, [0, 1], [depth, 0])
  const y = useTransform(useSmooth(pass), [0, 1], [parallax, -parallax])

  if (reduce) return <div ref={ref} className={className}>{children}</div>
  return (
    <div ref={ref} className={className} style={{ perspective }}>
      <motion.div style={{ rotateX, rotateY, z, y, transformOrigin: origin, transformStyle: 'preserve-3d', willChange: 'transform' }} className="h-full">
        {children}
      </motion.div>
    </div>
  )
}
