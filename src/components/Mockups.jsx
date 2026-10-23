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

/* ----- Hero screens (Diverse Real-World Client Work) ----- */

/* 1. Desktop: "Brew & Bloom" Artisan Cafe Website UI */
export function HeroSite() {
  return (
    <div className="scr scr--cafe">
      {/* Top Navigation Bar */}
      <div className="cafe__nav">
        <span className="cafe__logo">Brew &amp; Bloom</span>
        <div className="cafe__nav-links">
          <span>Coffee</span>
          <span>Artisan Bakery</span>
          <span>Our Story</span>
          <span>Gallery</span>
          <span>Reviews</span>
          <span>Contact</span>
        </div>
        <span className="cafe__nav-location">Soho · New York</span>
      </div>

      {/* Main Hero Split */}
      <div className="cafe__body">
        {/* Left: Editorial Cafe Hero Copy & CTA */}
        <div className="cafe__left">
          <div className="cafe__eyebrow">
            <span className="cafe__pill">✦ TIME OUT BEST CAFE 2025</span>
            <span className="cafe__hours">MON–SUN · 7AM – 8PM</span>
          </div>
          <h2 className="cafe__title">
            <em>Artisan brews &amp;</em>
            <em>botanical bakes</em>
            <span>in the heart of Soho</span>
          </h2>
          <p className="cafe__desc">
            Welcome to Brew &amp; Bloom — where slow-crafted specialty roasts meet seasonal botanical pastries and mindful hospitality.
          </p>
          <div className="cafe__action-row">
            <button className="cafe__btn-main" type="button">Reserve Table</button>
            <span className="cafe__btn-arrow">↗</span>
          </div>
          <div className="cafe__features">
            <div className="cafe__feat-item">
              <b>Single Origin</b>
              <small>Direct-trade roasts</small>
            </div>
            <div className="cafe__feat-item">
              <b>Slow Ferment</b>
              <small>Wild sourdough bakes</small>
            </div>
            <div className="cafe__feat-item">
              <b>Botanicals</b>
              <small>House blossom infusions</small>
            </div>
          </div>
        </div>

        {/* Right: Single Editorial Culinary Photograph */}
        <div className="cafe__img-wrap">
          <img
            src="/brew-bloom.jpg"
            alt="Brew & Bloom specialty artisan coffee and botanical pastries"
            className="cafe__img"
            loading="eager"
          />
        </div>
      </div>
    </div>
  )
}

