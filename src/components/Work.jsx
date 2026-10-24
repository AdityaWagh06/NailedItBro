import { useCallback, useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../data'
import { gsap, useGSAP, revealHeading, ScrollTrigger } from '../lib/motion'
import { scrollToTarget } from '../lib/useSmoothScroll'
import { Browser, Phone, ProjectScreen, ProjectPhone } from './Mockups'
import CaseStudy from './CaseStudy'

const slugFromHash = () => {
  const m = window.location.hash.match(/^#work\/([\w-]+)$/)
  return m && PROJECTS.some((p) => p.slug === m[1]) ? m[1] : null
}

function ProjectVisual({ p }) {
  return (
    <div className={`proj__stage proj__stage--${p.layout}`} style={{ '--p-bg': p.palette.bg, '--p-ink': p.palette.ink, '--p-accent': p.palette.accent, '--p-soft': p.palette.soft }}>
      <div className="proj__backdrop" />
      <div className="proj__browser" data-speed="0.6"><Browser url={`${p.slug}.concept`}><ProjectScreen layout={p.layout} /></Browser></div>
      <div className="proj__phone" data-speed="1.4"><Phone><ProjectPhone layout={p.layout} /></Phone></div>
      <span className="proj__badge">Concept</span>
    </div>
  )
}

export default function Work() {
  const root = useRef(null)
  const track = useRef(null)
  const [count, setCount] = useState(1)
  const [openSlug, setOpenSlug] = useState(slugFromHash)

  // Case studies live at #work/<slug>: back/forward and direct links work.
  useEffect(() => {
    const sync = () => setOpenSlug(slugFromHash())
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  const openProject = (slug) => {
    history.pushState({ caseStudy: slug }, '', `#work/${slug}`)
    setOpenSlug(slug)
  }
  const closeProject = useCallback(() => {
    if (history.state?.caseStudy) history.back()
    else {
      history.replaceState(null, '', '#work')
      setOpenSlug(null)
    }
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          horizontal: '(min-width: 1000px) and (prefers-reduced-motion: no-preference)',
          vertical: '(max-width: 999px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const h = revealHeading('.work__title')
          const panels = gsap.utils.toArray('.proj')

          if (ctx.conditions.horizontal) {
            const distance = () => track.current.scrollWidth - window.innerWidth
            const scroll = gsap.to(track.current, {
              x: () => -distance(),
              ease: 'none',
              scrollTrigger: {
                trigger: '.work__pin',
                start: 'top top',
                end: () => `+=${distance()}`,
                pin: true,
                scrub: 0.8,
                invalidateOnRefresh: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                  gsap.set('.work__bar-fill', { scaleX: self.progress })
                  setCount(Math.min(PROJECTS.length, Math.max(1, Math.round(self.progress * (PROJECTS.length - 1)) + 1)))
                  if (self.progress > 0.88) {
                    gsap.to('.work__progress', { autoAlpha: 0, duration: 0.25, overwrite: 'auto' })
                  } else {
                    gsap.to('.work__progress', { autoAlpha: 1, duration: 0.25, overwrite: 'auto' })
                  }
                },
              },
            })

            panels.forEach((panel) => {
              // Image reveal as each panel slides into view.
              gsap.from(panel.querySelector('.proj__stage'), {
                clipPath: 'inset(0% 0% 0% 100% round 20px)',
                ease: 'power2.out',
                scrollTrigger: { trigger: panel, containerAnimation: scroll, start: 'left 95%', end: 'left 45%', scrub: true },
              })
              // Layers drift at different speeds for depth.
              panel.querySelectorAll('[data-speed]').forEach((el) => {
                gsap.fromTo(el, { xPercent: 12 * el.dataset.speed }, {
                  xPercent: -12 * el.dataset.speed, ease: 'none',
                  scrollTrigger: { trigger: panel, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true },
                })
              })
              // Entrance: metadata reveals when panel slides into view
              gsap.from(panel.querySelectorAll('.proj__meta > *'), {
                x: 30, autoAlpha: 0, stagger: 0.06, duration: 0.8,
                scrollTrigger: { trigger: panel, containerAnimation: scroll, start: 'left 75%', toggleActions: 'play none none reverse' },
              })
              // Exit: smoothly dissolve the entire panel as it leaves the viewport on the left
              gsap.to(panel, {
                autoAlpha: 0,
                xPercent: -8,
                ease: 'power1.inOut',
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: scroll,
                  start: 'right 35%',
                  end: 'right 0%',
                  scrub: true,
                },
              })
            })
          } else {
            panels.forEach((panel) => {
              gsap.from(panel.querySelector('.proj__stage'), {
                clipPath: 'inset(20% 10% 0% 10% round 20px)', scale: 1.05, duration: 1.3, ease: 'expo.out',
                scrollTrigger: { trigger: panel, start: 'top 85%', once: true },
              })
              gsap.from(panel.querySelectorAll('.proj__meta > *'), {
                y: 24, autoAlpha: 0, stagger: 0.06, duration: 0.8,
                scrollTrigger: { trigger: panel, start: 'top 75%', once: true },
              })
            })
          }
          return () => h.revert()
        },
      )
      return () => mm.revert()
    },
    { scope: root },
  )

  // Opening a deep-linked case study should land the page on the Work section.
  useEffect(() => {
    if (openSlug) setTimeout(() => ScrollTrigger.refresh(), 50)
  }, [openSlug])

  const project = PROJECTS.find((p) => p.slug === openSlug)

  return (
    <section className="work" id="work" ref={root} data-theme="dark" aria-labelledby="work-title">
      <div className="work__pin">
        <div className="work__progress" aria-hidden="true">
          <span className="work__count">{String(count).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}</span>
          <div className="work__bar"><div className="work__bar-fill" /></div>
        </div>
        <div className="work__track" ref={track}>
          <div className="work__intro">
            <p className="eyebrow">(Selected work)</p>
            <h2 className="work__title display-2" id="work-title">Studio <em className="serif">explorations</em> in brand, web & product.</h2>
            <p className="work__note">These are self-initiated concept projects that show how we think and build. Client case studies are shared on request.</p>
          </div>

          {PROJECTS.map((p, i) => (
            <article className={`proj proj--${p.layout}`} key={p.slug} aria-labelledby={`proj-${p.slug}`}>
              <button className="proj__open" onClick={() => openProject(p.slug)} aria-label={`Open ${p.name} concept case study`}>
                <ProjectVisual p={p} />
              </button>
              <div className="proj__meta">
                <span className="proj__no">0{i + 1}</span>
                <h3 className="proj__name" id={`proj-${p.slug}`}>{p.name}</h3>
                <p className="proj__kind">{p.kind} · <span>{p.year}</span></p>
                <p className="proj__blurb">{p.blurb}</p>
                <button className="u-link proj__link" onClick={() => openProject(p.slug)}>View case study <span aria-hidden="true">→</span></button>
              </div>
            </article>
          ))}

          <div className="work__outro">
            <p className="display-2">Your project <em className="serif">could be next.</em></p>
            <a href="#contact" className="btn btn--light" onClick={(e) => { e.preventDefault(); scrollToTarget('#contact') }}>
              <span className="btn__label" data-text="Tell us about it">Tell us about it</span><span className="btn__icon" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      <CaseStudy project={project} onClose={closeProject} renderVisual={(p) => <ProjectVisual p={p} />} />
    </section>
  )
}
