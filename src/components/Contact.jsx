import { useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { EMAIL, SERVICES } from '../data'
import { gsap, useGSAP, revealHeading, MOTION_EASE, useReducedMotion } from '../lib/motion'


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
  const [copiedBrief, setCopiedBrief] = useState(false)
  const [sentUrls, setSentUrls] = useState({ mailto: '', gmail: '', outlook: '', copyText: '', subject: '' })

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

  const onSubmit = (e) => {
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

    const clientName = data.name.trim()
    const clientEmail = data.email.trim()
    const company = data.company?.trim()
    const hasCompany = company && company.toLowerCase() !== 'n/a'
    const servicesList = picked.length > 0 ? picked.join(', ') : 'General Discussion'
    const message = data.message.trim()

    // Fixed subject with client name: Enquiry — [Person Name]
    const subject = `Enquiry — ${clientName}`

    // Clean, executive, beautifully structured email body
    const bodyLines = [
      `Hi Team Nailed It Bro,`,
      ``,
      `I would love to discuss a new project with you. Here are the details and project brief:`,
      ``,
      `Project Brief:`,
      `${message}`,
      ``,
      `Scope & Requirements:`,
      `• Services Needed: ${servicesList}`,
      ...(hasCompany ? [`• Company: ${company}`] : []),
      ``,
      `Client Details:`,
      `• Name: ${clientName}`,
      `• Email: ${clientEmail}`,
      ``,
      `Looking forward to hearing from you with rough timelines and next steps!`,
      ``,
      `Best regards,`,
      `${clientName}`,
    ]

    const fullBody = bodyLines.join('\n')
    const mailtoUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(EMAIL)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`

    setSentUrls({
      mailto: mailtoUrl,
      gmail: gmailUrl,
      outlook: outlookUrl,
      subject,
      clientName,
      clientEmail,
      services: servicesList,
      company: hasCompany ? company : null,
      message,
      copyText: `To: ${EMAIL}\nSubject: ${subject}\n\n${fullBody}`,
    })
    setStatus('sent')

    // Open compose email in a new tab
    const newTab = window.open(gmailUrl, '_blank')
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      window.open(mailtoUrl, '_blank')
    }
  }

  const handleCopySentBrief = () => {
    if (sentUrls.copyText) {
      navigator.clipboard?.writeText(sentUrls.copyText)
      setCopiedBrief(true)
      setTimeout(() => setCopiedBrief(false), 2500)
    }
  }

  return (
    <section className="contact section" id="contact" ref={root} data-theme="dark" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__head">
          <div className="contact__head-content">
            <p className="eyebrow">(Contact)</p>
            <h2 className="contact__title display" id="contact-title">
              <span>Let's get it</span>
              <em className="serif">nailed.</em>
            </h2>
            <p className="contact__lead">Tell us what you are building. We reply within one working day with next steps, a rough timeline and honest advice.</p>
          </div>
          <a
            className="contact__email u-link"
            href={`mailto:${EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {EMAIL}
          </a>
        </div>

          <div className="contact__card">
            <AnimatePresence mode="wait" initial={false}>
              {status === 'sent' ? (
                <m.div
                  key="ok"
                  className="contact__done"
                  role="status"
                  initial={reduced ? false : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: MOTION_EASE }}
                >
                  <svg viewBox="0 0 52 52" className="contact__check" aria-hidden="true">
                    <circle cx="26" cy="26" r="24" />
                    <path d="M15 27l7 7 15-16" />
                  </svg>
                  <h3>Your Enquiry is Ready!</h3>
                  <p>
                    We’ve prepared your enquiry with <strong>{sentUrls.subject}</strong>. Choose where to send it:
                  </p>

                  <div className="contact__brief-preview">
                    <div className="contact__brief-preview-head">
                      <span className="contact__brief-title">{sentUrls.subject}</span>
                      <span className="contact__brief-badge">Ready to send</span>
                    </div>
                    <div className="contact__brief-meta">
                      <span><strong>Services:</strong> {sentUrls.services}</span>
                      {sentUrls.company && <span><strong>Company:</strong> {sentUrls.company}</span>}
                      <span><strong>From:</strong> {sentUrls.clientName} ({sentUrls.clientEmail})</span>
                    </div>
                    <div className="contact__brief-msg">
                      "{sentUrls.message}"
                    </div>
                  </div>

                  <div className="contact-sent-actions">
                    <a
                      href={sentUrls.gmail}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sent-action-pill sent-action-pill--gmail"
                    >
                      <span>Open in Gmail (Web) ↗</span>
                    </a>

                    <a
                      href={sentUrls.outlook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sent-action-pill sent-action-pill--outlook"
                    >
                      <span>Open in Outlook ↗</span>
                    </a>

                    <a
                      href={sentUrls.mailto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sent-action-pill sent-action-pill--default"
                    >
                      <span>Default Mail App ✉</span>
                    </a>

                    <button
                      type="button"
                      className="sent-action-pill sent-action-pill--copy"
                      onClick={handleCopySentBrief}
                    >
                      <span>{copiedBrief ? '✓ Copied Details!' : 'Copy Full Brief 📋'}</span>
                    </button>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <button
                      type="button"
                      className="u-link"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9D99A8', fontSize: '13px' }}
                      onClick={() => {
                        setStatus('idle')
                        setErrors({})
                      }}
                    >
                      ← Edit details / Send another
                    </button>
                  </div>
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
                  <Field id="message" label="Tell us about the project" as="textarea" rows={5} error={errors.message} />
                  <div className="contact__submit">
                    <button type="submit" className="btn btn--light btn--sm contact__btn">
                      <span className="btn__label" data-text="Send enquiry">Send enquiry</span>
                      <span className="btn__icon" aria-hidden="true">→</span>
                    </button>
                    <p className="contact__fine" aria-live="polite">
                      Pre-fills your enquiry directly into Gmail, Outlook or your default mail app.
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
