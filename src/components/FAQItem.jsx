import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQItem({ question, answer, id, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = `faq-content-${id}`
  const buttonId = `faq-btn-${id}`

  return (
    <div className={`faq-accordion-item ${isOpen ? 'is-open' : ''}`}>
      <button
        id={buttonId}
        type="button"
        className="faq-accordion-trigger"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="faq-question-text">{question}</span>
        <ChevronDown
          size={20}
          className={`faq-chevron ${isOpen ? 'faq-chevron--rotated' : ''}`}
          aria-hidden="true"
        />
      </button>

      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        className="faq-accordion-panel"
        hidden={!isOpen}
      >
        <div className="faq-accordion-content">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  )
}
