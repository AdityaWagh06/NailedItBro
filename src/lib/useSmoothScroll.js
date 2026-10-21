import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion'

let lenisInstance = null
export const getLenis = () => lenisInstance

/**
 * Lenis gives wheel scrolling a gentle inertia that keeps scrubbed timelines
 * smooth. Touch devices keep native scrolling and reduced-motion users get
 * no smoothing at all.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false })
    lenisInstance = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])
}

/** Scroll to an in-page anchor, using Lenis when it is running. */
export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  const lenis = getLenis()
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  // Move focus for keyboard and screen reader users.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}
