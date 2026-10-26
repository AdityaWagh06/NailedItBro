import { useEffect, useState, useRef } from 'react'

export default function StatItem({
  number,
  targetValue,
  prefix = '',
  suffix = '',
  label,
  note,
}) {
  const ref = useRef(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  // Parse numeric target from props or string
  const numericTarget =
    targetValue !== undefined
      ? targetValue
      : parseInt(String(number).replace(/[^0-9]/g, ''), 10) || 0

  // Extract prefix and suffix if not explicitly given
  let finalPrefix = prefix
  let finalSuffix = suffix
  if (number && !prefix && !suffix) {
    const match = String(number).match(/^([^0-9]*)([0-9]+)([^0-9]*)$/)
    if (match) {
      finalPrefix = match[1]
      finalSuffix = match[3]
    }
  }

  const [count, setCount] = useState(0)

  // IntersectionObserver to trigger animation when scrolled into view
  useEffect(() => {
    const el = ref.current
    if (!el) return

    // If reduced motion is preferred, show target immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(numericTarget)
      setIsFinished(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [numericTarget])

  // Snappy, fluid rolling count-up with zero sticking at the end
  useEffect(() => {
    if (!hasStarted || !numericTarget || isFinished) return

    let startTime = null
    let animationFrameId
    const duration = 850 // 850ms snappy animation

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Cubic Ease-Out: starts briskly and decelerates naturally
      const easeOut = 1 - Math.pow(1 - progress, 3)

      // Snap straight to final target at 88% progress to guarantee zero hanging on 3, 23, or 99
      if (progress >= 0.88) {
        setCount(numericTarget)
        setIsFinished(true)
        return
      }

      const currentVal = Math.round(easeOut * numericTarget)
      if (currentVal >= numericTarget) {
        setCount(numericTarget)
        setIsFinished(true)
        return
      }

      setCount(currentVal)
      animationFrameId = requestAnimationFrame(step)
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [hasStarted, numericTarget, isFinished])

  // Display value formatting
  const displayNum = isFinished
    ? (number || `${finalPrefix}${numericTarget}${finalSuffix}`)
    : `${finalPrefix}${count}${finalSuffix}`

  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-item__num-wrap">
        <span className="stat-item__num">{displayNum}</span>
      </div>

      <p className="stat-item__label">{label}</p>
      {note && <span className="stat-item__note">{note}</span>}
    </div>
  )
}