/* 1b. Desktop: "Atelier" Architecture & Editorial Website UI */
export function AtelierSite() {
  return (
    <div className="scr scr--atelier">
      <div className="atelier__body">
        {/* Left Column: Brand, Headline, Copy lines, Button */}
        <div className="atelier__left">
          <span className="atelier__logo">atelier</span>
          <h2 className="atelier__title">
            Quiet<br />
            <em>spaces,</em><br />
            loud ideas.
          </h2>
          <div className="atelier__lines">
            <span style={{ width: '85%' }} />
            <span style={{ width: '70%' }} />
            <span style={{ width: '50%' }} />
          </div>
          <button type="button" className="atelier__btn">View projects</button>
        </div>

        {/* Right Column: Square card with arch like in the user's reference */}
        <div className="atelier__right">
          <div className="atelier__square">
            <div className="atelier__arch" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* 2. Mobile Game in a Mobile Phone Dummy on Solid Background */
export function MobileGameDummy({ img = '/mobile_game.jpeg' }) {
  return (
    <div className="game-dummy">
      <div className="game-phone">
        {/* Phone Chassis */}
        <div className="game-phone__body">
          {/* Side Island / Camera notch */}
          <div className="game-phone__island">
            <span className="game-phone__lens" />
          </div>

          {/* Screen containing the 3D racing game */}
          <div className="game-phone__screen">
            <img src={img} alt="Cyber Racer 3D Mobile Game" className="game-phone__img" loading="eager" />
          </div>

          {/* Speaker slit */}
          <div className="game-phone__speaker" />
        </div>
      </div>
    </div>
  )
}


/* 2. Mobile: Kinetic Athletic & Habit OS (.scr--kinetic) */
export function HeroApp() {
  return (
    <div className="scr scr--kinetic">
      {/* Top Energetic Header Card in Acid Lime */}
      <div className="kin__header">
        {/* Status Row */}
        <div className="kin__status">
          <span>9:41</span>
          <div className="kin__island" />
          <div className="kin__status-icons">
            <svg width="10" height="9" viewBox="0 0 16 12" fill="currentColor"><path d="M0 9h3v3H0V9zm5-3h3v6H5V6zm5-3h3v9h-3V3zm5-3h1v12h-1V0z"/></svg>
            <div className="kin__battery"><span /></div>
          </div>
        </div>

        {/* User Profile Bar */}
        <div className="kin__user-row">
          <div className="kin__profile">
            <div className="kin__avatar">
              <span className="kin__avatar-emoji">⚡</span>
            </div>
            <div className="kin__user-meta">
              <span className="kin__greeting">Good morning</span>
              <b className="kin__name">Maya Chen</b>
            </div>
          </div>
          <div className="kin__badge-btn">
            <span className="kin__fire">🔥</span>
            <span className="kin__streak-pip">PRO</span>
          </div>
        </div>

        {/* Hero Energy Score Metric */}
        <div className="kin__score">
          <span className="kin__score-lbl">Daily Energy Score</span>
          <b className="kin__score-val">
            92.4 <small>/100</small>
          </b>
        </div>

        {/* Floating Inset Dual-Metric Pill */}
        <div className="kin__dual-card">
          <div className="kin__dual-col">
            <span className="kin__dual-lbl">Active Burn</span>
            <b className="kin__dual-val">2,840 kcal</b>
          </div>
          <div className="kin__dual-divider" />
          <div className="kin__dual-col">
            <span className="kin__dual-lbl">Recovery State</span>
            <b className="kin__dual-val kin__dual-val--prime">96% Prime</b>
          </div>
        </div>
      </div>

      {/* 3 Neo-Brutalist Colored Metric Cards */}
      <div className="kin__cards-row">
        <div className="kin__stat-card kin__stat-card--lilac">
          <span className="kin__card-icon">👟</span>
          <b className="kin__card-val">18</b>
          <span className="kin__card-lbl">Weekly Runs</span>
        </div>

        <div className="kin__stat-card kin__stat-card--cyan">
          <span className="kin__card-icon">⚡</span>
          <b className="kin__card-val">45</b>
          <span className="kin__card-lbl">Day Streak</span>
        </div>

        <div className="kin__stat-card kin__stat-card--peach">
          <span className="kin__card-icon">💧</span>
          <b className="kin__card-val">3.2L</b>
          <span className="kin__card-lbl">Hydration</span>
        </div>
      </div>

      {/* Today's Training Sessions Activity Feed */}
      <div className="kin__feed">
        <div className="kin__feed-head">
          <b>Today's Sessions</b>
          <span>Activity Log</span>
        </div>

        <div className="kin__feed-item">
          <div className="kin__feed-badge kin__feed-badge--cyan">
            <span>🏃</span>
          </div>
          <div className="kin__feed-details">
            <b>Interval Sprint</b>
            <small>07:15 AM · 5.2 km</small>
          </div>
          <span className="kin__feed-tag">+520 kcal</span>
        </div>

        <div className="kin__feed-item">
          <div className="kin__feed-badge kin__feed-badge--lilac">
            <span>🏋️</span>
          </div>
          <div className="kin__feed-details">
            <b>Hypertrophy Flow</b>
            <small>Yesterday · 45m</small>
          </div>
          <span className="kin__feed-tag kin__feed-tag--prime">+380 kcal</span>
        </div>

        <div className="kin__feed-item">
          <div className="kin__feed-badge kin__feed-badge--peach">
            <span>🧘</span>
          </div>
          <div className="kin__feed-details">
            <b>Mobility &amp; Breath</b>
            <small>09:30 AM · 20 min</small>
          </div>
          <span className="kin__feed-tag kin__feed-tag--calm">+140 kcal</span>
        </div>

        {/* Weekly Goal Progress Bar */}
        <div className="kin__goal-box">
          <div className="kin__goal-head">
            <span>Weekly Target · 4/5 days</span>
            <b>80%</b>
          </div>
          <div className="kin__goal-track">
            <div className="kin__goal-bar" style={{ width: '80%' }} />
          </div>
        </div>
      </div>

      {/* Native Bottom Dock / Tab Bar */}
      <div className="kin__tabbar">
        <div className="kin__tab kin__tab--active">
          <span className="kin__tab-icon">⚡</span>
          <span>Today</span>
        </div>
        <div className="kin__tab">
          <span className="kin__tab-icon">🏃</span>
          <span>Train</span>
        </div>
        <div className="kin__tab">
          <span className="kin__tab-icon">📊</span>
          <span>Stats</span>
        </div>
        <div className="kin__tab">
          <span className="kin__tab-icon">👤</span>
          <span>Profile</span>
        </div>
      </div>
    </div>
  )
}

/* 3. Social Media Management Card: 3 Platforms Side by Side */
/* 3. Social Media Management Card: Modern Animated Visual Carousel */
export function StatCard() {
  return (
    <div className="mk-card mk-card--social-mgmt" aria-hidden="true">
      {/* Top Header: ONLY "Social Media Management" + 3 Beige Platform Icons */}
      <div className="smm__top-bar">
        <div className="smm__title-group">
          <span className="smm__live-pip">
            <span className="smm__live-pulse" />
          </span>
          <span className="smm__title-text">Social Media Management</span>
        </div>

        {/* 3 Platform Icons in Elegant Beige Pills (No Extra Text) */}
        <div className="smm__platform-pills">
          <div className="smm__platform-pill" title="LinkedIn">
            <img
              src="/linkedin.png"
              alt="LinkedIn"
              className="smm__pill-icon"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const fb = e.currentTarget.parentElement.querySelector('.smm__fallback')
                if (fb) fb.style.display = 'flex'
              }}
            />
            <span className="smm__fallback smm__fallback--li">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </span>
          </div>

          <div className="smm__platform-pill" title="Instagram">
            <img
              src="/instagram.png"
              alt="Instagram"
              className="smm__pill-icon"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const fb = e.currentTarget.parentElement.querySelector('.smm__fallback')
                if (fb) fb.style.display = 'flex'
              }}
            />
            <span className="smm__fallback smm__fallback--ig">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </span>
          </div>

          <div className="smm__platform-pill" title="Facebook">
            <img
              src="/facebook.png"
              alt="Facebook"
              className="smm__pill-icon"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const fb = e.currentTarget.parentElement.querySelector('.smm__fallback')
                if (fb) fb.style.display = 'flex'
              }}
            />
            <span className="smm__fallback smm__fallback--fb">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </span>
          </div>
        </div>
      </div>

      {/* Modern Visual Social Media Carousel in Motion */}
      <div className="smm__carousel-viewport">
        <div className="smm__carousel-track">
          {/* Card 1: Aesthetic Visual Reel */}
          <div className="smm__post-card smm__post-card--reel">
            <div className="smm__post-media">
              <img src="/brew-bloom.jpg" alt="" className="smm__post-bg" />
              <div className="smm__post-overlay" />
              <span className="smm__play-badge">▶</span>
              <div className="smm__post-meta-top">
                <span className="smm__reel-chip">REEL</span>
              </div>
              <div className="smm__post-meta-bottom">
                <span className="smm__like-chip">♥</span>
                <span className="smm__audio-wave">
                  <span /><span /><span /><span />
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Editorial Carousel Graphic */}
          <div className="smm__post-card smm__post-card--graphic">
            <div className="smm__graphic-design">
              <div className="smm__graphic-badge">⊞ 01 / 04</div>
              <div className="smm__graphic-art">
                <div className="smm__arc-ring" />
                <div className="smm__arc-core" />
              </div>
              <div className="smm__graphic-dots">
                <span className="active" /><span /><span />
              </div>
            </div>
          </div>

          {/* Card 3: Lifestyle Story Card */}
          <div className="smm__post-card smm__post-card--story">
            <div className="smm__story-ring">
              <div className="smm__story-inner">
                <img src="/brew-bloom.jpg" alt="" className="smm__story-img" />
                <span className="smm__story-badge">✦</span>
              </div>
            </div>
            <div className="smm__story-footer">
              <span className="smm__pulse-pill" />
            </div>
          </div>

          {/* Card 4: Modern Minimal Brand Card */}
          <div className="smm__post-card smm__post-card--brand">
            <div className="smm__brand-minimal">
              <div className="smm__brand-spark">✦</div>
              <div className="smm__brand-lines">
                <span className="smm__line-accent" />
                <span className="smm__line-subtle" />
              </div>
              <div className="smm__brand-actions">
                <span>♥</span>
                <span>↗</span>
              </div>
            </div>
          </div>

          {/* Duplicate set for seamless continuous infinite carousel loop */}
          <div className="smm__post-card smm__post-card--reel" aria-hidden="true">
            <div className="smm__post-media">
              <img src="/brew-bloom.jpg" alt="" className="smm__post-bg" />
              <div className="smm__post-overlay" />
              <span className="smm__play-badge">▶</span>
              <div className="smm__post-meta-top">
                <span className="smm__reel-chip">REEL</span>
              </div>
              <div className="smm__post-meta-bottom">
                <span className="smm__like-chip">♥</span>
                <span className="smm__audio-wave">
                  <span /><span /><span /><span />
                </span>
              </div>
            </div>
          </div>

          <div className="smm__post-card smm__post-card--graphic" aria-hidden="true">
            <div className="smm__graphic-design">
              <div className="smm__graphic-badge">⊞ 01 / 04</div>
              <div className="smm__graphic-art">
                <div className="smm__arc-ring" />
                <div className="smm__arc-core" />
              </div>
              <div className="smm__graphic-dots">
                <span className="active" /><span /><span />
              </div>
            </div>
          </div>

          <div className="smm__post-card smm__post-card--story" aria-hidden="true">
            <div className="smm__story-ring">
              <div className="smm__story-inner">
                <img src="/brew-bloom.jpg" alt="" className="smm__story-img" />
                <span className="smm__story-badge">✦</span>
              </div>
            </div>
            <div className="smm__story-footer">
              <span className="smm__pulse-pill" />
            </div>
          </div>

          <div className="smm__post-card smm__post-card--brand" aria-hidden="true">
            <div className="smm__brand-minimal">
              <div className="smm__brand-spark">✦</div>
              <div className="smm__brand-lines">
                <span className="smm__line-accent" />
                <span className="smm__line-subtle" />
              </div>
              <div className="smm__brand-actions">
                <span>♥</span>
                <span>↗</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Minimal Carousel Pagination Dots */}
      <div className="smm__carousel-dots" aria-hidden="true">
        <span className="smm__dot smm__dot--active" />
        <span className="smm__dot" />
        <span className="smm__dot" />
        <span className="smm__dot" />
      </div>
    </div>
  )
}

