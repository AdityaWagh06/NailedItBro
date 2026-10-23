import './WallTiles.css'

/* 1. Desktop Website Dummy UI Cafe (Brew & Bloom) */
export function TileCafeDesktop() {
  return (
    <div className="wt-card wt-cafe" aria-hidden="true">
      <div className="wt-browser-bar">
        <div className="wt-dots">
          <span className="wt-dot wt-dot--red" />
          <span className="wt-dot wt-dot--yellow" />
          <span className="wt-dot wt-dot--green" />
        </div>
        <span className="wt-url">🔒 brewandbloom.co</span>
      </div>
      <div className="wt-cafe-body">
        <div className="wt-cafe-left">
          <span className="wt-cafe-eyebrow">✦ Time Out Best Cafe</span>
          <h4 className="wt-cafe-title">
            <em>Artisan brews &amp;</em><br />botanical bakes
          </h4>
          <p className="wt-cafe-desc">
            Slow-crafted specialty roasts &amp; seasonal botanicals in Soho.
          </p>
          <span className="wt-cafe-btn">Reserve Table ↗</span>
        </div>
        <div className="wt-cafe-img-wrap">
          <img src="/brew-bloom.jpg" alt="" className="wt-cafe-img" />
        </div>
      </div>
    </div>
  )
}

/* 2. Mobile App Dummy UI (Kinetic Habit & Athletic OS) */
export function TileMobileApp() {
  return (
    <div className="wt-card wt-mobile" aria-hidden="true">
      <div className="wt-phone-notch-row">
        <span>9:41</span>
        <div className="wt-phone-notch" />
        <span>100%</span>
      </div>
      <div className="wt-mobile-profile">
        <div className="wt-user-info">
          <div className="wt-avatar">⚡</div>
          <span className="wt-user-name">Maya Chen</span>
        </div>
        <span className="wt-user-badge">🔥 PRO STREAK</span>
      </div>
      <div className="wt-mobile-score-box">
        <span className="wt-score-lbl">Daily Energy Score</span>
        <span className="wt-score-val">92.4 <small>/100</small></span>
      </div>
      <div className="wt-mobile-stats">
        <div className="wt-mstat wt-mstat--cyan">
          <b>18</b>
          <span>Runs</span>
        </div>
        <div className="wt-mstat wt-mstat--lime">
          <b>2,840</b>
          <span>Kcal</span>
        </div>
        <div className="wt-mstat wt-mstat--peach">
          <b>3.2L</b>
          <span>Hydrate</span>
        </div>
      </div>
    </div>
  )
}

