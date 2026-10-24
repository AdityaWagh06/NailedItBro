export default function TestimonialCard({ quote, name, business }) {
  if (!quote || !name) {
    return null
  }

  return (
    <div className="testimonial-card">
      <blockquote className="testimonial-card__quote">
        “{quote}”
      </blockquote>
      <div className="testimonial-card__author">
        <span className="testimonial-card__name">{name}</span>
        {business && <span className="testimonial-card__business">{business}</span>}
      </div>
    </div>
  )
}
