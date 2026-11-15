import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { NAV, EMAIL } from '../data'
import { ScrollTrigger, MOTION_EASE, useReducedMotion } from '../lib/motion'
import { getLenis, scrollToTarget } from '../lib/useSmoothScroll'
import Magnetic from './Magnetic'

export function Logo() {
  return (
    <span className="logo">
      <img
        src="/logo.jpeg"
        alt="Nailed It Bro Logo"
        className="logo__img"
        width="44"
        height="44"
      />
    </span>
  )
}

export default function Nav({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHref, setActiveHref] = useState(() => (typeof window !== 'undefined' && window.location.hash) || '#top')
  const reduced = useReducedMotion()
  const menuBtn = useRef(null)
  const panel = useRef(null)

  useEffect(() => {
    const handleHash = () => setActiveHref(window.location.hash || '#top')
    window.addEventListener('hashchange', handleHash)
    const onScroll = () => {
      if (window.location.hash === '#about' || window.location.hash === '#privacy' || window.location.hash === '#terms' || window.location.hash === '#cookies') return
      const y = window.scrollY || window.pageYOffset || 0
      if (y < 250) { setActiveHref('#top'); return }
      for (const id of ['#about', '#process', '#work', '#services']) {
        const el = document.querySelector(id)
        if (el) {
          const r = el.getBoundingClientRect()
          if (r.top <= 260 && r.bottom >= 120) { setActiveHref(id); return }
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll()
        setScrolled(y > 40)
        const footer = document.querySelector('.footer')
        const inFooter = footer ? footer.getBoundingClientRect().top <= 120 : false
        const scrollThreshold = window.innerWidth < 960 ? 220 : 400
        setHidden(inFooter || (self.direction === 1 && y > scrollThreshold))
      },
    })
    return () => { st.kill(); window.removeEventListener('hashchange', handleHash); window.removeEventListener('scroll', onScroll) }
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
    if (onNavigate) {
      onNavigate(href)
    } else {
      history.pushState(null, '', href)
      window.dispatchEvent(new Event('hashchange'))
      if (href === '#about' || href === '#privacy' || href === '#terms' || href === '#cookies') {
        window.scrollTo(0, 0)
        getLenis()?.scrollTo(0, { immediate: true })
      } else {
        setTimeout(() => scrollToTarget(href), open ? 350 : 80)
      }
    }
  }

  const t = reduced ? { duration: 0 } : { duration: 0.7, ease: MOTION_EASE }

  return (
    <header className={`nav ${hidden && !open ? 'is-hidden' : ''} ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__inner">
        {/* Left: Brand Logo */}
        <a href="#top" className="nav__logo" onClick={(e) => { setActiveHref('#top'); go(e, '#top'); }} aria-label="Nailed It Bro, back to top">
          <Logo />
        </a>

        {/* Center: Bigger Solma-style Pill Capsule Navbar */}
        <nav className="nav__center-capsule" aria-label="Primary Navigation">
          {NAV.map((l) => {
            const isActive = activeHref === l.href || (l.href === '#top' && (!activeHref || activeHref === '#top'))
            return (
              <a
                key={l.href}
                href={l.href}
                className={`nav__capsule-link ${isActive ? 'is-active' : ''}`}
                onClick={(e) => {
                  setActiveHref(l.href)
                  go(e, l.href)
                }}
              >
                {l.label}
              </a>
            )
          })}
        </nav>

        {/* Top Right: Contact Us pill button with rolling text & diagonal sliding arrow */}
        <div className="nav__right-actions">
          <a
            href="#contact"
            className="nav__quote-pill"
            onClick={(e) => go(e, '#contact')}
            aria-label="Contact Us"
          >
            <span className="nav__quote-text-roll">
              <span className="nav__quote-text-inner">
                <span className="nav__quote-text nav__quote-text--primary">Contact Us</span>
                <span className="nav__quote-text nav__quote-text--clone" aria-hidden="true">Contact Us</span>
              </span>
            </span>
            <span className="nav__quote-arrow-box" aria-hidden="true">
              <span className="nav__quote-arrow nav__quote-arrow--primary">↗</span>
              <span className="nav__quote-arrow nav__quote-arrow--clone">↗</span>
            </span>
          </a>
        </div>

        {/* Mobile Burger Button */}
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
            <div className="menu__mobile-cta-wrap">
              <a
                href="#contact"
                className="btn-primary-52 btn-primary-52--full"
                onClick={(e) => go(e, '#contact')}
              >
                <span>Get a Quote</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="https://chat.whatsapp.com/JQzCCHsQIDb7MpUVVhTYEr"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-mobile"
                aria-label="Join Nailed It Bro WhatsApp Community"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
            <m.div
              className="menu__foot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { ...t, delay: reduced ? 0 : 0.5 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <a href={`mailto:${EMAIL}`} target="_blank" rel="noopener noreferrer" className="u-link">{EMAIL}</a>
              <span>Remote-first · Worldwide</span>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
