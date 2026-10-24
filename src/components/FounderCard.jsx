import { useState } from 'react'
import { User } from 'lucide-react'

function LinkedInIcon({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.53-1.53c0-.85-.68-1.54-1.53-1.54a1.54 1.54 0 0 0-1.54 1.54c0 .85.69 1.53 1.54 1.53m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  )
}

function InstagramIcon({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

export default function FounderCard({
  name,
  role = 'CO-FOUNDER',
  domain,
  bio,
  skills = [],
  photoSrc,
  linkedin,
  instagram,
}) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="founder-card-item">
      {/* 4:5 Aspect Ratio Photo Container */}
      <div className="founder-card__media">
        {!imgError && photoSrc ? (
          <img
            src={photoSrc}
            alt={`${name} — ${domain || role}`}
            width={320}
            height={400}
            loading="lazy"
            decoding="async"
            className="founder-card__img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="founder-card__placeholder" aria-label={`Photo of ${name} coming soon`}>
            <User size={36} className="founder-card__placeholder-icon" aria-hidden="true" />
            <span className="founder-card__placeholder-text">Photo coming soon</span>
          </div>
        )}
      </div>

      <div className="founder-card__info">
        <span className="founder-card__role-label">{role}</span>
        <h3 className="founder-card__name">{name}</h3>
        {domain && <p className="founder-card__domain">{domain}</p>}
        <p className="founder-card__bio">{bio}</p>

        {skills.length > 0 && (
          <div className="founder-card__skills">
            {skills.map((skill) => (
              <span key={skill} className="founder-skill-tag">
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="founder-card__socials" aria-label={`Connect with ${name}`}>
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="founder-social-icon-btn founder-social-icon-btn--li"
              aria-label={`${name}'s LinkedIn`}
            >
              <LinkedInIcon size={16} aria-hidden="true" />
            </a>
          )}
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="founder-social-icon-btn founder-social-icon-btn--ig"
              aria-label={`${name}'s Instagram`}
            >
              <InstagramIcon size={16} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
