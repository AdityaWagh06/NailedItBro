import { useEffect, useRef, useState } from 'react'
import { SERVICES } from '../data'
import { gsap, useGSAP, revealHeading, useReducedMotion } from '../lib/motion'
import { ServiceIcon, ServicePreview } from './ServiceArt'

const SERVICE_META = {
  web: {
    badgeIcon: '⚡',
    metric: '99/100',
    metricLabel: 'CORE WEB VITALS',
    image: '/web.png',
  },
  apps: {
    badgeIcon: '📱',
    metric: '120 FPS',
    metricLabel: 'NATIVE GESTURES',
    image: '/pet.png',
  },
  game: {
    badgeIcon: '🎮',
    metric: '99,450',
    metricLabel: 'LIVE HIGH SCORE',
    image: '/game.png',
  },
  'ai-qr': {
    badgeIcon: '✨',
    metric: '< 1.8s',
    metricLabel: 'AI & QR WORKFLOWS',
    image: '/ai_automation.jpg',
  },
  social: {
    badgeIcon: '🎬',
    metric: '+1.2M',
    metricLabel: 'IMPRESSIONS',
    image: '/social_growth.jpg',
  },
  brand: {
    badgeIcon: '✦',
    metric: 'Complete',
    metricLabel: 'BRAND SYSTEM',
    image: '/brand_identity.jpg',
  },
  crm: {
    badgeIcon: '🛡️',
    metric: 'Real-time',
    metricLabel: 'TELEMETRY',
    image: '/crm_dashboard.jpg',
  },
  ads: {
    badgeIcon: '🎯',
    metric: '4.8x',
    metricLabel: 'AVERAGE ROAS',
    image: '/google_meta_ads.jpg',
  },
}

export default function Services() {
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const [prevActive, setPrevActive] = useState(null)
  const [lastActive, setLastActive] = useState(0)
  const reduced = useReducedMotion()

  // Preload all discipline images so they switch instantly without any decode flash
  useEffect(() => {
    Object.values(SERVICE_META).forEach((item) => {
      if (item.image) {
        const img = new Image()
        img.src = item.image
      }
    })
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const h = revealHeading('.services__title')
        return () => h?.revert && h.revert()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const handleCardClick = (i) => {
    setActive((prev) => {
      if (prev === i) {
        return -1
      }
      setPrevActive(prev >= 0 ? prev : lastActive)
      setLastActive(i)
      return i
    })
  }

  const activeIndex = active >= 0 ? active : lastActive
  const activeSvc = SERVICES[activeIndex] || SERVICES[0]

  return (
    <section className="services" id="services" ref={root} aria-labelledby="services-title">
      <div className="container">
        {/* Section Header */}
        <div className="services__head text-center">
          <p className="services__eyebrow">(Our Disciplines)</p>
          <h2 className="services__title" id="services-title">
            Our Services
          </h2>
          <p className="services__lead">
            End-to-end design, engineering, and growth.
          </p>
        </div>

        {/* 2-Column Split: Showcase Image on Left, Vertical Cards Stack on Right */}
        <div className="services__split">
          {/* LEFT: Showcase Image (Clean, Smooth Crossfade, No Black Gaps) */}
          <div className="services__showcase-col">
            <div
              className="services__showcase"
              style={{ '--tone': activeSvc.tone }}
            >
              <div className="services__showcase-media">
                {SERVICES.map((svc) => {
                  const isCurrent = svc.id === activeSvc.id
                  const isPrevious = prevActive !== null && svc.id === SERVICES[prevActive]?.id && !isCurrent
                  const svcMeta = SERVICE_META[svc.id]

                  return (
                    <div
                      key={svc.id}
                      className={`services__showcase-layer ${isCurrent ? 'is-active' : ''} ${isPrevious ? 'is-previous' : ''}`}
                      aria-hidden={!isCurrent}
                    >
                      <div className="services__showcase-art">
                        <ServicePreview id={svc.id} />
                      </div>

                      {svcMeta?.image && (
                        <div className="services__showcase-img-wrap">
                          <img
                            src={svcMeta.image}
                            alt={svc.title}
                            className="services__showcase-img"
                            loading="eager"
                            decoding="async"
                          />
                          <div className="services__showcase-overlay" />
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Active Service Badge */}
                <div className="svc-showcase__overlay-badge">
                  <span className="svc-showcase__overlay-no">{activeSvc.no}</span>
                  <span className="svc-showcase__overlay-title">{activeSvc.title}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Vertical Services List — Just name, description only on click */}
          <div className="services__cards-col">
            <div
              className="services__vertical-list"
              role="tablist"
              aria-label="Services Disciplines"
            >
              {SERVICES.map((svc, i) => {
                const isActive = i === active

                return (
                  <div
                    key={svc.id}
                    className={`svc-v-card ${isActive ? 'is-active' : ''}`}
                    style={{ '--tone': svc.tone }}
                    onClick={() => handleCardClick(i)}
                    role="tab"
                    tabIndex={0}
                    aria-selected={isActive}
                    aria-controls={`svc-panel-${svc.id}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleCardClick(i)
                      }
                    }}
                  >
                    {/* Header Row: Number + Icon + Title + Toggle Icon */}
                    <div className="svc-v-card__header">
                      <div className="svc-v-card__title-wrap">
                        <span className="svc-v-card__no">{svc.no}</span>
                        <span className="svc-v-card__icon" aria-hidden="true">
                          <ServiceIcon id={svc.id} />
                        </span>
                        <h3 className="svc-v-card__title">{svc.title}</h3>
                      </div>
                      <span className="svc-v-card__toggle" aria-hidden="true">
                        {isActive ? '−' : '+'}
                      </span>
                    </div>

                    {/* Expandable Description: Visible only after clicking */}
                    <div className="svc-v-card__collapse">
                      <div className="svc-v-card__body">
                        <p className="svc-v-card__desc">{svc.short}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
