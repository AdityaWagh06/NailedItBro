import { useEffect, useRef } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { MOTION_EASE, useReducedMotion } from '../lib/motion'
import { getLenis, scrollToTarget } from '../lib/useSmoothScroll'

export default function CaseStudy({ project, onClose, renderVisual }) {
  const reduced = useReducedMotion()
  const panel = useRef(null)
  const lastFocus = useRef(null)

  useEffect(() => {
    if (!project) return
    lastFocus.current = document.activeElement
    getLenis()?.stop()
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll('button, a[href]')
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => panel.current?.querySelector('.cs__close')?.focus(), 50)
    return () => {
      clearTimeout(t)
      getLenis()?.start()
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      lastFocus.current?.focus?.({ preventScroll: true })
    }
  }, [project, onClose])

  const ease = { duration: reduced ? 0 : 0.8, ease: MOTION_EASE }
  const item = (d) => ({
    initial: reduced ? false : { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { ...ease, delay: reduced ? 0 : d } },
  })

  return (
    <AnimatePresence>
      {project && (
        <m.div className="cs" key="cs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.2 } }}>
          <div className="cs__scrim" onClick={onClose} />
          <m.div
            ref={panel}
            className="cs__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cs-title"
            data-lenis-prevent
            initial={reduced ? false : { clipPath: 'inset(100% 0% 0% 0% round 28px)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
            exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0% round 28px)', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
            transition={{ ...ease, duration: reduced ? 0 : 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="cs__top">
              <span className="eyebrow">Concept case study</span>
              <button className="cs__close" onClick={onClose} aria-label="Close case study"><span /><span /></button>
            </div>
            <m.h2 className="cs__title display-2" id="cs-title" {...item(0.3)}>{project.name}</m.h2>
            <m.p className="cs__kind" {...item(0.38)}>{project.kind} · Self-initiated concept, not client work</m.p>
            <m.div className="cs__visual" {...item(0.45)}>{renderVisual(project)}</m.div>
            <div className="cs__grid">
              <m.div {...item(0.55)}>
                <h3 className="cs__h">The challenge</h3>
                <p>{project.challenge}</p>
              </m.div>
              <m.div {...item(0.62)}>
                <h3 className="cs__h">Our approach</h3>
                <ul className="cs__list">{project.approach.map((a) => <li key={a}>{a}</li>)}</ul>
              </m.div>
            </div>
            <m.div className="cs__foot" {...item(0.7)}>
              <p>Want something like this for your business?</p>
              <a href="#contact" className="btn btn--dark" onClick={(e) => { e.preventDefault(); onClose(); setTimeout(() => scrollToTarget('#contact'), 700) }}>
                <span className="btn__label" data-text="Start a project">Start a project</span><span className="btn__icon" aria-hidden="true">→</span>
              </a>
            </m.div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
