import { useRef } from 'react'
import { EMAIL } from '../data'
import { gsap, useGSAP } from '../lib/motion'
import { scrollToTarget } from '../lib/useSmoothScroll'
import SocialLinks from './SocialLinks'

export default function Footer({ onNavigate }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.footer__char', {
          yPercent: 100,
          stagger: 0.04,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.footer__mark', start: 'top 95%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const footerLinks = [
    { href: '#services', label: 'Services' },
    { href: '#work', label: 'Work' },
    { href: '#process', label: 'Process' },
    { href: '#about', label: 'About Us' },
    { href: '#contact', label: 'Contact' },
  ]

  const handleLink = (e, href) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(href)
    } else {
      scrollToTarget(href)
    }
  }

  const handleBackToTop = () => {
    if (onNavigate && window.location.hash === '#about') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      scrollToTarget('#top')
    }
  }

  const words = ['Nailed', 'It', 'Bro']

  return (
    <footer className="footer" ref={root} data-theme="dark">
      <div className="container footer__top">
        {/* Contact Block: Eyebrow stacked over Email */}
        <div className="footer__contact">
          <p className="eyebrow footer__eyebrow">
            <span className="dot" aria-hidden="true" />
            Say hello
          </p>
          <a
            href={`mailto:${EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__email u-link"
          >
            {EMAIL}
          </a>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Footer" className="footer__nav">
          {footerLinks.map((l) => (
            <a
              key={l.href}
              className="u-link"
              href={l.href}
              onClick={(e) => handleLink(e, l.href)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Social Links & Back to Top Button */}
        <div className="footer__actions">
          <SocialLinks className="footer__social-row" />
          <button
            type="button"
            className="footer__top-btn"
            onClick={handleBackToTop}
            aria-label="Back to top"
          >
            <span>Back to top</span> <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>

      {/* Massive Iconic Animated Footer Mark */}
      <div className="footer__mark" aria-label="Nailed It Bro" role="img">
        {words.map((w, wi) => (
          <span className="footer__word" key={w} aria-hidden="true">
            {[...w].map((c, i) => (
              <span className="footer__mask" key={i}>
                <span className={`footer__char ${wi === 1 ? 'footer__char--accent' : ''}`}>
                  {c}
                </span>
              </span>
            ))}
          </span>
        ))}
      </div>

      {/* Bottom Bar: Copyright and Designed & built in-house */}
      <div className="container footer__bottom">
        <span>© 2026 Nailed It Bro</span>
        <span className="footer__craft-tag">Designed & built in-house</span>
      </div>
    </footer>
  )
}
