export default function SectionLabel({ text, className = '' }) {
  return (
    <div className={`section-label-pill ${className}`}>
      <span className="section-label-dot" aria-hidden="true" />
      <span className="section-label-text">{text}</span>
    </div>
  )
}
