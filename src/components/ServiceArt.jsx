// Service-specific minimalist wireframe animations
// Styled according to the dark obsidian and vibrant accent color scheme.

export function ServiceIcon({ id }) {
  const common = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    'aria-hidden': true,
    className: `s-icon s-icon--${id}`,
  }

  switch (id) {
    case 'uiux':
      return (
        <svg {...common}>
          <circle cx="14" cy="14" r="5" className="draw" />
          <circle cx="34" cy="14" r="5" className="draw" />
          <circle cx="24" cy="34" r="5" className="draw" />
          <path d="M18 16l8 14M30 16l-8 14M19 14h10" className="draw" />
        </svg>
      )
    case 'web':
      return (
        <svg {...common}>
          <rect x="6" y="10" width="36" height="28" rx="3" className="draw" />
          <path d="M6 17h36M11 13.5h.01M15 13.5h.01" />
          <path d="M12 24h14M12 30h9" className="draw" />
        </svg>
      )
    case 'apps':
      return (
        <svg {...common}>
          <rect x="14" y="6" width="20" height="36" rx="5" className="draw" />
          <path d="M21 10h6" />
          <rect x="18" y="17" width="12" height="8" rx="2" className="pop" />
          <circle cx="24" cy="37" r="1.5" />
        </svg>
      )
    case 'game':
      return (
        <svg {...common}>
          <rect x="8" y="14" width="32" height="20" rx="6" className="draw" />
          <path d="M15 24h6M18 21v6" className="draw" />
          <circle cx="29" cy="22" r="1.5" fill="currentColor" />
          <circle cx="33" cy="26" r="1.5" fill="currentColor" />
        </svg>
      )
    case 'qr':
      return (
        <svg {...common}>
          <rect x="8" y="8" width="12" height="12" rx="2" className="draw" />
          <rect x="28" y="8" width="12" height="12" rx="2" className="draw" />
          <rect x="8" y="28" width="12" height="12" rx="2" className="draw" />
          <path d="M28 28h5v5h-5zM35 35h5v5h-5zM28 37h4M37 28v5" className="draw" />
        </svg>
      )
    case 'ai':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="7" className="draw" />
          <path d="M24 8v5M24 35v5M8 24h5M35 24h5M13 13l4 4M31 31l4 4M31 13l-4 4M13 31l4-4" className="draw" />
          <circle cx="24" cy="24" r="2.5" fill="currentColor" />
        </svg>
      )
    case 'social':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" className="draw" />
          <path d="M18 24c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" className="draw" />
          <path d="M30 18l4-4M30 30l4 4M18 30l-4 4" className="draw" />
        </svg>
      )
    case 'brand':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" className="draw" />
          <path d="M18 32V16M18 22c0-4 3-7 6-7s6 3 6 7v10" className="draw" />
        </svg>
      )
    case 'crm':
      return (
        <svg {...common}>
          <rect x="7" y="9" width="34" height="30" rx="3" className="draw" />
          <path d="M7 17h34M17 17v22M23 27h12M23 33h8" className="draw" />
          <circle cx="12" cy="13" r="1" fill="currentColor" />
        </svg>
      )
    case 'ads':
    default:
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" className="draw" />
          <circle cx="24" cy="24" r="9" className="draw" />
          <path d="M24 15v9l6 3" className="draw" />
        </svg>
      )
  }
}

