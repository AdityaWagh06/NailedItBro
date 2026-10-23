import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, splitLines, EASE, DUR, STAGGER } from '../lib/motion'
import { scrollToTarget } from '../lib/useSmoothScroll'
import Magnetic from './Magnetic'

const SHOWCASE_ITEMS = [
  {
    id: 'studio',
    title: 'Nailed It Bro Studio',
    thumbLabel: 'Overview',
    accent: '#FF5E14',
    img: '/naileditbro.png',
    eyebrow: 'Digital studio · Brands, websites & apps',
    titlePrefix: 'We craft digital products that feel',
    titleHighlight: 'nailed.',
    sub: 'Nailed It Bro is a high-impact design and engineering studio. We shape ambitious brands, build fast websites, launch addictive apps, and drive viral social media growth.',
    cta1: 'Start a Project',
    cta2: 'Explore Selected Work',
    isDesktop: false,
  },
  {
    id: 'desktop',
    title: 'Website Development',
    thumbLabel: 'Website Dev',
    accent: '#FF5E14',
    img: '/web.png',
    eyebrow: 'Website Design & Development',
    titlePrefix: 'Artisan web experiences built to',
    titleHighlight: 'convert.',
    sub: 'Custom-designed marketing websites and web apps built on modern tech stacks, with smooth purposeful motion, easy CMS management, and uncompromising performance.',
    cta1: 'Build Your Website',
    cta2: 'Explore Selected Work',
    isDesktop: true,
  },
  {
    id: 'ai',
    title: 'QR Solutions & AI Automation',
    thumbLabel: 'AI Automation',
    accent: '#D97706',
    img: '/qr.png',
    eyebrow: 'QR Solutions & Booking Automation',
    titlePrefix: 'Smart automated booking that fills your',
    titleHighlight: 'schedule.',
    sub: 'Scan-to-book QR table stands, instant WhatsApp appointment reminders, AI chat assistants, and automated client retention funnels that multiply your revenue.',
    cta1: 'Automate Your Bookings',
    cta2: 'Explore Selected Work',
    isDesktop: false,
  },
  {
    id: 'app',
    title: 'Mobile App Development',
    thumbLabel: 'Mobile App',
    accent: '#10B981',
    img: '/pet.png',
    eyebrow: 'iOS & Android App Engineering',
    titlePrefix: 'Addictive mobile apps users love',
    titleHighlight: 'daily.',
    sub: 'Native-feeling iOS and Android apps with fluid gestures, instant offline sync, scalable cloud infrastructure, and habit-forming product design.',
    cta1: 'Launch an App',
    cta2: 'Explore Selected Work',
    isDesktop: false,
  },
  {
    id: 'game',
    title: 'Mobile Game Development',
    thumbLabel: 'Mobile Game',
    accent: '#06B6D4',
    img: '/game.png',
    eyebrow: '3D Mobile Game Development',
    titlePrefix: 'High-speed games that keep players',
    titleHighlight: 'hooked.',
    sub: 'Custom 3D game mechanics, responsive physics engines, real-time multiplayer networking, and smooth mobile touchscreen controls built for viral engagement.',
    cta1: 'Develop a Game',
    cta2: 'Explore Selected Work',
    isDesktop: false,
  },
  {
    id: 'social',
    title: 'Social Media Management & Marketing',
    thumbLabel: 'Social Media',
    accent: '#EC4899',
    img: '/social.png',
    eyebrow: 'Social Media & Omnichannel Growth',
    titlePrefix: 'Viral content and campaigns that drive',
    titleHighlight: 'growth.',
    sub: 'High-impact short-form video strategy, multi-channel distribution, audience retention funnels, and data-driven campaigns that turn viewers into buyers.',
    cta1: 'Scale Your Reach',
    cta2: 'Explore Selected Work',
    isDesktop: false,
  },
]

