import { useEffect, useState, useRef } from 'react'

export default function StatItem({
  number,
  targetValue,
  prefix = '',
  suffix = '',
  label,
  note,
  isPlaceholder = false,
}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [count, setCount] = useState(0)

  // Determine target number to count to
  const numericTarget = targetValue !== undefined
    ? targetValue
    : parseInt(String(number).replace(/[^0-9]/g, ''), 10) || 0

  // Scroll trigger with IntersectionObserver
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Silky smooth rolling count-up
  useEffect(() => {
    if (!isVisible || !numericTarget) return

    let startTime = null
    let animationFrameId
    const duration = 1500 // 1.5 seconds smooth roll

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Natural ease-out exponential deceleration
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const currentVal = Math.floor(easeOut * numericTarget)

      setCount(currentVal)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        setCount(numericTarget)
      }
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isVisible, numericTarget])

  const formattedDisplay = isVisible
    ? `${prefix}${count}${suffix}`
    : `${prefix}0${suffix}`

  const finalNumberString = numericTarget > 0 ? formattedDisplay : number

  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-item__num-wrap">
        <span className="stat-item__num">{finalNumberString}</span>
      </div>

      <p className="stat-item__label">{label}</p>
      {note && <span className="stat-item__note">{note}</span>}
    </div>
  )
}
