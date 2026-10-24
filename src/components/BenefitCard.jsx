export default function BenefitCard({
  icon: Icon,
  title,
  description,
  className = '',
}) {
  return (
    <div className={`benefit-card ${className}`}>
      <div className="benefit-card__icon-wrap">
        {Icon && <Icon size={24} className="benefit-card__icon" aria-hidden="true" />}
      </div>
      <h3 className="benefit-card__title">{title}</h3>
      <p className="benefit-card__desc">{description}</p>
    </div>
  )
}
