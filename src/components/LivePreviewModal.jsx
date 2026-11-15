import { useState, useEffect } from 'react'
import { scrollToTarget } from '../lib/useSmoothScroll'

export default function LivePreviewModal({ project, onClose }) {
  const [device, setDevice] = useState('desktop') // 'desktop' | 'mobile'

  useEffect(() => {
    if (!project) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div className="live-modal" role="dialog" aria-modal="true" aria-labelledby="live-modal-title">
      <div className="live-modal__scrim" onClick={onClose} />

      <div className="live-modal__window">
        {/* Top Browser Bar */}
        <div className="live-modal__bar">
          <div className="live-modal__controls">
            <span className="live-modal__dot dot-red" onClick={onClose} title="Close" />
            <span className="live-modal__dot dot-yellow" />
            <span className="live-modal__dot dot-green" />
          </div>

          <div className="live-modal__url-pill">
            <span className="live-modal__lock">🔒</span>
            <span className="live-modal__url">{project.liveUrl || `https://${project.slug}.concept`}</span>
            <span className="live-modal__status-tag">🟢 Live Concept</span>
          </div>

          <div className="live-modal__actions">
            <div className="live-modal__device-toggle">
              <button
                type="button"
                className={`live-modal__dev-btn ${device === 'desktop' ? 'active' : ''}`}
                onClick={() => setDevice('desktop')}
                title="Desktop View"
              >
                🖥️ Desktop
              </button>
              <button
                type="button"
                className={`live-modal__dev-btn ${device === 'mobile' ? 'active' : ''}`}
                onClick={() => setDevice('mobile')}
                title="Mobile View"
              >
                📱 Mobile
              </button>
            </div>
            <button type="button" className="live-modal__close-btn" onClick={onClose} aria-label="Close Preview">
              ✕
            </button>
          </div>
        </div>

        {/* Live Content Stage */}
        <div className={`live-modal__viewport ${device === 'mobile' ? 'is-mobile' : ''}`}>
          {project.slug === 'chiffon' ? (
            <CakeLiveExperience onContact={() => { onClose(); scrollToTarget('#contact') }} />
          ) : (
            <GenericLiveExperience project={project} onContact={() => { onClose(); scrollToTarget('#contact') }} />
          )}
        </div>

        {/* Bottom Agency Bar */}
        <div className="live-modal__footer">
          <div className="live-modal__footer-left">
            <b>{project.name}</b>
            <span>{project.metric}</span>
          </div>
          <button
            type="button"
            className="live-modal__contact-btn"
            onClick={() => {
              onClose()
              setTimeout(() => scrollToTarget('#contact'), 200)
            }}
          >
            Build a flagship like this ↗
          </button>
        </div>
      </div>
    </div>
  )
}

function CakeLiveExperience({ onContact }) {
  const [tier, setTier] = useState('2-tier')
  const [flavor, setFlavor] = useState('vanilla')
  const [serving, setServing] = useState('12')

  const flavors = [
    { id: 'vanilla', name: 'Tahitian Vanilla Bean & Raspberries', price: 95, color: '#E5A663' },
    { id: 'truffle', name: 'Valrhona 70% Dark Truffle Ganache', price: 110, color: '#3A2720' },
    { id: 'pistachio', name: 'Sicilian Pistachio & Praliné Chiffon', price: 105, color: '#7E8B58' },
    { id: 'passion', name: 'Passionfruit Mango Velvet Curd', price: 100, color: '#D97736' },
  ]

  const activeFlavor = flavors.find((f) => f.id === flavor) || flavors[0]

  return (
    <div className="cake-live">
      {/* Brand Navigation */}
      <header className="cake-live__nav">
        <div className="cake-live__brand">
          <span className="cake-live__monogram">MC</span>
          <div>
            <b>MAISON CHIFFON</b>
            <small>Paris · Bespoke Patisserie</small>
          </div>
        </div>
        <div className="cake-live__nav-links">
          <span className="is-active">Bespoke Atelier</span>
          <span>Signature Gateaux</span>
          <span>Tasting Boxes</span>
          <span>Our Story</span>
        </div>
        <div className="cake-live__cart-btn">
          <span>Bag (1) · ${activeFlavor.price}</span>
        </div>
      </header>

      {/* Main Interactive Customizer Hero */}
      <main className="cake-live__hero">
        <div className="cake-live__left">
          <div className="cake-live__eyebrow">
            <span>✨ Pure Artisan Confectionery</span>
            <span>Award Winning Patisserie 2026</span>
          </div>

          <h1 className="cake-live__title">
            Couture cakes, handcrafted for <em className="serif">unforgettable moments.</em>
          </h1>

          <p className="cake-live__lead">
            Every creation is baked fresh to order using single-origin Madagascar vanilla, stone-ground unbleached flours, and sensory culinary botanicals.
          </p>

          {/* Customizer Selector Controls */}
          <div className="cake-live__options">
            <div className="cake-live__group">
              <label>1. Select Size &amp; Servings</label>
              <div className="cake-live__pills">
                {['6" (8 Servings)', '8" (14 Servings)', '2-Tier (24 Servings)', '3-Tier (40 Servings)'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`cake-live__pill ${serving === s ? 'active' : ''}`}
                    onClick={() => setServing(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="cake-live__group">
              <label>2. Choose Signature Flavor Profile</label>
              <div className="cake-live__flavor-cards">
                {flavors.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`cake-live__flavor-card ${flavor === f.id ? 'active' : ''}`}
                    onClick={() => setFlavor(f.id)}
                  >
                    <span className="cake-live__color-dot" style={{ background: f.color }} />
                    <div className="cake-live__flavor-text">
                      <b>{f.name}</b>
                      <span>${f.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="cake-live__cta-row">
            <button type="button" className="cake-live__order-btn" onClick={onContact}>
              <span>Reserve Celebration Date &amp; Preorder</span>
              <span className="arrow">↗</span>
            </button>
            <div className="cake-live__trust">
              <span>🔒 100% Guaranteed Fresh Hand-Delivery</span>
              <span>⭐ 4.98 / 5.0 from 340+ Parisian reviews</span>
            </div>
          </div>
        </div>

        {/* 3D Visual Cake Showcase */}
        <div className="cake-live__right">
          <div className="cake-live__stage-card">
            <div className="cake-live__badge">Interactive 3D Preview</div>
            <div className="cake-live__visual-wrap">
              <div className="cake-live__visual-glow" style={{ background: `radial-gradient(circle, ${activeFlavor.color}66 0%, transparent 70%)` }} />
              <div className="cake-live__cake-model">
                <div className="cake-tier tier-3" style={{ borderColor: activeFlavor.color }} />
                <div className="cake-tier tier-2" style={{ borderColor: activeFlavor.color }} />
                <div className="cake-tier tier-1" style={{ borderColor: activeFlavor.color }} />
                <div className="cake-topper">🌸 24k Gold</div>
              </div>
            </div>

            <div className="cake-live__spec-card">
              <b>{activeFlavor.name}</b>
              <p>Hand-piped buttercream, organic berry reduction, edible gold foil accents.</p>
              <div className="cake-live__specs">
                <span>Dietary: Nut-free available</span>
                <span>Lead time: 48h advance</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function GenericLiveExperience({ project, onContact }) {
  return (
    <div className="generic-live" style={{ background: project.palette.bg, color: project.palette.ink }}>
      <header className="generic-live__nav">
        <b>{project.name}</b>
        <span>{project.sub || project.kind}</span>
      </header>

      <main className="generic-live__main">
        <span className="generic-live__badge" style={{ color: project.palette.accent, borderColor: project.palette.accent }}>
          {project.metric}
        </span>
        <h1 className="generic-live__title">{project.name}</h1>
        <p className="generic-live__blurb">{project.blurb}</p>

        <div className="generic-live__grid">
          {project.approach.map((item, idx) => (
            <div key={idx} className="generic-live__card" style={{ background: project.palette.soft }}>
              <b>Feature 0{idx + 1}</b>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <button type="button" className="generic-live__btn" style={{ background: project.palette.accent }} onClick={onContact}>
          Start a project like this ↗
        </button>
      </main>
    </div>
  )
}

