import { useState } from 'react'
import { EMAIL } from '../data'

export default function EmailModal({
  isOpen,
  onClose,
  recipient = EMAIL,
  subject = 'Enquiry — Nailed It Bro',
  body = 'Hello Nailed It Bro Studio,\n\nI would like to discuss a project with you.',
}) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const encodedTo = encodeURIComponent(recipient)
  const encodedSub = encodeURIComponent(subject)
  const encodedBody = encodeURIComponent(body)

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSub}&body=${encodedBody}`
  const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedTo}&subject=${encodedSub}&body=${encodedBody}`
  const yahooUrl = `https://compose.mail.yahoo.com/?to=${encodedTo}&subj=${encodedSub}&body=${encodedBody}`
  const mailtoUrl = `mailto:${recipient}?subject=${encodedSub}&body=${encodedBody}`

  const handleCopy = () => {
    navigator.clipboard?.writeText(recipient)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="email-modal-backdrop" onClick={onClose}>
      <div className="email-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="email-modal__header">
          <div>
            <span className="email-modal__eyebrow">DIRECT REACH</span>
            <h3 className="email-modal__title">Compose Email</h3>
          </div>
          <button type="button" className="email-modal__close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <p className="email-modal__desc">
          Choose your preferred email service to send a message to <strong>{recipient}</strong>:
        </p>

        <div className="email-modal__options">
          {/* 1. Gmail Web */}
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="email-option-card email-option-card--gmail"
            onClick={onClose}
          >
            <div className="email-option-card__icon email-option-card__icon--gmail">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.268H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
              </svg>
            </div>
            <div className="email-option-card__info">
              <h4>Open in Gmail (Web)</h4>
              <span>Recommended for browser users · Opens compose in new tab</span>
            </div>
            <span className="email-option-card__arrow">↗</span>
          </a>

          {/* 2. Default Desktop App */}
          <a
            href={mailtoUrl}
            className="email-option-card"
            onClick={() => {
              window.location.href = mailtoUrl
              onClose()
            }}
          >
            <div className="email-option-card__icon email-option-card__icon--default">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="email-option-card__info">
              <h4>Default Mail App</h4>
              <span>Windows Mail, Outlook, Apple Mail or Thunderbird</span>
            </div>
            <span className="email-option-card__arrow">→</span>
          </a>

          {/* 3. Outlook / Hotmail Web */}
          <a
            href={outlookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="email-option-card"
            onClick={onClose}
          >
            <div className="email-option-card__icon email-option-card__icon--outlook">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.5 4h-21C.67 4 0 4.67 0 5.5v13c0 .83.67 1.5 1.5 1.5h21c.83 0 1.5-.67 1.5-1.5v-13c0-.83-.67-1.5-1.5-1.5zm-.5 3.75l-9.5 6-9.5-6V6l9.5 6 9.5-6v1.75z" />
              </svg>
            </div>
            <div className="email-option-card__info">
              <h4>Outlook.com / Office 365</h4>
              <span>Opens web compose on Outlook.live.com</span>
            </div>
            <span className="email-option-card__arrow">↗</span>
          </a>

          {/* 4. Copy Email */}
          <button type="button" className="email-option-card email-option-card--copy" onClick={handleCopy}>
            <div className="email-option-card__icon email-option-card__icon--copy">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </div>
            <div className="email-option-card__info">
              <h4>{copied ? '✓ Copied to Clipboard!' : 'Copy Email Address'}</h4>
              <span>{recipient}</span>
            </div>
            <span className="email-option-card__arrow">{copied ? '✓' : '📋'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