/* 3. Social Media Management: INSTAGRAM Tile */
export function TileInstagram() {
  return (
    <div className="wt-card wt-instagram" aria-hidden="true">
      <div className="wt-smm-top">
        <div className="wt-smm-brand">
          <img src="/instagram.png" alt="Instagram" className="wt-platform-icon" />
          <span className="wt-smm-handle">
            @naileditbro <span className="wt-smm-verified">✓</span>
          </span>
        </div>
        <span className="wt-smm-pill">Instagram Reels</span>
      </div>
      <div className="wt-ig-reel-card">
        <img src="/brew-bloom.jpg" alt="" className="wt-ig-reel-bg" />
        <div className="wt-ig-reel-overlay" />
        <div className="wt-ig-reel-content">
          <span className="wt-ig-reel-badge">▶ Viral Creative Reel</span>
          <div className="wt-ig-metrics">
            <span>♥ 42.8K · 💬 1,280</span>
            <span className="wt-ig-reach">+380% Reach</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* 4. Social Media Management: LINKEDIN Tile */
export function TileLinkedIn() {
  return (
    <div className="wt-card wt-linkedin" aria-hidden="true">
      <div className="wt-smm-top">
        <div className="wt-smm-brand">
          <img src="/linkedin.png" alt="LinkedIn" className="wt-platform-icon" />
          <span className="wt-smm-handle">Nailed It Bro Studio</span>
        </div>
        <span className="wt-li-pill">LinkedIn B2B</span>
      </div>
      <div className="wt-li-post">
        <span className="wt-li-post-text">
          How thoughtful UI &amp; design engineering drove a 480% surge in qualified leads...
        </span>
        <div className="wt-li-chart-row">
          <div className="wt-li-stat-col">
            <span className="wt-li-impressions">48.2K</span>
            <span className="wt-li-stat-lbl">Impressions</span>
          </div>
          <span className="wt-li-growth-badge">📈 +480% Viral</span>
        </div>
      </div>
    </div>
  )
}

/* 5. Social Media Management: FACEBOOK Tile */
export function TileFacebook() {
  return (
    <div className="wt-card wt-facebook" aria-hidden="true">
      <div className="wt-smm-top">
        <div className="wt-smm-brand">
          <img src="/facebook.png" alt="Facebook" className="wt-platform-icon" />
          <span className="wt-smm-handle">Meta Campaign</span>
        </div>
        <span className="wt-fb-pill">Meta Ads OS</span>
      </div>
      <div className="wt-fb-card">
        <div className="wt-fb-title-row">
          <span className="wt-fb-active-pip">
            <span className="wt-fb-dot" /> High ROAS Scaling
          </span>
          <span style={{ fontSize: '7px', color: '#9FB5D6' }}>Live Spend</span>
        </div>
        <div className="wt-fb-grid">
          <div className="wt-fb-metric">
            <b className="wt-fb-roas">4.8x</b>
            <span>Return (ROAS)</span>
          </div>
          <div className="wt-fb-metric">
            <b>184K</b>
            <span>Reach</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* 6. Mobile Banking & Smart Savings Dummy UI */
export function TileOrbitFinance() {
  return (
    <div className="wt-card wt-orbit" aria-hidden="true">
      <div className="wt-savings-card">
        <div className="wt-savings-user-row">
          <div className="wt-savings-user">
            <div className="wt-savings-avatar">👤</div>
            <div className="wt-savings-greeting">
              <span>Good morning</span>
              <b>Elena Vance</b>
            </div>
          </div>
          <span className="wt-savings-bell">🔔</span>
        </div>
        <div className="wt-savings-total-box">
          <span className="wt-savings-lbl">Total Savings</span>
          <span className="wt-savings-val">$48,650.00</span>
        </div>
        <div className="wt-savings-split-pill">
          <div className="wt-savings-split-col wt-savings-split-col--income">
            <span>Income</span>
            <b>+$34,340</b>
          </div>
          <div className="wt-savings-split-col wt-savings-split-col--spend">
            <span>Spending</span>
            <b>-$14,120</b>
          </div>
        </div>
      </div>
      <div className="wt-savings-tri-cards">
        <div className="wt-tri-card wt-tri-card--emerald">
          <b>20</b>
          <span>Active Plans</span>
        </div>
        <div className="wt-tri-card wt-tri-card--purple">
          <b>32</b>
          <span>Day Streak 🔥</span>
        </div>
        <div className="wt-tri-card wt-tri-card--cyan">
          <b>24</b>
          <span>Challenge ✦</span>
        </div>
      </div>
    </div>
  )
}

/* 7. Desktop SaaS Analytics Dashboard (Nexus) */
export function TileSaaSAnalytics() {
  return (
    <div className="wt-card wt-saas" aria-hidden="true">
      <div className="wt-saas-header">
        <span className="wt-saas-title">Nexus Analytics</span>
        <span style={{ fontSize: '7px', color: '#22C55E', fontWeight: 800 }}>● +14.2% MRR</span>
      </div>
      <div className="wt-saas-rev-box">
        <div className="wt-saas-mrr">
          <span>Annual Run Rate</span>
          <b>$48,290</b>
        </div>
        <svg className="wt-saas-spark" viewBox="0 0 50 18" fill="none">
          <path d="M2 14 L12 11 L20 13 L32 6 L40 8 L48 2" stroke="#FF5E14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7px', color: '#8A92A6' }}>
        <span>3,842 Active Users</span>
        <span>98.6% Retain</span>
      </div>
    </div>
  )
}

/* 8. Halden Coffee E-Commerce */
export function TileHaldenCoffee() {
  return (
    <div className="wt-card wt-halden" aria-hidden="true">
      <div className="wt-halden-split">
        <div className="wt-halden-info">
          <span style={{ fontSize: '7px', color: '#C9844E', fontWeight: 700, textTransform: 'uppercase' }}>Specialty Roastery</span>
          <span className="wt-halden-title">Halden Reserve</span>
          <span className="wt-halden-notes">Bergamot · Candied Peach</span>
          <span className="wt-halden-price">$22.00</span>
          <span className="wt-halden-btn">Subscribe &amp; Save ↗</span>
        </div>
        <div style={{ width: '42px', height: '56px', background: '#3D2F24', borderRadius: '6px', border: '1px solid #5A4738', display: 'grid', placeContent: 'center', fontSize: '18px' }}>
          ☕
        </div>
      </div>
    </div>
  )
}

/* 9. Pulse Studio Fitness Booking */
export function TilePulseStudio() {
  return (
    <div className="wt-card" style={{ background: '#14181B', padding: '8px 10px', gap: '5px' }} aria-hidden="true">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '9px', fontWeight: 800, color: '#D7F25C' }}>Pulse Studio</span>
        <span style={{ fontSize: '6.5px', background: 'rgba(215, 242, 92, 0.2)', color: '#D7F25C', padding: '1.5px 5px', borderRadius: '4px', fontWeight: 700 }}>Soho Hub</span>
      </div>
      <div style={{ padding: '5px 8px', background: '#1D2227', borderRadius: '7px', border: '1px solid rgba(215, 242, 92, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '6.5px', color: '#889299', display: 'block' }}>Next Session · 08:30 AM</span>
          <b style={{ fontSize: '9.5px', color: '#FFFFFF' }}>Hypertrophy &amp; HIIT</b>
        </div>
        <span style={{ fontSize: '7px', background: '#D7F25C', color: '#111', padding: '3px 7px', borderRadius: '999px', fontWeight: 800 }}>Book ↗</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7px', color: '#889299' }}>
        <span>Trainer: Marcus Vance</span>
        <span style={{ color: '#22C55E' }}>3 spots left</span>
      </div>
    </div>
  )
}
