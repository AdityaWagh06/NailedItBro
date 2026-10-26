import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Plays the authentic acoustic hammer-on-nail strike sound (/hammer_hit.wav)
 * with graceful fallback to high-fidelity Web Audio synthesis.
 */
function playHammerHitAudio() {
  try {
    const audio = new Audio('/hammer_hit.wav')
    audio.volume = 0.95
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        playHammerHitSfxFallback()
      })
    }
  } catch {
    playHammerHitSfxFallback()
  }
}

function playHammerHitSfxFallback() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    const now = ctx.currentTime

    // 1. Heavy bass impact thud (175Hz -> 38Hz)
    const thudOsc = ctx.createOscillator()
    const thudGain = ctx.createGain()
    thudOsc.type = 'sine'
    thudOsc.frequency.setValueAtTime(175, now)
    thudOsc.frequency.exponentialRampToValueAtTime(38, now + 0.12)
    thudGain.gain.setValueAtTime(0.9, now)
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)
    thudOsc.connect(thudGain)
    thudGain.connect(ctx.destination)
    thudOsc.start(now)
    thudOsc.stop(now + 0.15)

    // 2. High metallic ring / anvil clink
    const clinkOsc = ctx.createOscillator()
    const clinkGain = ctx.createGain()
    clinkOsc.type = 'triangle'
    clinkOsc.frequency.setValueAtTime(2580, now)
    clinkOsc.frequency.exponentialRampToValueAtTime(1750, now + 0.35)
    clinkGain.gain.setValueAtTime(0.7, now)
    clinkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38)
    clinkOsc.connect(clinkGain)
    clinkGain.connect(ctx.destination)
    clinkOsc.start(now)
    clinkOsc.stop(now + 0.4)

    // 3. High harmonic metallic ping (3890Hz)
    const pingOsc = ctx.createOscillator()
    const pingGain = ctx.createGain()
    pingOsc.type = 'sine'
    pingOsc.frequency.setValueAtTime(3890, now)
    pingOsc.frequency.exponentialRampToValueAtTime(3100, now + 0.28)
    pingGain.gain.setValueAtTime(0.45, now)
    pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    pingOsc.connect(pingGain)
    pingGain.connect(ctx.destination)
    pingOsc.start(now)
    pingOsc.stop(now + 0.32)
  } catch {
    // Audio gracefully ignored if disabled
  }
}

