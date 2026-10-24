import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'
import { EMAIL } from '../data'

export default function CTABand({ onConsultClick }) {
  const handleConsult = (e) => {
    e?.preventDefault?.()
    if (onConsultClick) {
      onConsultClick('#contact')
    } else {
      window.location.hash = '#contact'
      const contactEl = document.querySelector('#contact')
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <section className="cta-band-section" id="consultation" aria-label="Book a free consultation">
      <div className="container cta-band__container">
        <h2 className="cta-band__heading">
          Have an idea or a problem to <em className="serif cta-band__accent">solve?</em>
        </h2>

        <p className="cta-band__subtext">
          Tell us what you're trying to achieve. We'll reply within 24 hours with honest feedback, a rough scope, and a ballpark cost. No pressure, no jargon.
        </p>

        <div className="cta-band__actions">
          <PrimaryButton onClick={handleConsult}>
            Book a Free Consultation
          </PrimaryButton>

          <SecondaryButton
            href={`mailto:${EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary-dark"
          >
            Email Us Directly
          </SecondaryButton>
        </div>
      </div>
    </section>
  )
}
