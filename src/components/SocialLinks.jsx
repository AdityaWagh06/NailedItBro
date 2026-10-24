function LinkedInIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.53-1.53c0-.85-.68-1.54-1.53-1.54a1.54 1.54 0 0 0-1.54 1.54c0 .85.69 1.53 1.54 1.53m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  )
}

function InstagramIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function FacebookIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

export default function SocialLinks({ className = '' }) {
  const links = [
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/naileditbro',
      icon: LinkedInIcon,
      label: 'Visit Nailed It Bro on LinkedIn',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/nailedit.bro',
      icon: InstagramIcon,
      label: 'Follow Nailed It Bro on Instagram',
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/naileditbro',
      icon: FacebookIcon,
      label: 'Connect with Nailed It Bro on Facebook',
    },
  ]

  return (
    <div className={`social-links-row ${className}`} aria-label="Official company social profiles">
      {links.map((link) => {
        const Icon = link.icon
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-circle"
            aria-label={link.label}
          >
            <Icon size={18} aria-hidden="true" />
          </a>
        )
      })}
    </div>
  )
}
