import { useRef, useState } from 'react'
import { EMAIL, SOCIALS } from '../data'
import { gsap, useGSAP } from '../lib/motion'
import { scrollToTarget } from '../lib/useSmoothScroll'
import FooterWave from './FooterWave'
import LegalModal from './LegalModal'

export default function Footer({ onNavigate }) {
  const root = useRef(null)
  const [legalModalOpen, setLegalModalOpen] = useState(false)
  const [legalInitialTab, setLegalInitialTab] = useState('privacy')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.footer__char', {
          y: 40,
          opacity: 0,
          stagger: 0.03,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.footer__mark', start: 'top 95%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const agencyLinks = [
    { href: '#services', label: 'Services' },
    { href: '#work', label: 'Work' },
    { href: '#process', label: 'Process' },
    { href: '#about', label: 'About Us' },
    { href: '#contact', label: 'Contact Us' },
  ]

  const legalLinks = [
    { href: '#terms', label: 'Terms & Conditions', isRoute: true },
    { href: '#privacy', label: 'Privacy Policy', isRoute: true },
    { href: '#cookies', label: 'Cookie Policy', isRoute: true },
  ]

  const socialLinks = [
    { href: 'https://linkedin.com/company/naileditbro', label: 'LinkedIn' },
    { href: 'https://instagram.com/nailedit.bro', label: 'Instagram' },
    { href: 'https://www.facebook.com/share/1FFA1GSven/', label: 'Facebook' },
    { href: 'https://chat.whatsapp.com/JQzCCHsQIDb7MpUVVhTYEr', label: 'WhatsApp' },
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
    if (onNavigate && (window.location.hash === '#about' || window.location.hash === '#privacy' || window.location.hash === '#terms' || window.location.hash === '#cookies')) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      scrollToTarget('#top')
    }
  }

  const openLegal = (tab = 'privacy') => {
    setLegalInitialTab(tab)
    setLegalModalOpen(true)
  }

  const words = ['Nailed', 'It', 'Bro']

  return (
    <footer className="footer" ref={root} data-theme="dark">
      {/* Full-Screen Continuous Living Amber Silk Motion */}
      <FooterWave />

      <div className="container footer__top">
        {/* Left Column: Direct Reach Contact Block */}
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
          <p className="footer__tagline">
            Full-stack engineering, high-speed performance & autonomous intelligence.
          </p>
        </div>

        {/* Center & Right Navigation Grid: 3 Structured Columns */}
        <div className="footer__columns">
          {/* Column 1: Agency */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Agency</h4>
            <ul className="footer__col-list">
              {agencyLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLink(e, link.href)}
                    className="u-link footer__col-link"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Legal & SEO / Information */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Information</h4>
            <ul className="footer__col-list">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <a
                      href={link.href}
                      onClick={(e) => handleLink(e, link.href)}
                      className="u-link footer__col-link"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openLegal(link.tab)}
                      className="u-link footer__col-link footer__btn-link"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Socials */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Our Socials</h4>
            <ul className="footer__col-list">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="u-link footer__col-link"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Far Right: Back to Top */}
        <div className="footer__actions">
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

      {/* Legal & Compliance Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalInitialTab}
      />
    </footer>
  )
}
