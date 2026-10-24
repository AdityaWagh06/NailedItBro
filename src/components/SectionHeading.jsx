export default function SectionHeading({
  prefix,
  accent,
  suffix,
  subtext,
  className = '',
  align = 'left',
}) {
  return (
    <div className={`section-heading-wrap section-heading-wrap--${align} ${className}`}>
      <h2 className="section-heading-title">
        {prefix && <span>{prefix} </span>}
        {accent && <em className="serif section-heading-accent">{accent}</em>}
        {suffix && <span> {suffix}</span>}
      </h2>
      {subtext && <p className="section-heading-subtext">{subtext}</p>}
    </div>
  )
}
