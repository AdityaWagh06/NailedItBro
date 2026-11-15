import { useState, useEffect } from 'react'

export default function LegalModal({ isOpen, onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="legal-modal-backdrop" onClick={onClose}>
      <div
        className="legal-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Legal & Information"
      >
        <div className="legal-modal__header">
          <div>
            <span className="legal-modal__eyebrow">COMPLIANCE & STANDARDS</span>
            <h3 className="legal-modal__title">Legal & Privacy Policy</h3>
          </div>
          <button
            type="button"
            className="legal-modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="legal-modal__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'privacy'}
            className={`legal-modal__tab ${activeTab === 'privacy' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'terms'}
            className={`legal-modal__tab ${activeTab === 'terms' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            Terms & Conditions
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'cookies'}
            className={`legal-modal__tab ${activeTab === 'cookies' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('cookies')}
          >
            Cookie Policy
          </button>
        </div>

        {/* Tab Content */}
        <div className="legal-modal__body">
          {activeTab === 'privacy' && (
            <div className="legal-modal__pane">
              <h4>Privacy Policy</h4>
              <p className="legal-modal__date">Effective Date: January 1, 2026</p>
              <p>
                At <strong>Nailed It Bro Studio</strong> (&quot;Nailed It Bro&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;), we uphold strict standards of client confidentiality, privacy, and data security. This Privacy Policy details our practices concerning information collection, usage, and protection in compliance with GDPR, CCPA, and global data privacy regulations.
              </p>
              <h5>1. Information We Collect</h5>
              <p>
                We only collect information voluntarily submitted through our enquiry forms, email channels, or communication portals (such as your name, corporate email address, and project brief requirements). We never harvest unapproved telemetry, selling or trading personal contact details is strictly prohibited.
              </p>
              <h5>2. Purpose of Processing</h5>
              <p>
                Your contact details are used exclusively to evaluate project specifications, deliver technical proposals, establish service agreements, and facilitate real-time collaboration.
              </p>
              <h5>3. Data Protection & Encryption</h5>
              <p>
                All data transmission is secured using TLS 1.3 encryption. Internal credentials, project artifacts, and code repositories are managed under principle-of-least-privilege access controls.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="legal-modal__pane">
              <h4>Terms & Conditions</h4>
              <p className="legal-modal__date">Effective Date: January 1, 2026</p>
              <p>
                By accessing or collaborating with <strong>Nailed It Bro Studio</strong>, you agree to these Terms & Conditions governing our bespoke engineering, design systems, autonomous intelligence agents, and digital studio services.
              </p>
              <h5>1. Scope of Work & Deliverables</h5>
              <p>
                Every project is executed according to mutually ratified Statements of Work (SOW) defining sprint milestones, deliverables, tech stacks, and acceptance criteria.
              </p>
              <h5>2. Intellectual Property Rights</h5>
              <p>
                Upon receipt of full contracted payment, all custom source code, brand assets, UI designs, and deliverables created specifically for the client transfer 100% to the client.
              </p>
              <h5>3. Warranties & Quality Assurance</h5>
              <p>
                We engineer all digital experiences to high-performance benchmarks (sub-100ms interaction latency, 60fps smooth animations, and modern cross-browser compatibility).
              </p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="legal-modal__pane">
              <h4>Cookie & Storage Policy</h4>
              <p className="legal-modal__date">Effective Date: January 1, 2026</p>
              <p>
                Our digital platforms prioritize user autonomy. We utilize minimal local storage and essential session cookies strictly required for theme persistence, motion accessibility preferences (reduced motion), and smooth navigation states.
              </p>
              <h5>Essential Storage Types</h5>
              <ul>
                <li><strong>Session State:</strong> Maintains smooth navigation context during multi-page browsing.</li>
                <li><strong>Accessibility Preferences:</strong> Stores <code>prefers-reduced-motion</code> overrides.</li>
                <li><strong>Zero Invasive Ad-Trackers:</strong> We do not deploy invasive third-party tracking or behavioral advertising pixels.</li>
              </ul>
            </div>
          )}
        </div>

        <div className="legal-modal__footer">
          <p>© 2026 Nailed It Bro. All Rights Reserved.</p>
          <button type="button" className="legal-modal__done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

