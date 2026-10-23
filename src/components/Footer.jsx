import { useRef } from 'react'
import { NAV, EMAIL } from '../data'
import { gsap, useGSAP } from '../lib/motion'
import { scrollToTarget } from '../lib/useSmoothScroll'

export default function Footer({ onNavigate }) {
  const root = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.footer__char', {
          yPercent: 100, stagger: 0.04, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: '.footer__mark', start: 'top 95%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )
  const words = ['Nailed', 'It', 'Bro']
  return (
    <footer className="footer" ref={root} data-theme="dark">
      <div className="container footer__top">
        <div>
          <p className="eyebrow">Say hello</p>
          <a
            href={`mailto:${EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__email u-link"
          >
            {EMAIL}
          </a>
        </div>
        <nav aria-label="Footer" className="footer__nav">
          {NAV.map((l) => (
            <a
              key={l.href}
              className="u-link"
              href={l.href}
              onClick={(e) => {
                e.preventDefault()
                if (onNavigate) onNavigate(l.href)
                else scrollToTarget(l.href)
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          className="footer__top-btn"
          onClick={() => {
            if (onNavigate && window.location.hash === '#about') {
              window.scrollTo(0, 0)
            } else {
              scrollToTarget('#top')
            }
          }}
        >
          Back to top <span aria-hidden="true">↑</span>
        </button>
      </div>
      <div className="footer__mark" aria-label="Nailed It Bro" role="img">
        {words.map((w, wi) => (
          <span className="footer__word" key={w} aria-hidden="true">
            {[...w].map((c, i) => (
              <span className="footer__mask" key={i}><span className={`footer__char ${wi === 1 ? 'footer__char--accent' : ''}`}>{c}</span></span>
            ))}
          </span>
        ))}
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Nailed It Bro</span>
        <span>Designed & built in-house</span>
      </div>
    </footer>
  )
}