/* 4. Swatch Card: Brand Identity & Digital Presence Showcase */
export function SwatchCard() {
  return (
    <div className="mk-card mk-card--brand-showcase" aria-hidden="true">
      <div className="brand-showcase__media">
        <img
          src="/brand-identity.jpg"
          alt="Brand Identity & Digital Presence"
          className="brand-showcase__img"
          loading="eager"
        />
        <div className="brand-showcase__badge">
          <span className="brand-showcase__dot" />
          <span>Brand Identity · Digital Presence</span>
        </div>
      </div>
    </div>
  )
}

/* 4b. Mobile App Showcase Tile */
export function AppCard() {
  return (
    <div className="mk-card mk-card--app-tile" aria-hidden="true">
      <div className="app-tile__media">
        <img
          src="/mobile-app-ui.jpg"
          alt="Mobile Application UI/UX"
          className="app-tile__img"
          loading="eager"
        />
        <div className="app-tile__badge">
          <span className="app-tile__dot" />
          <span>Mobile App · iOS &amp; Android</span>
        </div>
      </div>
    </div>
  )
}

/* 5. Mobile Game Tile: Developed by Studio Member */
export function GameCard() {
  return (
    <div className="mk-card mk-card--game-tile" aria-hidden="true">
      <div className="game-tile__media">
        <img
          src="/mobile-game.jpg"
          alt="Cyberpunk Mobile Action Game developed by studio member"
          className="game-tile__img"
          loading="eager"
        />
        <div className="game-tile__badge">
          <span className="game-tile__dot" />
          <span>Mobile Game · Studio Built</span>
        </div>
        <div className="game-tile__chip">
          <span>Unreal 5</span>
        </div>
      </div>
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
  if (layout === 'app') {
    return (
      <div className="scr scr--p scr--mini scr--mini-app" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '8px 6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <b style={{ fontSize: '9px', fontWeight: 800, color: '#111' }}>Orbit Pay</b>
          <span style={{ fontSize: '6.5px', background: '#111', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>24d streak</span>
        </div>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #111', borderRadius: '7px', padding: '5px', boxShadow: '1.5px 1.5px 0 #111', color: '#111' }}>
          <div style={{ fontSize: '6px', color: '#666', fontWeight: 600 }}>Daily Orbit Balance</div>
          <div style={{ fontSize: '11px', fontWeight: 900, color: '#111' }}>£42.50 <span style={{ fontSize: '7px', color: '#13B89E' }}>+12%</span></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
          <div style={{ background: '#FF9E66', border: '1px solid #111', borderRadius: '5px', padding: '3px', fontSize: '6px', fontWeight: 800, color: '#111' }}>🎯 14 Goals</div>
          <div style={{ background: '#C29BFF', border: '1px solid #111', borderRadius: '5px', padding: '3px', fontSize: '6px', fontWeight: 800, color: '#111' }}>⚡ 98% Streak</div>
        </div>
        <div className="scr__btn" style={{ margin: 0, padding: '3px 6px', fontSize: '7px', alignSelf: 'stretch', textAlign: 'center' }}>+ Add Goal</div>
      </div>
    )
  }
  return (
    <div className={`scr scr--p scr--mini scr--mini-${layout}`}>
      <div className="scr--mini__img" />
      {lines(3, ['80%', '60%', '40%'])}
      <div className="scr__btn">{layout === 'shop' ? 'Subscribe' : layout === 'dashboard' ? 'Book' : 'Explore'}</div>
    </div>
  )
}
