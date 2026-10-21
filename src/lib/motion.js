import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

// One motion language for the whole site.
export const EASE = {
  out: 'expo.out',
  inOut: 'power4.inOut',
  soft: 'power3.out',
}
export const DUR = { fast: 0.45, base: 0.9, slow: 1.3 }
export const STAGGER = { lines: 0.09, words: 0.035, items: 0.08 }

// Same curves for Motion for React (cubic-bezier equivalents).
export const MOTION_EASE = [0.16, 1, 0.3, 1]

gsap.defaults({ ease: EASE.soft, duration: DUR.base })

export const REDUCED = '(prefers-reduced-motion: reduce)'
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(REDUCED).matches

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export const useReducedMotion = () => useMediaQuery(REDUCED)

/**
 * Masked line reveal for a heading. Text stays in the DOM, SplitText adds
 * aria-label so screen readers read the original sentence.
 */
export function splitLines(el, opts = {}) {
  return SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    aria: 'auto',
    ...opts,
  })
}

/** Scroll-triggered line reveal used by section headings. */
export function revealHeading(el, { start = 'top 82%', delay = 0 } = {}) {
  let tween
  const split = splitLines(el, {
    onSplit(self) {
      tween?.scrollTrigger?.kill()
      tween?.kill()
      tween = gsap.from(self.lines, {
        yPercent: 110,
        duration: DUR.slow,
        ease: EASE.out,
        stagger: STAGGER.lines,
        delay,
        scrollTrigger: { trigger: el, start, once: true },
      })
      return tween
    },
  })
  return split
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
