import { useEffect } from 'react'
import { EMAIL } from '../data'

export default function TermsConditionsPage({ onNavigate }) {
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
            Terms &amp; <span className="policy-hero__title-accent">Conditions</span>
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
            Please read these terms carefully. They apply when you use the NailedItBro website (<a href="https://naileditbro.com" className="policy-link">naileditbro.com</a>) or hire NailedItBro for services, and they form a legal agreement between you and us.
          </p>

          <div className="policy-sections">
            {/* 1. About us and these terms */}
            <section className="policy-item">
              <h2 className="policy-heading">1. About us and these terms</h2>
              <p>
                NailedItBro (&quot;we&quot;, &quot;us&quot;) is a digital product agency. We offer website development, mobile application development, game development, social media management, CRM dashboards, brand identity and digital presence services.
              </p>
              <p>
                By using the website or engaging us, you agree to these terms. You confirm that you are at least 18 years old and, if you act for a business, that you have the authority to bind it (&quot;you&quot;). If you do not agree, please do not use the website or our services.
              </p>
            </section>

            {/* 2. Using our website */}
            <section className="policy-item">
              <h2 className="policy-heading">2. Using our website</h2>
              <p>You may use our website only for lawful purposes. You must not:</p>
              <ul className="policy-list">
                <li>Try to hack, disrupt or overload the website or its security;</li>
                <li>Copy or scrape our content without our permission;</li>
                <li>Submit false information, or send spam or harmful material through our contact form;</li>
                <li>Use the website in a way that breaks any law or the rights of others.</li>
              </ul>
              <p className="policy-note">
                Information on the website is general, may change without notice, and is not a binding offer or professional advice.
              </p>
            </section>

            {/* 3. Our intellectual property */}
            <section className="policy-item">
              <h2 className="policy-heading">3. Our intellectual property</h2>
              <p>
                All content on this website, including text, design, graphics, code, and the NailedItBro name, logo and brand, belongs to us or our licensors and is protected by intellectual property laws. You may view the website and share links to it. You may not copy, modify, distribute or reuse our content or branding without our written permission.
              </p>
              <p>
                Work shown in our portfolio belongs to us or to the client it was made for. Showing it does not give you any right to use it.
              </p>
            </section>

            {/* 4. Our services */}
            <section className="policy-item">
              <h2 className="policy-heading">4. Our services</h2>
              <p>
                Work begins only when both sides agree on a written proposal, quote or contract (a &quot;Project Agreement&quot;) that sets out the scope, timeline and price. Email or chat confirmation counts as agreement. If these terms conflict with a Project Agreement, the Project Agreement applies to that project.
              </p>
            </section>

            {/* 5. Quotes, scope and changes */}
            <section className="policy-item">
              <h2 className="policy-heading">5. Quotes, scope and changes</h2>
              <p>
                Quotes are valid for 14 days unless they say otherwise. The Project Agreement lists what is included, and anything not listed is excluded. Requests beyond the agreed scope are change requests. We will tell you how they affect the price and timeline, and we will start the extra work only after you approve it in writing.
              </p>
            </section>

            {/* 6. Your responsibilities */}
            <section className="policy-item">
              <h2 className="policy-heading">6. Your responsibilities</h2>
              <p>You agree to:</p>
              <ul className="policy-list">
                <li>Give us the content, feedback, approvals and access we need (for example hosting, domains, social media and app store accounts) on time;</li>
                <li>Name one contact person who can give approvals on your behalf, and accept that their approvals bind you;</li>
                <li>Follow the laws that apply to your own business, including having your own privacy policy and terms where needed.</li>
              </ul>
              <p className="policy-note">
                Delays on your side may delay delivery and may change the price.
              </p>
            </section>

            {/* 7. Your content */}
            <section className="policy-item">
              <h2 className="policy-heading">7. Your content</h2>
              <p>
                You are responsible for all text, images, logos, music, data, product details and other material you give us (&quot;Your Content&quot;). You confirm that you own it or have permission to use it, and that it does not break any law or anyone&apos;s rights, such as copyright, trademark or privacy. You allow us to use Your Content to carry out the project. We are not required to check Your Content for legal compliance.
              </p>
            </section>

            {/* 8. Fees, taxes and payment */}
            <section className="policy-item">
              <h2 className="policy-heading">8. Fees, taxes and payment</h2>
              <p>Fees, payment schedule and currency are set out in the Project Agreement or invoice.</p>
              <ul className="policy-list">
                <li>Invoices are due within 7 days unless they say otherwise.</li>
                <li>You pay any bank, transfer and currency conversion charges, so that we receive the full invoiced amount.</li>
                <li>Fees do not include taxes or duties (such as VAT or sales tax), or third-party costs such as hosting, domains, software licenses, app store fees, stock assets and ad spend, unless we say otherwise.</li>
                <li>If you dispute an invoice, tell us within 7 days with your reasons and pay the undisputed part on time.</li>
                <li>We may pause work and hold back final files, source code and account handover until all due amounts are paid. Late payment charges may apply as stated in the Project Agreement.</li>
                <li>Advance payments are non-refundable once work has started, unless we agree otherwise in writing.</li>
              </ul>
            </section>

            {/* 9. Timelines, revisions and delivery */}
            <section className="policy-item">
              <h2 className="policy-heading">9. Timelines, revisions and delivery</h2>
              <p>
                Timelines are estimates and depend on you giving timely input. The number of revision rounds is stated in the Project Agreement, and extra revisions may be charged. After we deliver the work, you have 7 days to report any issues. If you do not, or if you launch or use the work, it is treated as accepted.
              </p>
            </section>

            {/* 10. Ownership of work */}
            <section className="policy-item">
              <h2 className="policy-heading">10. Ownership of work</h2>
              <p>
                Once you have paid in full, you own the final deliverables we created specifically for you, such as custom designs, code and content. Until then, we keep ownership and you have no right to use unfinished or unpaid work.
              </p>
              <p>
                We keep ownership of our pre-existing code, templates, tools and know-how, and give you a worldwide, non-exclusive license to use them as part of your deliverables. Open-source and third-party components stay under their own licenses.
              </p>
              <p>
                We may show the finished work in our portfolio and case studies unless you ask us in writing not to.
              </p>
            </section>

            {/* 11. Tools, templates and AI assistance */}
            <section className="policy-item">
              <h2 className="policy-heading">11. Tools, templates and AI assistance</h2>
              <p>
                We may use licensed software, templates, open-source components and AI-assisted tools in our work. Our team reviews what we deliver. We take reasonable care that deliverables do not copy other people&apos;s protected work, but we cannot guarantee that stock assets, code libraries or generated material are completely unique. Stock assets and fonts stay under their own licenses, and if you need an extended license, we will tell you and the cost is yours.
              </p>
            </section>

            {/* 12. Confidentiality */}
            <section className="policy-item">
              <h2 className="policy-heading">12. Confidentiality</h2>
              <p>
                Each side will keep the other&apos;s non-public business information confidential and use it only for the project, unless the law requires disclosure. This does not cover information that is already public or that the receiving side already knew. This duty continues for 3 years after the project ends.
              </p>
            </section>

            {/* 13. Client data and privacy */}
            <section className="policy-item">
              <h2 className="policy-heading">13. Client data and privacy</h2>
              <p>
                Where our work involves personal data of your customers or users, you decide why and how it is used. You are responsible for having the right to collect and use it and for giving the notices the law requires. We process it only on your instructions to deliver the services, protect it with reasonable security measures, and tell you without undue delay if we learn of a breach affecting it. If the law requires a data processing agreement, we will sign one on request.
              </p>
              <p>
                Our Privacy Policy explains how we handle information collected through our own website and social channels, and our Cookie Policy explains how we use cookies.
              </p>
            </section>

            {/* 14. Support, hosting and maintenance */}
            <section className="policy-item">
              <h2 className="policy-heading">14. Support, hosting and maintenance</h2>
              <p>
                Unless the Project Agreement says otherwise, we will fix defects in the delivered work that are our fault for 30 days after delivery at no extra charge. After that, support, updates, hosting, security monitoring and maintenance are separate paid services. We do not provide hosting unless agreed, and you should keep your own backups. Changes made by you or anyone else to the delivered work are outside our support.
              </p>
            </section>

            {/* 15. No guarantee of results */}
            <section className="policy-item">
              <h2 className="policy-heading">15. No guarantee of results</h2>
              <p>
                We work hard on every project, but we cannot guarantee specific outcomes such as followers, sales, revenue, search rankings, downloads or app store approval. Results depend on factors outside our control, including platform rules and algorithms, market conditions and your own business decisions.
              </p>
            </section>

            {/* 16. Social media management */}
            <section className="policy-item">
              <h2 className="policy-heading">16. Social media management</h2>
              <p>
                You remain the owner of your accounts and give us only the access we need. Where the platform allows it, please use official admin or partner access instead of sharing passwords. You must approve content where we ask, and you are responsible for content you approve or ask us to post. Platforms can change their rules, reduce reach or suspend accounts at any time, and we are not responsible for that. Advertising budgets are paid by you directly to the platform.
              </p>
            </section>

            {/* 17. Third-party services */}
            <section className="policy-item">
              <h2 className="policy-heading">17. Third-party services</h2>
              <p>
                Projects may use third-party services such as hosting, payment gateways, app stores, APIs and social platforms. Their own terms apply. We are not responsible for their outages, changes, fees or decisions.
              </p>
            </section>

            {/* 18. Warranties and disclaimer */}
            <section className="policy-item">
              <h2 className="policy-heading">18. Warranties and disclaimer</h2>
              <p>
                We will perform our services with reasonable skill and care. Beyond that, and to the extent the law allows, the website and our services are provided &quot;as is&quot; and &quot;as available&quot;. We do not promise they will be uninterrupted or error-free, and we exclude all other warranties and conditions that the law allows us to exclude.
              </p>
            </section>

            {/* 19. Limitation of liability */}
            <section className="policy-item">
              <h2 className="policy-heading">19. Limitation of liability</h2>
              <p>
                To the extent the law allows, we are not liable for indirect or consequential losses, such as lost profits, revenue, data, business or goodwill, whatever the legal reason for the claim. We are also not liable for losses caused by third-party services, Your Content, delays on your side, or changes made by others to our work.
              </p>
              <p>
                Our total liability for all claims connected to a project is limited to the fees you paid us for that project. Nothing in these terms limits liability that cannot be limited by law.
              </p>
            </section>

            {/* 20. Indemnity */}
            <section className="policy-item">
              <h2 className="policy-heading">20. Indemnity</h2>
              <p>
                You agree to defend us and cover our losses and reasonable costs arising from third-party claims that result from Your Content, your use of the deliverables in breach of the law or these terms, or your breach of these terms. We will tell you promptly about any claim and give you reasonable help in dealing with it.
              </p>
            </section>

            {/* 21. Ending a project */}
            <section className="policy-item">
              <h2 className="policy-heading">21. Ending a project</h2>
              <p>
                You may cancel a project at any time by written notice. Either side may also end a project by written notice if the other side seriously breaks these terms or the Project Agreement and does not fix it within 7 days of being told. When a project ends, you pay for work completed up to the end date and for any costs we cannot cancel, and we hand over the completed work you have paid for. We may also suspend or block access to the website for misuse.
              </p>
              <p>
                Sections that are meant to continue after the project ends, such as payment, ownership, confidentiality, liability and indemnity, stay in effect.
              </p>
            </section>

            {/* 22. Events beyond our control */}
            <section className="policy-item">
              <h2 className="policy-heading">22. Events beyond our control</h2>
              <p>
                Neither side is responsible for delay or failure caused by events beyond its reasonable control, such as natural disasters, power or internet outages, platform or hosting failures, war, strikes, government action or pandemics. Payment for work already done is still due. If such an event lasts more than 30 days, either side may end the project.
              </p>
            </section>

            {/* 23. General terms */}
            <section className="policy-item">
              <h2 className="policy-heading">23. General terms</h2>
              <ul className="policy-list">
                <li><strong>Independent parties:</strong> We are independent contractors. Nothing here makes us your partner, employee or agent.</li>
                <li><strong>Subcontractors:</strong> We may use subcontractors and remain responsible for their work.</li>
                <li><strong>Transfers:</strong> You may not transfer your rights under these terms without our written consent.</li>
                <li><strong>Whole agreement:</strong> These terms, the Project Agreement and our invoices are the whole agreement and replace earlier discussions.</li>
                <li><strong>If part is unenforceable:</strong> The rest stays valid.</li>
                <li><strong>No waiver:</strong> Not enforcing a right does not mean we give it up.</li>
                <li><strong>Notices and signatures:</strong> Notices by email to the addresses used for the project are valid, and electronic acceptance counts as a signature.</li>
                <li><strong>No third-party rights:</strong> Only you and we can enforce these terms.</li>
              </ul>
            </section>

            {/* 24. Governing law and disputes */}
            <section className="policy-item">
              <h2 className="policy-heading">24. Governing law and disputes</h2>
              <p>
                These terms and any Project Agreement are governed by the laws of India, unless the Project Agreement says otherwise. If a dispute comes up, both sides will first try in good faith to resolve it for 30 days after written notice. If that does not work, the courts of India will have exclusive jurisdiction. Either side may still ask a court for urgent relief to protect confidential information or intellectual property.
              </p>
            </section>

            {/* 25. Changes to these terms */}
            <section className="policy-item">
              <h2 className="policy-heading">25. Changes to these terms</h2>
              <p>
                We may update these terms from time to time. The latest version will always be on this page, with the effective date at the top. Using the website after an update means you accept the new terms. We will not change the terms of an existing Project Agreement without your agreement.
              </p>
            </section>

            {/* 26. Contact us */}
            <section className="policy-item policy-item--contact">
              <h2 className="policy-heading">26. Contact us</h2>
              <p>Questions about these terms? Contact us:</p>
              <div className="policy-contact-simple">
                <p><strong>NailedItBro</strong></p>
                <p>Email: <a href={`mailto:${EMAIL}`} className="policy-link">{EMAIL}</a></p>
                <p>Address: Nailed It Bro Studio, India</p>
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

