// Product mockups drawn in HTML/CSS so they stay crisp, light and themeable.

export function Browser({ children, url = 'naileditbro.com', className = '', style }) {
  return (
    <div className={`mk-browser ${className}`} style={style} aria-hidden="true">
      <div className="mk-browser__bar">
        <span /><span /><span />
        <div className="mk-browser__url">{url}</div>
      </div>
      <div className="mk-browser__screen">{children}</div>
    </div>
  )
}

export function Phone({ children, className = '', style }) {
  return (
    <div className={`mk-phone ${className}`} style={style} aria-hidden="true">
      <div className="mk-phone__notch" />
      <div className="mk-phone__screen">{children}</div>
    </div>
  )
}

const lines = (n, w = []) =>
  Array.from({ length: n }, (_, i) => <i key={i} className="mk-line" style={{ width: w[i] || '100%' }} />)

/* ----- Hero screens (studio brand palette) ----- */

export function HeroSite() {
  return (
    <div className="scr scr--hero">
      <div className="scr__nav"><b>atelier</b><span>{lines(3, ['18%', '18%', '18%'])}</span></div>
      <div className="scr--hero__grid">
        <div>
          <div className="scr__display">Quiet<br /><em>spaces,</em><br />loud ideas.</div>
          <div className="scr__copy">{lines(3, ['90%', '75%', '60%'])}</div>
          <div className="scr__btn">View projects</div>
        </div>
        <div className="scr--hero__img"><div className="scr__arch" /></div>
      </div>
    </div>
  )
}

export function HeroApp() {
  return (
    <div className="scr scr--app">
      <div className="scr__app-top"><span>Good morning</span><b>Your day</b></div>
      <div className="scr__ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" className="track" /><circle cx="50" cy="50" r="40" className="fill" /></svg><b>72%</b></div>
      <div className="scr__rows">
        {['Design review', 'Sprint planning', 'Launch'].map((t, i) => (
          <div className="scr__row" key={t}><i style={{ '--i': i }} /><span>{t}</span><em>{['09:30', '11:00', '16:00'][i]}</em></div>
        ))}
      </div>
    </div>
  )
}

export function StatCard() {
  return (
    <div className="mk-card mk-card--stat" aria-hidden="true">
      <span className="mk-card__label">Core Web Vitals</span>
      <div className="mk-card__bars">{[38, 54, 46, 70, 62, 88, 96].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
      <b>98 <small>/100</small></b>
    </div>
  )
}

export function SwatchCard() {
  return (
    <div className="mk-card mk-card--swatch" aria-hidden="true">
      <span className="mk-card__label">Identity system</span>
      <div className="mk-card__swatches"><i style={{ background: '#141312' }} /><i style={{ background: '#D9CBB4' }} /><i style={{ background: '#B8875A' }} /><i style={{ background: '#F2EDE4' }} /></div>
      <div className="mk-card__type"><span className="serif">Aa</span><span>Aa</span></div>
    </div>
  )
}

/* ----- Project screens (per-project palette via CSS vars) ----- */

export function ProjectScreen({ layout }) {
  if (layout === 'shop')
    return (
      <div className="scr scr--p scr--shop">
        <div className="scr__nav"><b>HALDEN</b><span>{lines(3, ['16%', '16%', '16%'])}</span></div>
        <div className="scr--shop__hero">
          <div className="scr__display">Roasted<br /><em>slowly.</em></div>
          <div className="scr--shop__bag"><span>HALDEN</span><small>Ethiopia · Guji</small></div>
        </div>
        <div className="scr--shop__grid">{[0, 1, 2].map((i) => <div key={i}><i />{lines(2, ['70%', '40%'])}</div>)}</div>
      </div>
    )
  if (layout === 'app')
    return (
      <div className="scr scr--p scr--orbit">
        <div className="scr__app-top"><span>Thursday</span><b>Today's orbit</b></div>
        <div className="scr__ring scr__ring--lg"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" className="track" /><circle cx="50" cy="50" r="40" className="fill" /></svg><b>£42<small>left today</small></b></div>
        <div className="scr__chips"><span>Food</span><span>Travel</span><span>Home</span></div>
      </div>
    )
  if (layout === 'editorial')
    return (
      <div className="scr scr--p scr--nord">
        <div className="scr__nav"><b>Atelier Nord</b><span>{lines(2, ['20%', '20%'])}</span></div>
        <div className="scr--nord__grid">
          <div className="scr--nord__img a" /><div className="scr--nord__img b" />
          <div className="scr--nord__title">House by<br /><em>the fjord</em></div>
          <div className="scr--nord__img c" />
        </div>
      </div>
    )
  return (
    <div className="scr scr--p scr--pulse">
      <div className="scr--pulse__side">{lines(5, ['70%', '55%', '65%', '50%', '60%'])}</div>
      <div className="scr--pulse__main">
        <div className="scr--pulse__head"><b>This week</b><span className="scr__btn">+ Class</span></div>
        <div className="scr--pulse__cal">
          {Array.from({ length: 15 }, (_, i) => <div key={i} className={[1, 5, 7, 11, 13].includes(i) ? 'on' : ''}>{[1, 5, 7, 11, 13].includes(i) && <><b /><i /></>}</div>)}
        </div>
      </div>
    </div>
  )
}

export function ProjectPhone({ layout }) {
  return (
    <div className={`scr scr--p scr--mini scr--mini-${layout}`}>
      <div className="scr--mini__img" />
      {lines(3, ['80%', '60%', '40%'])}
      <div className="scr__btn">{layout === 'shop' ? 'Subscribe' : layout === 'app' ? 'Add goal' : layout === 'dashboard' ? 'Book' : 'Explore'}</div>
    </div>
  )
}
