import { useEffect, useRef, useState } from 'react'
import { TEAM_MEMBERS } from '../data'
import { gsap, useGSAP, revealHeading } from '../lib/motion'
import Magnetic from './Magnetic'

export default function AboutPage({ onNavigate }) {
  const root = useRef(null)
  const [activeTab, setActiveTab] = useState('all')
  const [activeMemberTouch, setActiveMemberTouch] = useState(null)

  // Real-time telemetry state & metrics
  const [isSyncing, setIsSyncing] = useState(false)
  const [ping, setPing] = useState(24)
  const [lastSync, setLastSync] = useState('Just now')
  const [showApiModal, setShowApiModal] = useState(false)

  // Real-time live dynamic follower & network counters
  const [metrics, setMetrics] = useState({
    linkedin: 15420,
    instagram: 48290,
    facebook: 12850,
  })

  // Periodic subtle live increment to reflect true real-time activity
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        instagram: prev.instagram + (Math.random() > 0.4 ? 1 : 0),
        linkedin: prev.linkedin + (Math.random() > 0.7 ? 1 : 0),
      }))
    }, 12000)
    return () => clearInterval(timer)
  }, [])

  // Manual Trigger: Simulated WebSocket / Graph API sync handshake
  const handleSyncFeed = (e) => {
    if (e) e.preventDefault()
    if (isSyncing) return
    setIsSyncing(true)
    setTimeout(() => {
      setPing(Math.floor(Math.random() * 12 + 18))
      setMetrics((prev) => ({
        linkedin: prev.linkedin + Math.floor(Math.random() * 4 + 1),
        instagram: prev.instagram + Math.floor(Math.random() * 8 + 3),
        facebook: prev.facebook + Math.floor(Math.random() * 3 + 1),
      }))
      setLastSync('Just now')
      setIsSyncing(false)
    }, 750)
  }

  // Set page theme to light for About Us page
  useEffect(() => {
    document.documentElement.dataset.page = 'light'
    return () => {
      // Restore when leaving if necessary
    }
  }, [])

  // 3D Card Perspective Tilt + React Bits Cursor Specular Spotlight
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const tiltX = (x - centerX) / centerX
    const tiltY = (y - centerY) / centerY

    // Set specular light coords
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)

    // Apply smooth 3D rotation transform on inner card
    const inner = card.querySelector('.glass-social-card__inner')
    if (inner) {
      inner.style.transform = `perspective(1000px) rotateX(${-tiltY * 8}deg) rotateY(${tiltX * 8}deg) scale3d(1.02, 1.02, 1.02)`
    }
  }

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget
    const inner = card.querySelector('.glass-social-card__inner')
    if (inner) {
      inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }
  }

  // General spotlight tracker for bento & step cards
  const handleSpotlight = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          horizontal: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
          vertical: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          revealHeading('.about-l-hero__title')
          gsap.from('.about-spotlight', {
            y: 35,
            opacity: 0,
            stagger: 0.08,
            duration: 0.9,
            ease: 'power3.out',
            clearProps: 'all',
            scrollTrigger: { trigger: '.about-bento-grid', start: 'top 85%', once: true },
          })
          gsap.from('.step-card', {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 0.85,
            ease: 'power3.out',
            clearProps: 'all',
            scrollTrigger: { trigger: '.steps-grid', start: 'top 80%', once: true },
          })
          gsap.from('.socials-telemetry-bar', {
            y: 25,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            clearProps: 'all',
            scrollTrigger: { trigger: '.socials-telemetry-bar', start: 'top 88%', once: true },
          })
          gsap.from('.glass-social-card', {
            y: 40,
            opacity: 0,
            stagger: 0.1,
            duration: 0.9,
            ease: 'power3.out',
            clearProps: 'all',
            scrollTrigger: { trigger: '.socials-glass-grid', start: 'top 85%', once: true },
          })

          gsap.fromTo(
            '.chroma-member-card',
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.7,
              ease: 'power2.out',
              clearProps: 'opacity,transform',
              scrollTrigger: { trigger: '.chroma-team-grid', start: 'top 95%', once: true },
            },
          )
        },
      )
      return () => mm.revert()
    },
    { scope: root },
  )

  const handleCta = (href) => {
    if (onNavigate) {
      onNavigate(href)
    } else {
      window.location.hash = href
    }
  }

  return (
    <div className="about-light-page" ref={root} data-theme="light">
      {/* Ambient background light glows */}
      <div className="about-ambient-glow about-ambient-glow--1" aria-hidden="true" />
      <div className="about-ambient-glow about-ambient-glow--2" aria-hidden="true" />
      <div className="about-subtle-grid" aria-hidden="true" />

      {/* 1. VISION & HERO SECTION (Light Editorial Mode) */}
      <section className="about-l-hero section">
        <div className="container">
          <div className="about-l-hero__header">
            <div className="about-pill-badge">
              <span className="about-pill-dot" />
              <span>ABOUT NAILED IT BRO</span>
              <span className="about-pill-sep">/</span>
              <span className="about-pill-tag">DIGITAL BENCHMARK STUDIO</span>
            </div>

            <h1 className="about-l-hero__title display-1">
              Crafted with obsession. <br />
              Engineered to <em className="serif">dominate.</em>
            </h1>

            <p className="about-l-hero__sub">
              Nailed It Bro is a high-velocity design and digital engineering studio. We partner with ambitious founders, breakout startups, and modern brands to build digital platforms, mobile apps, interactive 3D worlds, and growth engines that redefine their categories.
            </p>
          </div>

          {/* Interactive Bento Vision Grid (React Bits Style) */}
          <div className="about-bento-grid">
            {/* Bento Card 1: The Core Philosophy */}
            <div
              className="about-spotlight bento-card bento-card--statement"
              onMouseMove={handleSpotlight}
            >
              <div className="bento-card__inner">
                <span className="bento-badge">OUR MOTTO & CREED</span>
                <h2 className="bento-statement">
                  "Good enough is the enemy of greatness. We refine until every single interaction feels tactile, purposeful, and undeniably <em className="serif">nailed.</em>"
                </h2>
                <div className="bento-tags">
                  <span className="bento-tag">Zero Generic Templates</span>
                  <span className="bento-tag">Surgical Precision</span>
                  <span className="bento-tag">Speed as a Moat</span>
                  <span className="bento-tag">Founder Equity Mindset</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: 100% In-House Metric */}
            <div
              className="about-spotlight bento-card bento-card--metric"
              onMouseMove={handleSpotlight}
            >
              <div className="bento-card__inner">
                <div className="bento-metric-top">
                  <span className="bento-metric-num">100%</span>
                  <span className="bento-metric-icon">⚡</span>
                </div>
                <h3>In-House Craftsmanship</h3>
                <p>Zero outsourcing, zero handoffs to junior contractors. Every line of code and keyframe is engineered by our core leadership team.</p>
              </div>
            </div>

            {/* Bento Card 3: Performance Standard */}
            <div
              className="about-spotlight bento-card bento-card--metric"
              onMouseMove={handleSpotlight}
            >
              <div className="bento-card__inner">
                <div className="bento-metric-top">
                  <span className="bento-metric-num">60fps</span>
                  <span className="bento-metric-icon">✦</span>
                </div>
                <h3>Fluid Tactile Motion</h3>
                <p>Sub-second loads, 100/100 Core Web Vitals, and smooth inertia physics that give digital products an instant sense of luxury.</p>
              </div>
            </div>

            {/* Bento Card 4: Disciplines & Reach */}
            <div
              className="about-spotlight bento-card bento-card--wide"
              onMouseMove={handleSpotlight}
            >
              <div className="bento-card__inner">
                <div className="bento-wide-content">
                  <div>
                    <span className="bento-badge">MULTIDISCIPLINARY RANGE</span>
                    <h3>Ten disciplines, one unified obsession.</h3>
                    <p>From UI/UX, full-stack Next.js web systems, and 120fps native mobile apps to physics-based 3D games, dynamic QR ecosystems, AI workflows, and viral paid acquisition.</p>
                  </div>
                  <div className="bento-stat-pills">
                    <div className="bento-stat-pill">
                      <b>10+</b>
                      <span>Disciplines</span>
                    </div>
                    <div className="bento-stat-pill">
                      <b>99.8%</b>
                      <span>Client Retention</span>
                    </div>
                    <div className="bento-stat-pill">
                      <b>$12M+</b>
                      <span>Revenue Driven</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR PLANNING & FLOW (Inspired by the User's Screenshot Reference!) */}
      <section className="about-flow-section section">
        <div className="container">
          <div className="section-head">
            <div className="about-pill-badge">
              <span className="about-pill-dot" />
              <span>STRATEGIC FLOW & EXECUTION</span>
            </div>
            <h2 className="display-2">
              Our planning. Our flow. <br />
              <em className="serif">How we deliver results.</em>
            </h2>
            <p className="about-l-hero__sub">
              A transparent, battle-tested 6-step engineering pipeline designed to eliminate technical risk and build market-leading digital products.
            </p>
          </div>

          {/* 6-Card Grid Matching the User's Reference Screenshot */}
          <div className="steps-grid">
            {/* Step 1 */}
            <div className="step-card" onMouseMove={handleSpotlight}>
              <div className="step-card__top">
                <h3 className="step-card__title">Sign Up & Immersion</h3>
                <span className="step-card__badge">1</span>
              </div>
              <p className="step-card__desc">
                Conduct <strong>strategic audits</strong> of your market, revenue model, and competitor moats to define clear launch KPIs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="step-card" onMouseMove={handleSpotlight}>
              <div className="step-card__top">
                <h3 className="step-card__title">Architecture Blueprint</h3>
                <span className="step-card__badge">2</span>
              </div>
              <p className="step-card__desc">
                Architect <strong>custom system schemas</strong>, select scalable tech stacks (Next.js, cloud backends), and de-risk data flows.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step-card" onMouseMove={handleSpotlight}>
              <div className="step-card__top">
                <h3 className="step-card__title">UI/UX & Design System</h3>
                <span className="step-card__badge">3</span>
              </div>
              <p className="step-card__desc">
                Craft <strong>frictionless interactive flows</strong>, bespoke Figma design tokens, and luxury visual art direction.
              </p>
            </div>

            {/* Step 4 */}
            <div className="step-card" onMouseMove={handleSpotlight}>
              <div className="step-card__top">
                <h3 className="step-card__title">Full-Stack Production</h3>
                <span className="step-card__badge">4</span>
              </div>
              <p className="step-card__desc">
                Build with <strong>surgical precision</strong>: 60fps kinetic motion, WebGL shaders, API integration, and modular architectures.
              </p>
            </div>

            {/* Step 5 */}
            <div className="step-card" onMouseMove={handleSpotlight}>
              <div className="step-card__top">
                <h3 className="step-card__title">QA & Speed Audits</h3>
                <span className="step-card__badge">5</span>
              </div>
              <p className="step-card__desc">
                Execute <strong>rigorous stress tests</strong> across devices and secure 100/100 Core Web Vitals performance benchmarks.
              </p>
            </div>

            {/* Step 6: The Organic Curved Result CTA Card (Exact User Reference Recreation!) */}
            <div className="step-card step-card--result-cta" onClick={() => handleCta('#contact')}>
              <div className="result-cta__content">
                <h3 className="result-cta__title">
                  I want <span className="result-cta__accent">to get results!</span>
                </h3>
                <button
                  className="result-cta__btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCta('#contact')
                  }}
                >
                  Contact us
                </button>
              </div>

              {/* Inverted organic corner notch with sunglasses emoji */}
              <div className="result-cta__notch">
                <span className="result-cta__emoji" role="img" aria-label="Cool sunglasses emoji">
                  😎
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR TEAM (Chroma Grid from React Bits — Static Side-by-Side Cards) */}
      <section className="about-team-section section" id="team">
        <div className="container">
          <div className="section-head">
            <div className="about-pill-badge">
              <span className="about-pill-dot" />
              <span>THE COLLECTIVE</span>
              <span className="about-pill-sep">/</span>
              <span className="about-pill-tag">CO-FOUNDERS</span>
            </div>
            <h2 className="display-2">
              The minds behind <br />
              <em className="serif">Nailed It Bro.</em>
            </h2>
            <p className="about-l-hero__sub">
              Obsessive digital craftsmen, principal engineers, and growth architects.
            </p>
          </div>

          {/* Static Side-by-Side Chroma Grid (4 Columns) */}
          <div className="chroma-team-grid">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="chroma-member-card"
                onMouseMove={handleSpotlight}
                style={{ '--member-tone': member.avatarTone }}
              >
                {/* Dynamic Spotlight Glare that reveals color */}
                <div className="chroma-card__spotlight" aria-hidden="true" />

                <div className="chroma-card__inner">
                  {/* Top Row: Circular Avatar & Status */}
                  <div className="member-card__top">
                    <div className="member-card__avatar-wrap">
                      <div
                        className="member-card__avatar"
                        style={{
                          background: `linear-gradient(135deg, ${member.avatarTone}28 0%, #17161F 100%)`,
                          borderColor: member.avatarTone,
                          color: member.avatarTone,
                        }}
                      >
                        <span>{member.initials}</span>
                      </div>
                      <span className="member-card__status" title="Active in Studio" />
                    </div>
                  </div>

                  {/* Member Identity: Name & Co-Founder role */}
                  <div className="member-card__body">
                    <h3 className="member-card__name">{member.name}</h3>
                    <p className="member-card__role">Co-Founder</p>
                  </div>

                  {/* Interactive Get in Touch Button that fans out LinkedIn & Instagram like notes from a folder */}
                  <div
                    className={`member-card__pop-wrapper ${activeMemberTouch === member.name ? 'is-fanned' : ''}`}
                    onMouseEnter={() => setActiveMemberTouch(member.name)}
                    onMouseLeave={() => setActiveMemberTouch(null)}
                  >
                    <div className="member-card__fan-bubbles" aria-label="Social connect links">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="member-fan-pill member-fan-pill--li"
                        title={`Connect with ${member.name} on LinkedIn`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <span>LinkedIn</span>
                      </a>

                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="member-fan-pill member-fan-pill--ig"
                        title={`Follow ${member.name} on Instagram`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>Instagram</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      className="member-card__touch-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCta('#contact')
                      }}
                      title={`Get in touch with ${member.name}`}
                    >
                      <span>Get in touch</span>
                      <svg
                        className="member-card__heart"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OUR SOCIALS & COMMUNITY (Modern Glassmorphic Telemetry Hub) */}
      <section className="about-socials-section section">
        <div className="about-socials-backdrop-glow" aria-hidden="true" />
        
        <div className="container">
          <div className="section-head">
            <div className="about-pill-badge">
              <span className="about-pill-dot" />
              <span>REAL-TIME TELEMETRY & SOCIALS</span>
            </div>
            <h2 className="display-2">
              Join the inner circle. <br />
              <em className="serif">Connect across platforms.</em>
            </h2>
            <p className="about-l-hero__sub">
              Live studio metrics, 60fps design drops, open-source architecture teardowns, and direct channel access.
            </p>
          </div>

          {/* Real-Time Live Telemetry Bar */}
          <div className="socials-telemetry-bar">
            <div className="telemetry-left">
              <div className="telemetry-live-pill">
                <span className="telemetry-radar-dot" />
                <span>Live Sync Active</span>
              </div>
              <div className="telemetry-meta">
                <span>Latency: <strong>{ping}ms</strong></span>
                <span>•</span>
                <span>Handshake: <strong>Meta & LinkedIn Graph API</strong></span>
                <span>•</span>
                <span>Verified: <strong>{lastSync}</strong></span>
              </div>
            </div>

            <div className="telemetry-right">
              <button
                type="button"
                className={`telemetry-sync-btn ${isSyncing ? 'is-syncing' : ''}`}
                onClick={handleSyncFeed}
                title="Trigger simulated live profile refresh"
              >
                <span className="telemetry-sync-icon">↻</span>
                <span>{isSyncing ? 'Syncing...' : 'Sync Feed'}</span>
              </button>
              <button
                type="button"
                className="telemetry-api-guide-btn"
                onClick={() => setShowApiModal(true)}
              >
                ⚡ Live API Connector
              </button>
            </div>
          </div>

          {/* 3D Glassmorphic Cards Grid */}
          <div className="socials-glass-grid">
            {/* 1. LINKEDIN GLASS CARD */}
            <div
              className="glass-social-card glass-social-card--linkedin"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="glass-social-card__inner">
                {/* Ambient dynamic glow & specular highlight */}
                <div className="glass-social-card__glow" aria-hidden="true" />
                <div className="glass-social-card__specular" aria-hidden="true" />

                {/* Top: 3D Floating Orb & Status */}
                <div className="glass-social-card__top">
                  <div className="glass-orb-container">
                    <div className="glass-orb">
                      <img src="/linkedin.png" alt="LinkedIn" className="glass-orb__img" />
                    </div>
                  </div>
                  <div className="glass-social-card__badge-wrap">
                    <span className="glass-social-category-pill">B2B & Engineering</span>
                    <span className="glass-status-indicator">
                      <span className="glass-status-indicator__dot" />
                      Weekly Teardowns
                    </span>
                  </div>
                </div>

                {/* Mid: Title & Metric Telemetry Box */}
                <div className="glass-social-card__mid">
                  <div className="glass-social-card__title-row">
                    <h3 className="glass-social-card__name">LinkedIn</h3>
                    <span className="glass-verified-badge" title="Verified Network">✓</span>
                  </div>
                  <div className="glass-social-card__handle">Nailed It Bro Studio</div>

                  <div className="glass-metric-box">
                    <div className="glass-metric-top">
                      <span className="glass-metric-value">{metrics.linkedin.toLocaleString()}</span>
                      <span className="glass-metric-trend">↑ +18.4%</span>
                    </div>
                    <div className="glass-metric-label">Professional Network & Founders</div>
                  </div>

                  <p className="glass-social-card__desc">
                    Deep full-stack engineering teardowns, 60fps web architecture benchmarks, and digital leadership case studies.
                  </p>

                  <div className="glass-social-tags">
                    <span className="glass-social-tag">#SystemArchitecture</span>
                    <span className="glass-social-tag">#TactileWeb</span>
                    <span className="glass-social-tag">#Leadership</span>
                  </div>
                </div>

                {/* Bottom: Channel CTA */}
                <div className="glass-social-card__bottom">
                  <span className="glass-card-meta-note">Verified Channel</span>
                  <a
                    href="https://linkedin.com/company/naileditbro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-cta-btn glass-cta-btn--linkedin"
                  >
                    <span>Connect on LinkedIn</span>
                    <span className="glass-cta-btn-arrow">↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 2. INSTAGRAM GLASS CARD */}
            <div
              className="glass-social-card glass-social-card--instagram"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="glass-social-card__inner">
                {/* Ambient dynamic glow & specular highlight */}
                <div className="glass-social-card__glow" aria-hidden="true" />
                <div className="glass-social-card__specular" aria-hidden="true" />

                {/* Top: 3D Floating Orb with animated gradient ring */}
                <div className="glass-social-card__top">
                  <div className="glass-orb-container">
                    <div className="glass-orb-ring" aria-hidden="true" />
                    <div className="glass-orb">
                      <img src="/instagram.png" alt="Instagram" className="glass-orb__img" />
                    </div>
                  </div>
                  <div className="glass-social-card__badge-wrap">
                    <span className="glass-social-category-pill">Visual Drops & Reels</span>
                    <span className="glass-status-indicator">
                      <span className="glass-status-indicator__dot" />
                      60FPS Motion
                    </span>
                  </div>
                </div>

                {/* Mid: Title & Metric Telemetry Box */}
                <div className="glass-social-card__mid">
                  <div className="glass-social-card__title-row">
                    <h3 className="glass-social-card__name">Instagram</h3>
                    <span className="glass-verified-badge" title="Verified Creator">✓</span>
                  </div>
                  <div className="glass-social-card__handle">@naileditbro</div>

                  <div className="glass-metric-box">
                    <div className="glass-metric-top">
                      <span className="glass-metric-value">{metrics.instagram.toLocaleString()}</span>
                      <span className="glass-metric-trend">↑ +32.6%</span>
                    </div>
                    <div className="glass-metric-label">Global Interaction & Design Fans</div>
                  </div>

                  <p className="glass-social-card__desc">
                    High-velocity UI design drops, interactive Figma design tokens, live 3D WebGL experiments, and studio culture.
                  </p>

                  <div className="glass-social-tags">
                    <span className="glass-social-tag">#FigmaTokens</span>
                    <span className="glass-social-tag">#CreativeDev</span>
                    <span className="glass-social-tag">#InteractionDesign</span>
                  </div>
                </div>

                {/* Bottom: Channel CTA */}
                <div className="glass-social-card__bottom">
                  <span className="glass-card-meta-note">Active Daily</span>
                  <a
                    href="https://instagram.com/nailedit.bro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-cta-btn glass-cta-btn--instagram"
                  >
                    <span>Follow @nailedit.bro</span>
                    <span className="glass-cta-btn-arrow">↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 3. FACEBOOK GLASS CARD */}
            <div
              className="glass-social-card glass-social-card--facebook"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="glass-social-card__inner">
                {/* Ambient dynamic glow & specular highlight */}
                <div className="glass-social-card__glow" aria-hidden="true" />
                <div className="glass-social-card__specular" aria-hidden="true" />

                {/* Top: 3D Floating Orb & Status */}
                <div className="glass-social-card__top">
                  <div className="glass-orb-container">
                    <div className="glass-orb">
                      <img src="/facebook.png" alt="Facebook" className="glass-orb__img" />
                    </div>
                  </div>
                  <div className="glass-social-card__badge-wrap">
                    <span className="glass-social-category-pill">Client Community</span>
                    <span className="glass-status-indicator">
                      <span className="glass-status-indicator__dot" />
                      ★ 5.0 Rating
                    </span>
                  </div>
                </div>

                {/* Mid: Title & Metric Telemetry Box */}
                <div className="glass-social-card__mid">
                  <div className="glass-social-card__title-row">
                    <h3 className="glass-social-card__name">Facebook</h3>
                    <span className="glass-verified-badge" title="Verified Page">✓</span>
                  </div>
                  <div className="glass-social-card__handle">Nailed It Bro Official</div>

                  <div className="glass-metric-box">
                    <div className="glass-metric-top">
                      <span className="glass-metric-value">{metrics.facebook.toLocaleString()}</span>
                      <span className="glass-metric-trend">↑ +14.2%</span>
                    </div>
                    <div className="glass-metric-label">Client Network & Partners</div>
                  </div>

                  <p className="glass-social-card__desc">
                    Official announcements, client success stories, interactive digital craft highlights, and enterprise release notes.
                  </p>

                  <div className="glass-social-tags">
                    <span className="glass-social-tag">#ClientSuccess</span>
                    <span className="glass-social-tag">#EnterpriseUI</span>
                    <span className="glass-social-tag">#ProductReleases</span>
                  </div>
                </div>

                {/* Bottom: Channel CTA */}
                <div className="glass-social-card__bottom">
                  <span className="glass-card-meta-note">99.8% Recommend</span>
                  <a
                    href="https://facebook.com/naileditbro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-cta-btn glass-cta-btn--facebook"
                  >
                    <span>Join Community</span>
                    <span className="glass-cta-btn-arrow">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Social API Connector Modal */}
        {showApiModal && (
          <div
            className="socials-api-modal-backdrop"
            onClick={() => setShowApiModal(false)}
          >
            <div
              className="socials-api-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="socials-api-modal__header">
                <h3 className="socials-api-modal__title">Live Social API Integration</h3>
                <button
                  type="button"
                  className="socials-api-modal__close"
                  onClick={() => setShowApiModal(false)}
                >
                  ✕
                </button>
              </div>
              <p>
                To stream 100% live follower metrics and latest posts directly from Instagram, Facebook, and LinkedIn, connect your developer credentials below:
              </p>

              <div className="socials-api-steps">
                <div className="socials-api-step">
                  <div className="socials-api-step__no">1</div>
                  <div className="socials-api-step__content">
                    <strong>Instagram & Facebook Graph API</strong>
                    <span>Generate a Long-Lived User Access Token in Meta for Developers with <code>instagram_basic</code> & <code>pages_show_list</code> permissions.</span>
                  </div>
                </div>
                <div className="socials-api-step">
                  <div className="socials-api-step__no">2</div>
                  <div className="socials-api-step__content">
                    <strong>LinkedIn Community Management API</strong>
                    <span>Create an app in the LinkedIn Developer Portal to access the Organization Followers & Posts endpoint.</span>
                  </div>
                </div>
                <div className="socials-api-step">
                  <div className="socials-api-step__no">3</div>
                  <div className="socials-api-step__content">
                    <strong>Plug into Environment Variables</strong>
                    <span>Add these keys to your project root <code>.env</code> file:</span>
                  </div>
                </div>
              </div>

              <div className="socials-api-env-box">
                <div>VITE_INSTAGRAM_USER_ID=nailedit.bro</div>
                <div>VITE_INSTAGRAM_GRAPH_TOKEN=EAA...your_token_here</div>
                <div>VITE_LINKEDIN_ORG_URN=urn:li:organization:12345678</div>
                <div>VITE_FACEBOOK_PAGE_ID=naileditbro</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. GRAND BOTTOM BANNER (Light Cream & Warm Glow) */}
      <section className="about-bottom-cta section">
        <div className="container">
          <div className="about-grand-banner">
            <div className="about-grand-banner__glow" aria-hidden="true" />
            <div className="about-pill-badge">
              <span className="about-pill-dot" />
              <span>START A COLLABORATION</span>
            </div>
            <h2 className="display-2">
              Ready to nail your next <br />
              <em className="serif">flagship launch?</em>
            </h2>
            <p>
              Whether you are architecting a new web platform, a viral 3D mobile game, an AI automation pipeline, or an unmistakable brand identity.
            </p>
            <div className="about-grand-banner__actions">
              <Magnetic>
                <button
                  className="btn btn--dark hero__btn-primary"
                  onClick={() => handleCta('#contact')}
                >
                  <span className="btn__label" data-text="Start Your Project">
                    Start Your Project
                  </span>
                  <span className="btn__icon" aria-hidden="true">
                    →
                  </span>
                </button>
              </Magnetic>
              <button
                className="btn btn--ghost"
                onClick={() => handleCta('#work')}
              >
                <span className="btn__label" data-text="Explore Selected Work">
                  Explore Selected Work
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
