import { ArrowRight } from 'lucide-react'

export default function PrimaryButton({
  children,
  onClick,
  href,
  className = '',
  type = 'button',
  fullWidth = false,
  ...props
}) {
  const classes = `btn-primary-52 ${fullWidth ? 'btn-primary-52--full' : ''} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        <span>{children}</span>
        <ArrowRight size={18} className="btn-icon" aria-hidden="true" />
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      <span>{children}</span>
      <ArrowRight size={18} className="btn-icon" aria-hidden="true" />
    </button>
  )
}
