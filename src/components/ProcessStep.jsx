export default function ProcessStep({
  number,
  title,
  description,
  duration,
  icon: Icon,
  color = '#FF5E14',
  isActive = false,
  isCompleted = false,
  isLast = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <div
      className={`process-step-item ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''} ${isLast ? 'process-step-item--last' : ''}`}
      style={{ '--step-color': color }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={`Step ${number}: ${title}`}
    >
      <div className="process-step__header">
        <div className="process-step__num-circle" aria-hidden="true">
          <span className="process-step__num-text">{number}</span>
          {isActive && <span className="process-step__pulse-ring" />}
        </div>
        {!isLast && (
          <div
            className={`process-step__connector ${isCompleted || isActive ? 'is-filled' : ''}`}
            aria-hidden="true"
          >
            <div className="process-step__connector-fill" />
            {(isCompleted || isActive) && <span className="process-step__connector-glow" />}
          </div>
        )}
      </div>

      <div className="process-step__card">
        <div className="process-step__accent-bar" aria-hidden="true" />
        <div className="process-step__card-top">
          {Icon && (
            <div className="process-step__icon-badge">
              <Icon size={18} className="process-step__icon" aria-hidden="true" />
            </div>
          )}
          {duration && (
            <span className="process-step__duration-tag">{duration}</span>
          )}
        </div>

        <h3 className="process-step__title">{title}</h3>
        <p className="process-step__desc">{description}</p>

        {isActive && (
          <div className="process-step__live-indicator">
            <span className="process-step__live-dot" />
            <span>Active Stage</span>
          </div>
        )}
      </div>
    </div>
  )
}
