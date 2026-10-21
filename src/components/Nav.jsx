import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { NAV, EMAIL } from '../data'
import { ScrollTrigger, MOTION_EASE, useReducedMotion } from '../lib/motion'
import { getLenis, scrollToTarget } from '../lib/useSmoothScroll'
import Magnetic from './Magnetic'

export function Logo() {
  return (
    <span className="logo">
      Nailed It <em className="serif">Bro</em><span className="logo__dot" />
    </span>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduced = useReducedMotion()
  const menuBtn = useRef(null)
  const panel = useRef(null)

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll()
        setScrolled(y > 40)
        setHidden(self.direction === 1 && y > 400)
      },
    })
    return () => st.kill()
  }, [])

  // Lock scroll, trap focus and close on Escape while the menu is open.
  useEffect(() => {
    if (!open) return
    const lenis = getLenis()
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll('a,button')
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      menuBtn.current?.focus()
    }
  }, [open])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    history.replaceState(null, '', href)
    // Let the overlay close before scrolling.
    setTimeout(() => scrollToTarget(href), open ? 350 : 0)
  }

  const t = reduced ? { duration: 0 } : { duration: 0.7, ease: MOTION_EASE }

  return (
    <header className={`nav ${hidden && !open ? 'is-hidden' : ''} ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__logo" onClick={(e) => go(e, '#top')} aria-label="Nailed It Bro, back to top"><Logo /></a>
        <nav className="nav__links" aria-label="Primary">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className="u-link" onClick={(e) => go(e, l.href)}>{l.label}</a>
          ))}
        </nav>
        <Magnetic className="nav__cta-wrap">
          <a href="#contact" className="btn btn--sm btn--dark nav__cta" onClick={(e) => go(e, '#contact')}>
            <span className="btn__label" data-text="Start a project">Start a project</span>
          </a>
        </Magnetic>
        <button
          ref={menuBtn}
          className="nav__burger"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            ref={panel}
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)', transition: { ...t, duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.15 } }}
            transition={t}
            onAnimationComplete={() => panel.current?.querySelector('a')?.focus()}
          >
            <nav className="menu__links" aria-label="Mobile">
              {NAV.map((l, i) => (
                <div className="menu__mask" key={l.href}>
                  <m.a
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%', transition: { ...t, delay: reduced ? 0 : 0.2 + i * 0.06 } }}
                    exit={{ y: '-110%', transition: { ...t, duration: reduced ? 0 : 0.35, delay: 0 } }}
                  >
                    <span className="menu__no">0{i + 1}</span>{l.label}
                  </m.a>
                </div>
              ))}
            </nav>
            <m.div
              className="menu__foot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { ...t, delay: reduced ? 0 : 0.5 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <a href={`mailto:${EMAIL}`} className="u-link">{EMAIL}</a>
              <span>Remote-first · Worldwide</span>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
