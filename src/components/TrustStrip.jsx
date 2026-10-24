export default function TrustStrip({
  items = [
    'Founder-led',
    'Reply within 24 hours',
    'Clear scope and pricing before we start',
  ],
  className = '',
}) {
  return (
    <div className={`trust-strip ${className}`} aria-label="Key studio commitments">
      {items.map((item, index) => (
        <span key={item} className="trust-strip__item">
          <span>{item}</span>
          {index < items.length - 1 && <span className="trust-strip__dot" aria-hidden="true">·</span>}
        </span>
      ))}
    </div>
  )
}
