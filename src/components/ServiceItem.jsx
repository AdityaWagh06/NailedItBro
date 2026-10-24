export default function ServiceItem({
  icon: Icon,
  title,
  description,
  className = '',
}) {
  return (
    <div className={`service-item-card ${className}`}>
      <div className="service-item__icon-wrap">
        {Icon && <Icon size={24} className="service-item__icon" aria-hidden="true" />}
      </div>
      <h3 className="service-item__title">{title}</h3>
      <p className="service-item__desc">{description}</p>
    </div>
  )
}