export default function Hero({ ready }) {
  const root = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredId, setHoveredId] = useState(null)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-cycle items one by one every 6.2s (pauses on hover)
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length)
    }, 6200)
    return () => clearInterval(timer)
  }, [isPaused])

  const activeItem = SHOWCASE_ITEMS[currentIndex]
  // When hovering over a thumbnail, immediately preview that item bigger and colored at top
  const displayItem = (hoveredId ? SHOWCASE_ITEMS.find((it) => it.id === hoveredId) : null) || activeItem
  const displayIndex = SHOWCASE_ITEMS.findIndex((it) => it.id === displayItem.id)
  // Bottom row contains the other 4 items side by side in black-and-white
  const bottomItems = SHOWCASE_ITEMS.filter((item) => item.id !== activeItem.id)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          desktop: '(min-width: 900px) and (pointer: fine)',
        },
        (ctx) => {
          const { motion, desktop } = ctx.conditions
          if (!motion) {
            gsap.set('.hero [data-intro]', { autoAlpha: 1 })
            return
          }

          // Hide intro elements until the loader hands over.
          gsap.set('[data-intro]', { autoAlpha: 0 })

          const intro = gsap.timeline({ paused: true, defaults: { ease: EASE.out } })
          intro
            .fromTo('.hero__copy', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: DUR.slow }, 0.05)
            .fromTo('.hero__visual', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.2)
            .from('.hero-stage', { y: 24, scale: 0.96, autoAlpha: 0, duration: 1.1 }, 0.3)
            .fromTo('.hero__meta > *', { autoAlpha: 0 }, { autoAlpha: 1, duration: DUR.base, stagger: 0.1 }, 0.8)
            .from('.hero__bg-n', { autoAlpha: 0, scale: 0.9, duration: 2 }, 0)

          root.current._intro = intro
          if (ready) intro.play()

          // Scroll out: the composition sinks back while the title drifts up.
          gsap.timeline({
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
          })
            .to('.hero__showcase-wrapper', { yPercent: 12, scale: 0.95, ease: 'none' }, 0)
            .to('.hero__copy', { yPercent: -10, ease: 'none' }, 0)
            .to('.hero__bg-n', { rotate: 18, yPercent: 20, ease: 'none' }, 0)
            .to('.hero__grid', { yPercent: 15, ease: 'none' }, 0)

          // Smooth pointer parallax on the unified showcase
          if (desktop) {
            const showcase = root.current.querySelector('.hero__showcase-wrapper')
            if (showcase) {
              const toX = gsap.quickTo(showcase, 'x', { duration: 1.2, ease: 'power3.out' })
              const toY = gsap.quickTo(showcase, 'y', { duration: 1.2, ease: 'power3.out' })
              const onMove = (e) => {
                const nx = e.clientX / window.innerWidth - 0.5
                const ny = e.clientY / window.innerHeight - 0.5
                toX(nx * 14)
                toY(ny * 10)
              }
              window.addEventListener('pointermove', onMove)
              return () => {
                window.removeEventListener('pointermove', onMove)
              }
            }
          }
          return () => { }
        },
      )
      return () => mm.revert()
    },
    { dependencies: [ready], scope: root },
  )

  // Play the intro once the loader hands over (or straight away if skipped).
  useGSAP(
    () => {
      if (ready && root.current?._intro) {
        root.current._intro.play()
      }
    },
    { dependencies: [ready], scope: root },
  )

  return (
    <section className="hero" id="top" ref={root} data-theme="light" aria-labelledby="hero-title">
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__bg-n serif" aria-hidden="true">n</div>

      <div className="hero__inner container">
        <div className="hero__copy" data-intro>
          {/* Ambient atmosphere shifting with current service accent */}
          <div
            className="hero__ambient-glow"
            style={{
              '--ambient-accent': displayItem.accent,
            }}
            aria-hidden="true"
          />

          <div className="hero__copy-stage" style={{ '--hero-accent': displayItem.accent }}>
            {SHOWCASE_ITEMS.map((item, index) => {
              const isActive = index === displayIndex
              return (
                <div
                  key={item.id}
                  className={`hero__copy-slide ${isActive ? 'is-active' : ''}`}
                  style={{ '--slide-accent': item.accent }}
                  aria-hidden={!isActive}
                >
                  {/* Modern Eyebrow with Counter Pill & Pulsing Radar */}
                  <p className="hero__eyebrow eyebrow">
                    <span className="hero__counter-pill">
                      <span className="hero__counter-num">0{index + 1}</span>
                      <span className="hero__counter-slash">/</span>
                      <span className="hero__counter-total">0{SHOWCASE_ITEMS.length}</span>
                    </span>
                    <span
                      className="hero__radar-dot"
                      style={{ '--radar-color': item.accent }}
                    >
                      <span className="hero__radar-ping" />
                      <span className="hero__radar-core" />
                    </span>
                    <span className="hero__eyebrow-text">{item.eyebrow}</span>
                  </p>

                  {/* Kinetic Title with Smooth Slower Domino Word Roll */}
                  <h1 className="hero__title display" id={isActive ? 'hero-title' : undefined}>
                    {item.titlePrefix.split(' ').map((word, wIdx) => (
                      <span key={wIdx} className="hero__word-wrap">
                        <span
                          className="hero__word"
                          style={{
                            transitionDelay: isActive ? `${0.16 + 0.06 * wIdx}s` : '0s',
                          }}
                        >
                          {word}
                        </span>
                      </span>
                    ))}
                    <span className="hero__word-wrap">
                      <em
                        className="serif hero__serif-word"
                        style={{
                          transitionDelay: isActive
                            ? `${0.16 + 0.06 * item.titlePrefix.split(' ').length}s`
                            : '0s',
                          '--hero-accent': item.accent,
                        }}
                      >
                        {item.titleHighlight}
                      </em>
                    </span>
                  </h1>

                  {/* Blur-to-focus subtitle description */}
                  <p className="hero__sub">{item.sub}</p>

                  {/* Magnetic CTA Buttons with Glowing Primary */}
                  <div className="hero__ctas">
                    <Magnetic>
                      <a
                        href="#contact"
                        className="btn btn--dark hero__btn-primary"
                        style={{ '--btn-accent-glow': `${item.accent}44` }}
                        onClick={(e) => {
                          e.preventDefault()
                          scrollToTarget('#contact')
                        }}
                        tabIndex={isActive ? 0 : -1}
                      >
                        <span className="btn__label" data-text={item.cta1}>
                          {item.cta1}
                        </span>
                        <span className="btn__icon hero__btn-arrow" aria-hidden="true">→</span>
                      </a>
                    </Magnetic>
                    <a
                      href="#work"
                      className="btn btn--ghost"
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToTarget('#work')
                      }}
                      tabIndex={isActive ? 0 : -1}
                    >
                      <span className="btn__label" data-text={item.cta2}>
                        {item.cta2}
                      </span>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="hero__visual" data-intro>
          <div
            className="hero__showcase-wrapper"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false)
              setHoveredId(null)
            }}
          >
            <div className="hero-showcase-row">
              {/* Vertical Segment Indicator (as shown in user reference) */}
              <div className="hero-v-nav" aria-label="Showcase slider navigation">
                {SHOWCASE_ITEMS.map((item, idx) => {
                  const isActive = displayItem.id === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`hero-v-nav__seg ${isActive ? 'is-active' : ''}`}
                      onClick={() => {
                        setCurrentIndex(idx)
                        setHoveredId(null)
                      }}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      aria-label={item.title}
                      style={{ '--seg-accent': item.accent }}
                    >
                      <span className="hero-v-nav__track">
                        <span className="hero-v-nav__fill" />
                      </span>
                      <span className="hero-v-nav__tooltip">{item.thumbLabel}</span>
                    </button>
                  )
                })}
              </div>

              {/* Top Featured Stage: Smooth Layered Crossfade with 16:10 Rounded Frame */}
              <div className="hero-stage">
                {SHOWCASE_ITEMS.map((item) => {
                  const isActive = item.id === displayItem.id
                  return (
                    <div
                      key={item.id}
                      className={`hero-stage__slide hero-stage--${item.id} ${
                        item.isDesktop ? 'hero-stage--desktop' : 'hero-stage--image'
                      } ${isActive ? 'is-active' : ''}`}
                    >
                      <div className="hero-stage__screen">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="hero-stage__pure-img"
                          loading="eager"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__meta container">
        <span>Websites · Apps · UI/UX · Social Media · Automation · Growth</span>
        <button className="hero__scroll" onClick={() => scrollToTarget('#manifesto')}>
          <span className="hero__scroll-line" aria-hidden="true" /> Scroll to explore
        </button>
        <span className="hide-sm">Design · Engineering · Growth</span>
      </div>
    </section>
  )
}

