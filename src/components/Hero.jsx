import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, splitLines, EASE, DUR, STAGGER } from '../lib/motion'
import { scrollToTarget } from '../lib/useSmoothScroll'
import { HeroSite, MobileGameDummy } from './Mockups'
import Magnetic from './Magnetic'

const SHOWCASE_ITEMS = [
  {
    id: 'desktop',
    title: 'Website Development',
    subtitle: 'Artisan Cafe & Bakery · High-conversion responsive website with custom motion',
    tag: 'Website Development',
    badge: 'Desktop Website · Artisan Cafe',
    url: 'brewandbloom.co',
    img: '/brew-bloom.jpg',
    accent: '#FF5E14',
    thumbLabel: 'Website Dev',
    isDesktop: true,
  },
  {
    id: 'brand',
    title: 'Brand Identity & Digital Presence',
    subtitle: 'Aurélia Studio · Bespoke editorial typography & complete visual system',
    tag: 'Brand & Digital Presence',
    badge: 'Visual Identity System',
    url: 'aurelia.studio',
    img: '/brand-identity.jpg',
    accent: '#D97706',
    thumbLabel: 'Brand Identity',
    isDesktop: false,
  },
  {
    id: 'app',
    title: 'Mobile App Development',
    subtitle: 'Buddy · All-in-One Pet Care super-app with instant health logs & booking',
    tag: 'Mobile App Development',
    badge: 'iOS & Android App',
    url: 'apps.apple.com/buddy-pet',
    img: '/pet.png',
    accent: '#10B981',
    thumbLabel: 'Mobile App',
    isDesktop: false,
  },
  {
    id: 'game',
    title: 'Mobile Game Development',
    subtitle: 'Cyber Racer · High-speed 3D racing simulator crafted by our studio member',
    tag: 'Mobile Game Development',
    badge: 'Studio Member Built',
    url: 'games.naileditbro.com/racer',
    img: '/mobile_game.jpeg',
    accent: '#06B6D4',
    thumbLabel: 'Mobile Game',
    isDesktop: false,
  },
  {
    id: 'social',
    title: 'Social Media Management & Marketing',
    subtitle: 'Multi-platform viral content strategy, growth campaigns & audience engagement',
    tag: 'Social Media & Marketing',
    badge: 'Omnichannel Growth',
    url: 'growth.naileditbro.com',
    img: '/social.png',
    accent: '#EC4899',
    thumbLabel: 'Social Media',
    isDesktop: false,
  },
]

export default function Hero({ ready }) {
  const root = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredId, setHoveredId] = useState(null)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-cycle items one by one every 3.8s (pauses on hover)
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length)
    }, 3800)
    return () => clearInterval(timer)
  }, [isPaused])

  const activeItem = SHOWCASE_ITEMS[currentIndex]
  // When hovering over a thumbnail, immediately preview that item bigger and colored at top
  const displayItem = (hoveredId ? SHOWCASE_ITEMS.find((it) => it.id === hoveredId) : null) || activeItem
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
          const split = splitLines('.hero__title')
          gsap.set(split.lines, { yPercent: 110 })
          gsap.set('.hero__title', { autoAlpha: 1 })

          const intro = gsap.timeline({ paused: true, defaults: { ease: EASE.out } })
          intro
            .fromTo('.hero__eyebrow', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: DUR.base }, 0)
            .to(split.lines, { yPercent: 0, duration: DUR.slow, stagger: STAGGER.lines }, 0.05)
            .fromTo('.hero__sub', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: DUR.base }, 0.45)
            .fromTo('.hero__ctas [data-intro]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: DUR.base, stagger: STAGGER.items }, 0.55)
            .fromTo('.hero__visual', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.2)
            .from('.hero-stage', { y: 24, scale: 0.96, autoAlpha: 0, duration: 1.1 }, 0.3)
            .from('.hero-thumb', { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 0.5)
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
                split.revert()
              }
            }
          }
          return () => split.revert()
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
        <div className="hero__copy">
          <p className="hero__eyebrow eyebrow" data-intro><span className="dot" /> Digital studio · Brands, websites & apps</p>
          <h1 className="hero__title display" id="hero-title" data-intro>
            We craft digital products that feel <em className="serif">nailed.</em>
          </h1>
          <p className="hero__sub" data-intro>
            Nailed It Bro is a high-impact design and engineering studio. We shape ambitious brands, build fast websites, launch addictive apps, and drive viral social media growth.
          </p>
          <div className="hero__ctas">
            <Magnetic>
              <a href="#contact" className="btn btn--dark" data-intro onClick={(e) => { e.preventDefault(); scrollToTarget('#contact') }}>
                <span className="btn__label" data-text="Start a Project">Start a Project</span>
                <span className="btn__icon" aria-hidden="true">→</span>
              </a>
            </Magnetic>
            <a href="#work" className="btn btn--ghost" data-intro onClick={(e) => { e.preventDefault(); scrollToTarget('#work') }}>
              <span className="btn__label" data-text="Explore Selected Work">Explore Selected Work</span>
            </a>
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

              {/* Top Featured Stage: Rounded Corners, Fixed Size */}
              <div
                className={`hero-stage hero-stage--${displayItem.id} ${
                  displayItem.isDesktop ? 'hero-stage--desktop' : displayItem.id === 'game' ? 'hero-stage--game' : 'hero-stage--image'
                }`}
                key={displayItem.id}
              >
                {displayItem.isDesktop && (
                  /* Desktop Browser Bar (ONLY for Website Development) */
                  <div className="hero-stage__browser-bar">
                    <div className="hero-stage__dots">
                      <span className="dot dot--red" />
                      <span className="dot dot--yellow" />
                      <span className="dot dot--green" />
                    </div>
                    <div className="hero-stage__url-pill">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span>{displayItem.url}</span>
                    </div>
                    <div className="hero-stage__status">
                      <span className="hero-stage__live-pulse" style={{ backgroundColor: displayItem.accent, color: displayItem.accent }} />
                      <span className="hero-stage__status-text">{displayItem.tag}</span>
                    </div>
                  </div>
                )}

                {/* Main Stage Screen in Fixed Box */}
                <div className="hero-stage__screen">
                  {displayItem.isDesktop ? (
                    <HeroSite />
                  ) : displayItem.id === 'game' ? (
                    <MobileGameDummy img={displayItem.img} />
                  ) : (
                    <img
                      src={displayItem.img}
                      alt={displayItem.title}
                      className="hero-stage__pure-img"
                      loading="eager"
                    />
                  )}
                </div>
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