export default function TiltedLogoCard({
  imageSrc = '/mascot_head_nohammer.png',
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
  const [prefersReduced, setPrefersReduced] = useState(false)

  // Hammer & Nail Interactive Easter Egg state
  const [strikeState, setStrikeState] = useState('idle') // 'idle' | 'windup' | 'strike' | 'recoil'
  const [showNailed, setShowNailed] = useState(false)
  const [strikeKey, setStrikeKey] = useState(0)
  const [sparks, setSparks] = useState([])
  const strikeTimerRef = useRef(null)
  const nailedTimerRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener?.('change', handler)
    return () => {
      mq.removeEventListener?.('change', handler)
      clearTimeout(strikeTimerRef.current)
      clearTimeout(nailedTimerRef.current)
    }
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

  // Handle the "Hammer Strikes Nail" sequence
  const handleHammerStrike = useCallback(() => {
    // Clear any previous timers
    clearTimeout(strikeTimerRef.current)
    clearTimeout(nailedTimerRef.current)

    // Stage 1: Wind-up (The complete hammer pulls back into the air, nail pops up)
    setStrikeState('windup')

    strikeTimerRef.current = setTimeout(() => {
      // Stage 2: STRIKE IMPACT! (Hammer slams down on the nail!)
      setStrikeState('strike')
      setStrikeKey((k) => k + 1)
      setShowNailed(true)
      playHammerHitAudio()

      // Generate radial pixel spark particles
      const newSparks = Array.from({ length: 14 }).map((_, idx) => ({
        id: Math.random() + idx,
        angle: (idx * 25.7) + (Math.random() * 8 - 4),
        dist: Math.random() * 55 + 40,
        size: Math.random() * 4 + 3,
        color: idx % 3 === 0 ? '#FFFFFF' : idx % 2 === 0 ? '#FF5E14' : '#FBBF24',
      }))
      setSparks(newSparks)

      // Stage 3: Recoil bounce
      setTimeout(() => {
        setStrikeState('recoil')
      }, 180)

      // Stage 4: Reset hammer to resting position
      setTimeout(() => {
        setStrikeState('idle')
      }, 700)

      // Simple Nailed! text displays cleanly for 1.4s
      nailedTimerRef.current = setTimeout(() => {
        setShowNailed(false)
      }, 1400)
    }, 150)
  }, [])

  return (
    <div
      ref={cardRef}
      id="mascot-interactive-card"
      data-testid="mascot-card"
      className={`tilted-card-perspective ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleHammerStrike}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleHammerStrike()
        }
      }}
      aria-label="Click to hammer the nail and hear it nailed!"
    >
      <div
        id="mascot-card-inner"
        data-testid="mascot-card-inner"
        className={`tilted-card-inner ${isHovered ? 'is-hovered' : ''} ${
          strikeState === 'strike' ? 'is-hammer-hitting' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation()
          handleHammerStrike()
        }}
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

        {/* ===================================================================
            INTERACTIVE HAMMER & NAIL EASTER EGG OVERLAY
            =================================================================== */}
        <div className={`hammer-fx-container ${strikeState !== 'idle' ? 'is-active' : ''}`} aria-hidden="true">
          {/* The Pixel-Art Nail on Forehead Plate */}
          <div className={`hammer-fx-nail hammer-fx-nail--${strikeState}`}>
            <svg width="24" height="38" viewBox="0 0 24 38" fill="none">
              {/* Nail Head */}
              <rect x="2" y="0" width="20" height="6" fill="#141312" />
              <rect x="4" y="2" width="16" height="3" fill="#E2E8F0" />
              <rect x="6" y="2" width="6" height="2" fill="#FFFFFF" />
              {/* Nail Shank */}
              <rect x="8" y="6" width="8" height="24" fill="#141312" />
              <rect x="10" y="6" width="4" height="23" fill="#94A3B8" />
              <rect x="10" y="6" width="2" height="22" fill="#CBD5E1" />
              {/* Nail Point */}
              <rect x="9" y="30" width="6" height="4" fill="#141312" />
              <rect x="10" y="34" width="4" height="4" fill="#141312" />
            </svg>
          </div>

          {/* The EXACT Pixel-Art Mascot Hammer (winds back and strikes the nail) */}
          <div className={`hammer-fx-tool hammer-fx-tool--${strikeState}`}>
            <img
              src="/mascot_hammer.png"
              alt="Hammer"
              width="922"
              height="922"
              className="hammer-pixel-img"
              draggable="false"
            />
          </div>

          {/* Shockwave Blast Ring */}
          {strikeState === 'strike' && <div className="hammer-fx-shockwave" />}

          {/* Radial Sparks */}
          {strikeState === 'strike' &&
            sparks.map((spark) => (
              <div
                key={spark.id}
                className="hammer-fx-spark"
                style={{
                  '--angle': `${spark.angle}deg`,
                  '--dist': `${spark.dist}px`,
                  '--size': `${spark.size}px`,
                  '--color': spark.color,
                }}
              />
            ))}

          {/* Simple "Nailed!" Animation Text */}
          {showNailed && (
            <div className="simple-nailed-wrap" key={strikeKey}>
              <span className="simple-nailed-text">Nailed!</span>
            </div>
          )}
        </div>

        {/* 3D Floating Badge */}
        <div className="tilted-card-badge">
          <span className="tilted-badge-dot" aria-hidden="true" />
          <span className="tilted-badge-text">{badgeText}</span>
          <span className="tilted-badge-action" aria-hidden="true">
            {strikeState === 'idle' ? 'Click me!' : '✦'}
          </span>
        </div>
      </div>
    </div>
  )
}
