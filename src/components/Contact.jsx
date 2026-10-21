import { useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { EMAIL, SERVICES } from '../data'
import { gsap, useGSAP, revealHeading, MOTION_EASE, useReducedMotion } from '../lib/motion'

// Set this to a form endpoint (Formspree, Netlify, your API) to post enquiries.
// Left empty, the form opens a pre-filled email instead.
const FORM_ENDPOINT = ''

const BUDGETS = ['< $5k', '$5–15k', '$15–40k', '$40k+']

function Field({ id, label, error, as = 'input', ...props }) {
  const Tag = as
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <Tag id={id} name={id} placeholder=" " aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...props} />
      <label htmlFor={id}>{label}</label>
      <span className="field__line" aria-hidden="true" />
      {error && <span className="field__err" id={`${id}-err`}>{error}</span>}
    </div>
  )
}

export default function Contact() {
  const root = useRef(null)
  const reduced = useReducedMotion()
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [picked, setPicked] = useState([])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const h = revealHeading('.contact__title')
        gsap.from('.contact__form > *', {
          y: 30, autoAlpha: 0, stagger: 0.06, duration: 0.9,
          scrollTrigger: { trigger: '.contact__form', start: 'top 85%', once: true },
        })
        return () => h.revert()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const toggle = (t) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))

  const onSubmit = async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const next = {}
    if (!data.name?.trim()) next.name = 'Please tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '')) next.email = 'Please enter a valid email address.'
    if ((data.message || '').trim().length < 10) next.message = 'A sentence or two about the project helps.'
    setErrors(next)
    if (Object.keys(next).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus()
      return
    }
    const payload = { ...data, services: picked.join(', ') }
    setStatus('sending')
    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        if (!res.ok) throw new Error('send failed')
      } else {
        const body = `Name: ${payload.name}\nCompany: ${payload.company || '-'}\nServices: ${payload.services || '-'}\nBudget: ${payload.budget || '-'}\n\n${payload.message}`
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('New project enquiry')}&body=${encodeURIComponent(body)}`
      }
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="contact section" id="contact" ref={root} data-theme="dark" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__head">
          <p className="eyebrow">(Contact)</p>
          <h2 className="contact__title display" id="contact-title">Let's get it <em className="serif">nailed.</em></h2>
          <p className="contact__lead">Tell us what you are building. We reply within one working day with next steps, a rough timeline and honest advice.</p>
          <a className="contact__email u-link" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>

        <div className="contact__card">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'sent' ? (
              <m.div key="ok" className="contact__done" role="status"
                initial={reduced ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: MOTION_EASE }}>
                <svg viewBox="0 0 52 52" className="contact__check" aria-hidden="true"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg>
                <h3>Thanks, message ready.</h3>
                <p>{FORM_ENDPOINT ? 'We have your enquiry and will be in touch within one working day.' : `Your email app should have opened with the details filled in. If it did not, write to ${EMAIL}.`}</p>
                <button className="u-link" onClick={() => setStatus('idle')}>Send another</button>
              </m.div>
            ) : (
              <m.form key="form" className="contact__form" onSubmit={onSubmit} noValidate
                exit={reduced ? undefined : { opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <div className="contact__row">
                  <Field id="name" label="Your name" autoComplete="name" error={errors.name} />
                  <Field id="email" label="Email" type="email" autoComplete="email" error={errors.email} />
                </div>
                <Field id="company" label="Company (optional)" autoComplete="organization" />
                <fieldset className="chips">
                  <legend>What do you need?</legend>
                  {SERVICES.map((s) => (
                    <label key={s.id} className={`chip ${picked.includes(s.title) ? 'is-on' : ''}`}>
                      <input type="checkbox" checked={picked.includes(s.title)} onChange={() => toggle(s.title)} />
                      {s.title}
                    </label>
                  ))}
                </fieldset>
                <fieldset className="chips">
                  <legend>Budget</legend>
                  {BUDGETS.map((b) => (
                    <label key={b} className="chip chip--radio">
                      <input type="radio" name="budget" value={b} />
                      {b}
                    </label>
                  ))}
                </fieldset>
                <Field id="message" label="Tell us about the project" as="textarea" rows={4} error={errors.message} />
                <div className="contact__submit">
                  <button type="submit" className="btn btn--light" disabled={status === 'sending'}>
                    <span className="btn__label" data-text={status === 'sending' ? 'Sending…' : 'Send enquiry'}>{status === 'sending' ? 'Sending…' : 'Send enquiry'}</span>
                    <span className="btn__icon" aria-hidden="true">→</span>
                  </button>
                  <p className="contact__fine" aria-live="polite">
                    {status === 'error' ? `Something went wrong. Email us at ${EMAIL}.` : 'No spam, no sales scripts.'}
                  </p>
                </div>
              </m.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
