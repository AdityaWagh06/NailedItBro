export default function SecondaryButton({
  children,
  onClick,
  href,
  className = '',
  type = 'button',
  fullWidth = false,
  ...props
}) {
  const classes = `btn-secondary-52 ${fullWidth ? 'btn-secondary-52--full' : ''} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        <span>{children}</span>
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      <span>{children}</span>
    </button>
  )
}
