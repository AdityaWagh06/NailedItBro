import { useEffect, useRef, useState } from 'react'
import { TEAM_MEMBERS, SOCIALS } from '../data'
import { gsap, useGSAP, revealHeading } from '../lib/motion'
import Magnetic from './Magnetic'

export default function AboutPage({ onNavigate }) {
  const root = useRef(null)
  const [activeTab, setActiveTab] = useState('all')

  // Set page theme to light for About Us page
  useEffect(() => {
    document.documentElement.dataset.page = 'light'
    return () => {
      // Restore when leaving if necessary
    }
  }, [])

  // Mouse spotlight tracker (React Bits SpotlightCard pattern)
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
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        revealHeading('.about-l-hero__title')
        gsap.from('.about-spotlight', {
          y: 35,
          opacity: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.about-bento-grid', start: 'top 85%', once: true },
        })
        gsap.from('.step-card', {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.steps-grid', start: 'top 80%', once: true },
        })
        gsap.from('.team-spotlight-card', {
          y: 35,
          opacity: 0,
          stagger: 0.07,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.team-spotlight-grid', start: 'top 80%', once: true },
        })
        gsap.from('.social-spotlight-card', {
          y: 30,
          opacity: 0,
          stagger: 0.06,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.socials-spotlight-grid', start: 'top 85%', once: true },
        })
      })
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

      {/* 3. OUR TEAM (Modern Interactive Spotlight Cards) */}
      <section className="about-team-section section">
        <div className="container">
          <div className="section-head">
            <div className="about-pill-badge">
              <span className="about-pill-dot" />
              <span>THE COLLECTIVE</span>
            </div>
            <h2 className="display-2">
              The multidisciplinary minds <br />
              <em className="serif">behind Nailed It Bro.</em>
            </h2>
            <p className="about-l-hero__sub">
              A tight-knit crew of obsessive digital craftsmen, principal engineers, and growth architects.
            </p>
          </div>

          <div className="team-spotlight-grid">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="team-spotlight-card"
                onMouseMove={handleSpotlight}
                style={{ '--member-tone': member.avatarTone }}
              >
                <div className="team-spotlight__avatar-wrap">
                  <div className="team-spotlight__avatar">
                    <span>
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <span className="team-spotlight__status" title="Active in Studio" />
                </div>

                <div className="team-spotlight__info">
                  <h3 className="team-spotlight__name">{member.name}</h3>
                  <span className="team-spotlight__role">{member.role}</span>
                  <p className="team-spotlight__bio">{member.bio}</p>

                  <div className="team-spotlight__skills">
                    {member.skills.map((skill) => (
                      <span key={skill} className="team-skill-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OUR SOCIALS & COMMUNITY (Interactive Brand Spotlight Cards) */}
      <section className="about-socials-section section">
        <div className="container">
          <div className="section-head">
            <div className="about-pill-badge">
              <span className="about-pill-dot" />
              <span>OUR COMMUNITY & SOCIALS</span>
            </div>
            <h2 className="display-2">
              Join the inner circle. <br />
              <em className="serif">Connect across platforms.</em>
            </h2>
            <p className="about-l-hero__sub">
              We share live build teardowns, Figma design systems, open-source toolkits, and weekly engineering breakdowns.
            </p>
          </div>

          <div className="socials-spotlight-grid">
            {SOCIALS.map((soc) => (
              <a
                key={soc.platform}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-spotlight-card"
                onMouseMove={handleSpotlight}
                style={{ '--soc-accent': soc.tone }}
              >
                <div className="social-spotlight__top">
                  <span className="social-spotlight__platform">{soc.platform}</span>
                  <span className="social-spotlight__badge">{soc.followers}</span>
                </div>
                <div className="social-spotlight__handle">{soc.handle}</div>
                <p className="social-spotlight__desc">{soc.desc}</p>
                <div className="social-spotlight__footer">
                  <span className="social-spotlight__link">Connect with us</span>
                  <span className="social-spotlight__arrow" aria-hidden="true">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
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
