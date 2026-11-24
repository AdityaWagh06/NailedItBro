import { useCallback, useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../data'
import { gsap, useGSAP, revealHeading, ScrollTrigger } from '../lib/motion'
import { scrollToTarget } from '../lib/useSmoothScroll'
import { ProjectScreen } from './Mockups'
import LivePreviewModal from './LivePreviewModal'

const slugFromHash = () => {
  const m = window.location.hash.match(/^#work\/([\w-]+)$/)
  if (!m) return null
  if (m[1] === 'halden' || m[1] === 'chiffon') return 'creme-and-whisk'
  return PROJECTS.some((p) => p.slug === m[1]) ? m[1] : null
}

function ProjectVisual({ p }) {
  return (
    <div
      className={`proj__stage proj__stage--clean proj__stage--${p.layout}`}
      style={{
        '--p-bg': p.palette.bg,
        '--p-ink': p.palette.ink,
        '--p-accent': p.palette.accent,
        '--p-soft': p.palette.soft
      }}
    >
      <div className="proj__backdrop" />
      <div className="proj__clean-media">
        {p.heroImage ? (
          <img
            src={p.heroImage}
            alt={`${p.name} website visual`}
            className="proj__clean-img"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="proj__clean-screen">
            <ProjectScreen layout={p.layout} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function Work() {
  const root = useRef(null)
  const [livePreviewProject, setLivePreviewProject] = useState(null)

  // Raw physical stacking without any fade or dimming
  useGSAP(
    () => {
      revealHeading('.work__title')
    },
    { scope: root },
  )

  return (
    <section className="work" id="work" ref={root} data-theme="light" aria-labelledby="work-title">
      {/* Section Header: placed cleanly at the top with NO left text squeezing the cards */}
      <div className="container work__header">
        <p className="eyebrow work__eyebrow">(Selected work)</p>
        <h2 className="work__title display-2" id="work-title">
          Studio <em className="serif">explorations</em> in<br />
          brand, web &amp; product.
        </h2>
        <p className="work__note">
          A selection of live client flagship builds and studio explorations in brand, web, and product engineering.
        </p>
      </div>

      {/* Full-Scape Vertical Scroll Stack */}
      <div className="container work__stack-container">
        <div className="work__stack">
          {PROJECTS.map((p, i) => (
            <div
              key={p.slug}
              className="work__card-wrapper"
              style={{
                zIndex: i + 1,
              }}
            >
              <article
                className={`work__card work__card--${p.layout}`}
                style={{
                  '--p-bg': p.palette.bg,
                  '--p-ink': p.palette.ink,
                  '--p-accent': p.palette.accent,
                  '--p-soft': p.palette.soft
                }}
                aria-labelledby={`proj-${p.slug}`}
              >
                {/* Visual Mockup Stage */}
                <div className="work__card-visual">
                  {p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj__open"
                      aria-label={`Visit ${p.name} live website at ${p.liveUrl}`}
                    >
                      <ProjectVisual p={p} />
                    </a>
                  ) : (
                    <a
                      href={`#case-study/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj__open"
                      aria-label={`Read ${p.name} case study in a new tab`}
                    >
                      <ProjectVisual p={p} />
                    </a>
                  )}
                </div>

                {/* Card Meta & Details */}
                <div className="work__card-meta">
                  <div className="work__card-top-bar">
                    <span className="work__card-badge">0{i + 1} / 0{PROJECTS.length}</span>
                    <span className="work__card-kind">{p.kind}</span>
                  </div>

                  <h3 className="work__card-title" id={`proj-${p.slug}`}>
                    {p.name}
                  </h3>

                  <p className="work__card-blurb">{p.blurb}</p>

                  {/* Dual Action: Live Website Button + Case Study Button */}
                  <div className="work__card-action-row">
                    {p.liveUrl ? (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="work__btn-live"
                        aria-label={`Open live website for ${p.name}`}
                      >
                        <span className="work__btn-live-text">Live Website</span>
                        <span className="work__btn-live-arrow" aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="work__btn-live"
                        onClick={() => setLivePreviewProject(p)}
                        aria-label={`Open live preview of ${p.name}`}
                      >
                        <span className="work__btn-live-text">Live Website</span>
                        <span className="work__btn-live-arrow" aria-hidden="true">↗</span>
                      </button>
                    )}

                    {p.caseStudy !== false && (
                    <a
                      href={`#case-study/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work__card-btn"
                      aria-label={`Read ${p.name} case study in a new tab`}
                    >
                      <span>Case study</span>
                      <span className="work__card-btn-arrow" aria-hidden="true">→</span>
                    </a>
                    )}
                  </div>
                </div>
              </article>
            </div>
          ))}

          {/* Outro CTA Card in the Stack */}
          <div
            className="work__card-wrapper work__card-wrapper--outro"
            style={{
              zIndex: PROJECTS.length + 1,
            }}
          >
            <div className="work__card work__card--outro">
              <div className="work__outro-inner">
                <p className="eyebrow">(Next Project)</p>
                <h3 className="display-2 work__outro-title">
                  Your project <em className="serif">could be next.</em>
                </h3>
                <p className="work__outro-sub">
                  Full-stack engineering, high-speed performance &amp; autonomous intelligence — engineered to get you real customers.
                </p>
                <a
                  href="#contact"
                  className="work__outro-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToTarget('#contact')
                  }}
                >
                  <span>Start your project</span>
                  <span className="work__card-btn-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Sticky Runway Spacer: enables the Outro card to stick 100% flush cut-to-cut over Pulse Studio */}
          <div className="work__stack-spacer" aria-hidden="true" />
        </div>
      </div>

      <LivePreviewModal project={livePreviewProject} onClose={() => setLivePreviewProject(null)} />
    </section>
  )
}
