import { ExternalLink } from 'lucide-react'

export default function ProjectCard({
  screenshot,
  name,
  clientType,
  result,
  techTags = [],
  link,
  isOwnProduct = false,
  isTodo = true,
}) {
  return (
    <div className="project-card-item">
      <div className="project-card__thumb-wrap">
        {screenshot ? (
          <img
            src={screenshot}
            alt={`${name} — ${clientType}`}
            width={540}
            height={340}
            loading="lazy"
            decoding="async"
            className="project-card__thumb"
          />
        ) : (
          <div className="project-card__thumb-placeholder">
            <span>Project Preview [TODO]</span>
          </div>
        )}
        <div className="project-card__badges">
          {isOwnProduct && <span className="project-badge project-badge--own">Our own products</span>}
          {isTodo && <span className="todo-flag-badge">TODO</span>}
        </div>
      </div>

      <div className="project-card__content">
        <div className="project-card__meta">
          <span className="project-card__client-type">{clientType}</span>
          <h3 className="project-card__name">{name}</h3>
        </div>

        <p className="project-card__result">{result}</p>

        {techTags.length > 0 && (
          <div className="project-card__tags">
            {techTags.map((tag) => (
              <span key={tag} className="project-tech-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card__link"
          >
            <span>View project</span>
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  )
}
