import { useEffect } from 'react'
import { EMAIL } from '../data'

export default function PrivacyPolicyPage({ onNavigate }) {
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
      {/* Dark Ambient Hero Banner (Inspired by reference, NailedItBro studio style) */}
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
            Privacy <span className="policy-hero__title-accent">Policy</span>
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
            NailedItBro respects your privacy. This policy explains what personal information we collect through our website, <a href="https://naileditbro.com" className="policy-link">naileditbro.com</a>, and our social channels, how we use it, and the choices you have. NailedItBro is a digital product agency working with clients worldwide.
          </p>

          <div className="policy-sections">
            {/* 1. Information we collect */}
            <section className="policy-item">
              <h2 className="policy-heading">1. Information we collect</h2>
              <ul className="policy-list">
                <li>
                  <strong>Contact form:</strong> Your name, email address and phone number. This is the only information the website asks you to enter. The site has no accounts, logins or sign-ups.
                </li>
                <li>
                  <strong>Messages and project details:</strong> Anything you send us by email, WhatsApp or social media, such as your company, requirements, budget or files.
                </li>
                <li>
                  <strong>Billing details:</strong> If you become a client, the information we need to send invoices and receive payment. We do not store full card numbers.
                </li>
                <li>
                  <strong>Basic technical data:</strong> Your IP address, browser, device and the pages you visit, collected automatically when you use the site. See our Cookie Policy for details.
                </li>
              </ul>
              <p className="policy-note">
                Please do not send us sensitive information such as health records, government ID numbers or bank passwords.
              </p>
            </section>

            {/* 2. How we use your information */}
            <section className="policy-item">
              <h2 className="policy-heading">2. How we use your information</h2>
              <p>We use your information to:</p>
              <ul className="policy-list">
                <li>Reply to your inquiries and prepare proposals;</li>
                <li>Deliver and support the services you hire us for;</li>
                <li>Send invoices, process payments and keep business records;</li>
                <li>Send updates about NailedItBro, where you have agreed or the law allows (you can opt out anytime);</li>
                <li>Keep the website secure and improve it;</li>
                <li>Meet our legal obligations.</li>
              </ul>
              <p className="policy-note">
                Where the law requires a legal basis, we rely on your consent, our need to respond to your request or perform a contract, our legitimate business interests, and legal obligations.
              </p>
            </section>

            {/* 3. How we share your information */}
            <section className="policy-item">
              <h2 className="policy-heading">3. How we share your information</h2>
              <p>We do not sell your personal information. We share it only with:</p>
              <ul className="policy-list">
                <li>Service providers that help us run our business, such as website hosting, email, communication, analytics, scheduling, payment and accounting tools;</li>
                <li>Professional advisers, such as lawyers and accountants;</li>
                <li>Authorities, when the law requires it;</li>
                <li>A future owner of our business, if we are ever sold or merged.</li>
              </ul>
              <p className="policy-note">
                These providers may use your information only to provide services to us.
              </p>
            </section>

            {/* 4. Cookies */}
            <section className="policy-item">
              <h2 className="policy-heading">4. Cookies</h2>
              <p>
                We use cookies and similar technologies on our website. How they work and how to manage them is explained in our Cookie Policy.
              </p>
            </section>

            {/* 5. Social media and our WhatsApp community */}
            <section className="policy-item">
              <h2 className="policy-heading">5. Social media and our WhatsApp community</h2>
              <p>
                We have pages on LinkedIn, Instagram and Facebook, and a WhatsApp community. When you follow, message, comment on or join them, that platform's own privacy policy applies and the platform controls that data.
              </p>
              <p>
                In the WhatsApp community, your display name and phone number may be visible to admins and, depending on your settings, to other members. Joining is voluntary and you can leave at any time. We use community contact details only to run the community and share NailedItBro updates.
              </p>
            </section>

            {/* 6. Working with clients */}
            <section className="policy-item">
              <h2 className="policy-heading">6. Working with clients</h2>
              <p>
                When we build or manage a website, app, game, dashboard or social media account for a client, we may handle personal data belonging to that client's own users. We do this only on the client's instructions. If you are a user of a product we built for someone else, please contact that company about your data.
              </p>
            </section>

            {/* 7. International transfers */}
            <section className="policy-item">
              <h2 className="policy-heading">7. International transfers</h2>
              <p>
                We are based in India, and our service providers may operate from other countries. Your information may therefore be processed outside the country where you live. Where the law requires it, we use appropriate safeguards to protect it.
              </p>
            </section>

            {/* 8. How long we keep your information */}
            <section className="policy-item">
              <h2 className="policy-heading">8. How long we keep your information</h2>
              <p>
                We keep your information only as long as we need it for the purposes above or to meet legal and tax requirements. After that, we delete or anonymize it.
              </p>
            </section>

            {/* 9. Your rights */}
            <section className="policy-item">
              <h2 className="policy-heading">9. Your rights</h2>
              <p>
                Depending on where you live, you may have the right to access, correct or delete your personal information, object to or restrict how we use it, receive a copy of it, and withdraw your consent at any time. You may also complain to your local data protection authority.
              </p>
              <p>
                To make a request, email us at <a href={`mailto:${EMAIL}`} className="policy-link">{EMAIL}</a>. We may need to verify your identity first, and we will respond within the time the law requires.
              </p>
            </section>

            {/* 10. Security */}
            <section className="policy-item">
              <h2 className="policy-heading">10. Security</h2>
              <p>
                We use reasonable measures to protect your information, such as secure connections and limited access. No system is completely secure, so we cannot guarantee absolute security.
              </p>
            </section>

            {/* 11. Children */}
            <section className="policy-item">
              <h2 className="policy-heading">11. Children</h2>
              <p>
                Our website and services are meant for businesses and adults. We do not knowingly collect personal information from anyone under 16. If you think a child has sent us information, contact us and we will delete it.
              </p>
            </section>

            {/* 12. Changes to this policy */}
            <section className="policy-item">
              <h2 className="policy-heading">12. Changes to this policy</h2>
              <p>
                We may update this policy from time to time. The latest version will always be on this page, with the effective date at the top.
              </p>
            </section>

            {/* 13. Contact us */}
            <section className="policy-item policy-item--contact">
              <h2 className="policy-heading">13. Contact us</h2>
              <p>If you have questions or requests about this policy, contact us:</p>
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
