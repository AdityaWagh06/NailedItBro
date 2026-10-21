// Small, service-specific illustrations. They animate with CSS when their
// parent carries .is-active, so they cost nothing while idle.

export function ServiceIcon({ id }) {
  const common = { viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, 'aria-hidden': true, className: `s-icon s-icon--${id}` }
  switch (id) {
    case 'brand':
      return <svg {...common}><circle cx="24" cy="24" r="16" className="draw" /><path d="M18 32V16M18 22c0-4 3-7 6-7s6 3 6 7v10" className="draw" /></svg>
    case 'web':
      return <svg {...common}><rect x="6" y="10" width="36" height="28" rx="3" className="draw" /><path d="M6 17h36M11 13.5h.01M15 13.5h.01" /><path d="M12 24h14M12 30h9" className="draw" /></svg>
    case 'apps':
      return <svg {...common}><rect x="14" y="5" width="20" height="38" rx="5" className="draw" /><path d="M21 9h6" /><rect x="18" y="16" width="12" height="8" rx="2" className="pop" /></svg>
    case 'product':
      return <svg {...common}><circle cx="11" cy="14" r="5" className="draw" /><circle cx="37" cy="14" r="5" className="draw" /><circle cx="24" cy="36" r="5" className="draw" /><path d="M15 17l6 14M33 17l-6 14M16 14h16" className="draw" /></svg>
    case 'commerce':
      return <svg {...common}><path d="M8 12h5l4 20h20l4-14H15" className="draw" /><circle cx="19" cy="38" r="2.5" /><circle cx="34" cy="38" r="2.5" /><circle cx="38" cy="9" r="4" className="pop" fill="currentColor" stroke="none" /></svg>
    default:
      return <svg {...common}><path d="M6 40h36" /><path d="M8 34l9-9 7 5 15-16" className="draw" /><path d="M32 14h7v7" className="draw" /></svg>
  }
}

export function ServicePreview({ id }) {
  switch (id) {
    case 'brand':
      return (
        <div className="sp sp--brand">
          <div className="sp-brand__grid">{Array.from({ length: 16 }, (_, i) => <i key={i} />)}</div>
          <svg viewBox="0 0 200 200" className="sp-brand__mark"><circle cx="100" cy="100" r="70" /><path d="M76 138V62M76 92c0-18 11-30 25-30s25 12 25 30v46" /></svg>
          <div className="sp-brand__chips"><span style={{ background: '#141312' }} /><span style={{ background: '#C9A27E' }} /><span style={{ background: '#F2EDE4' }} /></div>
        </div>
      )
    case 'web':
      return (
        <div className="sp sp--web">
          <div className="sp-web__bar"><i /><i /><i /></div>
          <div className="sp-web__hero"><b /><b /><span /></div>
          <div className="sp-web__cols"><i /><i /><i /></div>
        </div>
      )
    case 'apps':
      return (
        <div className="sp sp--apps">
          {[0, 1, 2].map((i) => (
            <div className="sp-apps__phone" key={i} style={{ '--i': i }}><i /><b /><b /><span /></div>
          ))}
        </div>
      )
    case 'product':
      return (
        <div className="sp sp--product">
          <svg viewBox="0 0 300 200" className="sp-product__links"><path d="M60 50 C 120 50, 120 100, 150 100 S 200 150, 240 150" /><path d="M60 150 C 110 150, 120 100, 150 100 S 210 50, 240 50" /></svg>
          {[['8%', '18%', 'Research'], ['8%', '68%', 'Flows'], ['40%', '43%', 'Prototype'], ['72%', '18%', 'Test'], ['72%', '68%', 'System']].map(([x, y, t], i) => (
            <span key={t} className="sp-product__node" style={{ left: x, top: y, '--i': i }}>{t}</span>
          ))}
        </div>
      )
    case 'commerce':
      return (
        <div className="sp sp--commerce">
          <div className="sp-com__card"><div className="sp-com__img" /><b /><i /><span>Add to bag</span></div>
          <div className="sp-com__bag">Bag <em>1</em></div>
        </div>
      )
    default:
      return (
        <div className="sp sp--growth">
          <svg viewBox="0 0 300 180" className="sp-growth__chart">
            <path d="M0 150 H300 M0 100 H300 M0 50 H300" className="grid" />
            <path d="M0 150 C 40 145, 60 130, 90 128 S 140 110, 170 90 S 230 60, 300 20" className="line" />
            <path d="M0 150 C 40 145, 60 130, 90 128 S 140 110, 170 90 S 230 60, 300 20 V180 H0Z" className="area" />
          </svg>
          <div className="sp-growth__kpis"><span><b>LCP</b> 1.2s</span><span><b>CLS</b> 0.01</span><span><b>SEO</b> 100</span></div>
        </div>
      )
  }
}