export function ServicePreview({ id }) {
  switch (id) {
    case 'uiux':
      return (
        <div className="sp sp--product">
          <svg viewBox="0 0 300 200" className="sp-product__links">
            <path d="M60 50 C 120 50, 120 100, 150 100 S 200 150, 240 150" />
            <path d="M60 150 C 110 150, 120 100, 150 100 S 210 50, 240 50" />
          </svg>
          {[
            ['8%', '18%', 'User Research'],
            ['8%', '68%', 'Wireframe Flows'],
            ['38%', '43%', 'Figma System'],
            ['68%', '18%', 'Usability Testing'],
            ['68%', '68%', 'Micro-interactions'],
          ].map(([x, y, t], i) => (
            <span key={t} className="sp-product__node" style={{ left: x, top: y, '--i': i }}>
              {t}
            </span>
          ))}
        </div>
      )

    case 'web':
      return (
        <div className="sp sp--web">
          <div className="sp-web__bar">
            <i />
            <i />
            <i />
          </div>
          <div className="sp-web__hero">
            <b />
            <b />
            <span />
          </div>
          <div className="sp-web__cols">
            <i />
            <i />
            <i />
          </div>
        </div>
      )

    case 'apps':
      return (
        <div className="sp sp--apps">
          {[0, 1, 2].map((i) => (
            <div className="sp-apps__phone" key={i} style={{ '--i': i }}>
              <i />
              <b />
              <b />
              <span />
            </div>
          ))}
        </div>
      )

    case 'game':
      return (
        <div className="sp sp--game">
          <div className="sp-game__viewport">
            <div className="sp-game__grid" />
            <div className="sp-game__hud">
              <span className="sp-game__badge">STAGE 04</span>
              <span className="sp-game__score">99,450 PTS</span>
            </div>
            <div className="sp-game__avatar">
              <span className="sp-game__ring" />
              <span className="sp-game__core" />
            </div>
            <div className="sp-game__controls">
              <span className="sp-game__dpad">
                <i className="up" />
                <i className="left" />
                <i className="center" />
                <i className="right" />
                <i className="down" />
              </span>
              <span className="sp-game__actions">
                <i />
                <i />
              </span>
            </div>
          </div>
        </div>
      )

    case 'qr':
      return (
        <div className="sp sp--qr">
          <div className="sp-qr__card">
            <div className="sp-qr__matrix">
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner bl" />
              <div className="sp-qr__dots">
                {Array.from({ length: 25 }, (_, i) => (
                  <i key={i} />
                ))}
              </div>
              <div className="sp-qr__laser" />
            </div>
            <div className="sp-qr__popup">
              <span className="sp-qr__icon">✓</span>
              <div>
                <b>Table #14 Checked In</b>
                <small>WhatsApp Booking Confirmed</small>
              </div>
            </div>
          </div>
        </div>
      )

    case 'ai':
      return (
        <div className="sp sp--ai">
          <svg viewBox="0 0 300 180" className="sp-ai__circuit">
            <path d="M40 90 H100 M100 90 L150 40 H220 M100 90 L150 140 H220" />
          </svg>
          <div className="sp-ai__node node--start" style={{ left: '6%', top: '40%' }}>
            <span>Lead In</span>
          </div>
          <div className="sp-ai__brain" style={{ left: '42%', top: '35%' }}>
            <span className="sp-ai__pulse" />
            <b>AI Core</b>
          </div>
          <div className="sp-ai__node node--action1" style={{ left: '68%', top: '15%' }}>
            <span>WhatsApp Agent</span>
          </div>
          <div className="sp-ai__node node--action2" style={{ left: '68%', top: '65%' }}>
            <span>Auto Sync CRM</span>
          </div>
        </div>
      )

    case 'social':
      return (
        <div className="sp sp--social">
          <div className="sp-social__phone">
            <div className="sp-social__video">
              <span className="sp-social__tag">#viral 1.2M</span>
              <div className="sp-social__reactions">
                <span className="heart">♥</span>
                <span className="flame">🔥</span>
                <span className="share">↗</span>
              </div>
            </div>
            <div className="sp-social__meta">
              <b />
              <i />
            </div>
          </div>
        </div>
      )

    case 'brand':
      return (
        <div className="sp sp--brand">
          <div className="sp-brand__grid">
            {Array.from({ length: 16 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <svg viewBox="0 0 200 200" className="sp-brand__mark">
            <circle cx="100" cy="100" r="70" />
            <path d="M76 138V62M76 92c0-18 11-30 25-30s25 12 25 30v46" />
          </svg>
          <div className="sp-brand__chips">
            <span style={{ background: '#0A0A0D', border: '1px solid rgba(255,255,255,0.3)' }} />
            <span style={{ background: '#FF5E14', boxShadow: '0 0 16px rgba(255,94,20,0.5)' }} />
            <span style={{ background: '#FFFFFF' }} />
          </div>
        </div>
      )

    case 'crm':
      return (
        <div className="sp sp--crm">
          <div className="sp-crm__window">
            <div className="sp-crm__header">
              <span className="badge">LIVE METRICS</span>
              <b>$84,200 MRR</b>
            </div>
            <div className="sp-crm__bars">
              <span style={{ height: '35%' }} />
              <span style={{ height: '55%' }} />
              <span style={{ height: '42%' }} />
              <span style={{ height: '78%' }} />
              <span style={{ height: '62%' }} />
              <span style={{ height: '95%' }} />
            </div>
            <div className="sp-crm__pills">
              <span>+38% Closed</span>
              <span>120 Active Leads</span>
            </div>
          </div>
        </div>
      )

    case 'ads':
    default:
      return (
        <div className="sp sp--growth">
          <svg viewBox="0 0 300 180" className="sp-growth__chart">
            <path d="M0 150 H300 M0 100 H300 M0 50 H300" className="grid" />
            <path d="M0 150 C 40 145, 60 130, 90 128 S 140 110, 170 90 S 230 60, 300 20" className="line" />
            <path d="M0 150 C 40 145, 60 130, 90 128 S 140 110, 170 90 S 230 60, 300 20 V180 H0Z" className="area" />
          </svg>
          <div className="sp-growth__kpis">
            <span>
              <b>ROAS</b> 4.8x
            </span>
            <span>
              <b>CTR</b> 6.2%
            </span>
            <span>
              <b>CONV</b> +142%
            </span>
          </div>
        </div>
      )
  }
}
