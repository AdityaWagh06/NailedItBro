import { useEffect } from 'react'
import { EMAIL } from '../data'

export default function CookiePolicyPage({ onNavigate }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const handleBack = (e) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate('#top')
    } else {
      window.location.hash = '#top'
    }
  }

  return (
    <article className="policy-page">
      {/* Dark Ambient Studio Hero Banner */}
      <header className="policy-hero" data-theme="dark">
        <div className="policy-hero__container">
          <a
            href="#top"
            onClick={handleBack}
            className="policy-hero__back"
          >
            ← Back to home
          </a>
          <h1 className="policy-hero__title">
            Cookie <span className="policy-hero__title-accent">Policy</span>
          </h1>
          <p className="policy-hero__meta">
            NailedItBro &nbsp;·&nbsp; Effective date: November 7, 2026
          </p>
        </div>
      </header>

      {/* Clean, Simple, Breathable Editorial Content (Beige Background) */}
      <main className="policy-content" data-theme="light">
        <div className="policy-content__container">
          {/* Introductory Lead */}
          <p className="policy-lead">
            This Cookie Policy explains how NailedItBro (&quot;we&quot;, &quot;us&quot;) uses cookies and similar technologies when you visit our website, <a href="https://naileditbro.com" className="policy-link">naileditbro.com</a>. It should be read together with our <a href="#privacy" onClick={(e) => { e.preventDefault(); onNavigate ? onNavigate('#privacy') : (window.location.hash = '#privacy'); }} className="policy-link">Privacy Policy</a>, which explains how we handle your personal information.
          </p>

          <div className="policy-sections">
            {/* 1. What are cookies? */}
            <section className="policy-item">
              <h2 className="policy-heading">1. What are cookies?</h2>
              <p>
                Cookies are small text files that a website saves on your device when you visit it. They help the website work properly, remember your choices, and give us information about how the website is used. In this policy, &quot;cookies&quot; also includes similar technologies such as pixels, tags and local storage.
              </p>
            </section>

            {/* 2. How we use cookies */}
            <section className="policy-item">
              <h2 className="policy-heading">2. How we use cookies</h2>
              <p>We use cookies for the following purposes:</p>
              <ul className="policy-list">
                <li>
                  <strong>Essential cookies:</strong> Needed for the website to load, stay secure and remember your cookie choices. The website cannot work properly without them, so they cannot be switched off.
                </li>
                <li>
                  <strong>Analytics cookies:</strong> Help us understand how visitors find and use our website, such as which pages are viewed and where errors happen, so we can improve it. We may use analytics services such as Google Analytics for this.
                </li>
                <li>
                  <strong>Functional cookies:</strong> Remember choices you make, such as your preferences, so the website works the way you expect.
                </li>
                <li>
                  <strong>Marketing cookies:</strong> Help us measure how well our advertising works and show relevant NailedItBro content on other platforms. We may use tools such as the Meta Pixel or the LinkedIn Insight Tag for this.
                </li>
              </ul>
              <p className="policy-note">
                We use analytics, functional and marketing cookies only where you have agreed, if the law requires your agreement.
              </p>
            </section>

            {/* 3. Cookies from other companies */}
            <section className="policy-item">
              <h2 className="policy-heading">3. Cookies from other companies</h2>
              <p>
                Some cookies are set by other companies, such as analytics providers and social media platforms, when you use our website. These are called third-party cookies. The companies that set them control how they work and have their own privacy policies.
              </p>
            </section>

            {/* 4. How long cookies last */}
            <section className="policy-item">
              <h2 className="policy-heading">4. How long cookies last</h2>
              <p>
                Session cookies are deleted when you close your browser. Persistent cookies stay on your device until they expire or you delete them. Different cookies last for different lengths of time, from a single visit to a couple of years, depending on their purpose.
              </p>
            </section>

            {/* 5. Managing your cookie choices */}
            <section className="policy-item">
              <h2 className="policy-heading">5. Managing your cookie choices</h2>
              <p>You are in control of the cookies we use.</p>
              <ul className="policy-list">
                <li>
                  <strong>On our website:</strong> Where the law requires it, you can accept, reject or choose which categories of cookies to allow when you first visit, and you can change your choice at any time through our cookie settings.
                </li>
                <li>
                  <strong>In your browser:</strong> Most browsers let you block or delete cookies. Check your browser&apos;s help pages to learn how. If you block essential cookies, parts of the website may not work properly.
                </li>
                <li>
                  <strong>On your device:</strong> Your phone or tablet may let you limit ad tracking in its settings.
                </li>
                <li>
                  <strong>With privacy signals:</strong> Where the law requires it, we treat a Global Privacy Control signal from your browser as a request to opt out of marketing cookies.
                </li>
              </ul>
              <p className="policy-note">
                Some providers also offer their own opt-out tools, which you can find in their privacy policies.
              </p>
            </section>

            {/* 6. Embedded content and social media */}
            <section className="policy-item">
              <h2 className="policy-heading">6. Embedded content and social media</h2>
              <p>
                Some pages may include embedded content such as videos, maps, or social media buttons and feeds. When this content loads, the provider may set its own cookies. We do not control them, so please check the provider&apos;s own policy.
              </p>
            </section>

            {/* 7. Personal information */}
            <section className="policy-item">
              <h2 className="policy-heading">7. Personal information</h2>
              <p>
                Cookies may collect information such as your IP address, browser and device type, and the pages you visit. We use this information only as described in our <a href="#privacy" onClick={(e) => { e.preventDefault(); onNavigate ? onNavigate('#privacy') : (window.location.hash = '#privacy'); }} className="policy-link">Privacy Policy</a>.
              </p>
            </section>

            {/* 8. Changes to this policy */}
            <section className="policy-item">
              <h2 className="policy-heading">8. Changes to this policy</h2>
              <p>
                We may update this policy from time to time, for example when we change the tools we use. The latest version will always be on this page, with the effective date at the top.
              </p>
            </section>

            {/* 9. Contact us */}
            <section className="policy-item policy-item--contact">
              <h2 className="policy-heading">9. Contact us</h2>
              <p>If you have questions about cookies or this policy, contact us:</p>
              <div className="policy-contact-simple">
                <p><strong>NailedItBro</strong></p>
                <p>Email: <a href={`mailto:${EMAIL}`} className="policy-link">{EMAIL}</a></p>
              </div>
            </section>
          </div>

          {/* Simple Bottom Navigation */}
          <div className="policy-content__footer">
            <a
              href="#top"
              onClick={handleBack}
              className="policy-back-link"
            >
              ← Return to homepage
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="policy-top-btn"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </main>
    </article>
  )
}

