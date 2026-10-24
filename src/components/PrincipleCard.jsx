export default function PrincipleCard({ number, title, description }) {
  return (
    <div className="principle-card">
      <span className="principle-card__num" aria-hidden="true">{number}</span>
      <h3 className="principle-card__title">{title}</h3>
      <p className="principle-card__desc">{description}</p>
    </div>
  )
}
