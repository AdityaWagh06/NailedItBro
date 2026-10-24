import { useState, useRef, useEffect } from 'react'

export default function TiltedLogoCard({
  imageSrc = '/logo.jpeg',
  alt = 'Nailed It Bro Studio Mascot & Logo',
  badgeText = '4 founders, 1 team',
  maxTilt = 12,
  className = '',
}) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 240, y: 240 })
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isTapped, setIsTapped] = useState(false)
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  const handleMouseMove = (e) => {
    if (prefersReduced || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const tiltX = -((y - centerY) / centerY) * maxTilt
    const tiltY = ((x - centerX) / centerX) * maxTilt

    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100

    setTilt({ x: tiltX, y: tiltY })
    setMousePos({ x, y })
    setGlare({ x: glareX, y: glareY, opacity: 0.55 })
  }

  const handleMouseEnter = (e) => {
    if (prefersReduced) return
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
    setGlare((prev) => ({ ...prev, opacity: 0 }))
  }

  const handleClick = () => {
    setIsTapped(true)
    setTimeout(() => setIsTapped(false), 500)
  }

  return (
    <div
      ref={cardRef}
      className={`tilted-card-perspective ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="region"
      aria-label="Interactive Nailed It Bro Chroma Mascot"
    >
      <div
        className={`tilted-card-inner ${isHovered ? 'is-hovered' : ''} ${isTapped ? 'is-tapped' : ''}`}
        style={{
          transform: prefersReduced
            ? 'none'
            : isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.03, 1.03, 1.03)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        }}
      >
        {/* Specular Light Sheen */}
        <div
          className="tilted-card-glare"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.75) 0%, rgba(255, 94, 20, 0.2) 28%, transparent 65%)`,
            opacity: glare.opacity,
          }}
          aria-hidden="true"
        />

        {/* Chroma Chromatic Halo Ring around cursor */}
        {isHovered && !prefersReduced && (
          <div
            className="tilted-chroma-halo"
            style={{
              transform: `translate3d(${mousePos.x - 140}px, ${mousePos.y - 140}px, 0)`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Mascot Media: Dual-Layer Chroma System (B&W Base + Color Spotlight Reveal) */}
        <div className="tilted-card-media">
          {/* Base Layer: Crisp Black & White */}
          <img
            src={imageSrc}
            alt={alt}
            width={480}
            height={480}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="tilted-card-img tilted-card-img--bw"
          />

          {/* Top Layer: Full Color revealed via cursor spotlight mask */}
          <div
            className={`tilted-chroma-color-reveal ${isHovered ? 'is-active' : ''}`}
            style={{
              WebkitMaskImage: prefersReduced
                ? 'none'
                : isHovered
                ? `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, black 35%, transparent 100%)`
                : 'none',
              maskImage: prefersReduced
                ? 'none'
                : isHovered
                ? `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, black 35%, transparent 100%)`
                : 'none',
            }}
            aria-hidden="true"
          >
            <img
              src={imageSrc}
              alt=""
              width={480}
              height={480}
              decoding="async"
              className="tilted-card-img tilted-card-img--color"
            />
          </div>
        </div>

        {/* 3D Floating Badge */}
        <div className="tilted-card-badge">
          <span className="tilted-badge-dot" aria-hidden="true" />
          <span className="tilted-badge-text">{badgeText}</span>
          <span className="tilted-badge-action" aria-hidden="true">✦</span>
        </div>

        {/* Ambient Corner Sparks on Click */}
        {isTapped && (
          <div className="tilted-tap-spark" aria-hidden="true">
            <span>Nailed!</span>
          </div>
        )}
      </div>
    </div>
  )
}
