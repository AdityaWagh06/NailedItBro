import { useState, useEffect, useRef } from 'react'
import { m } from 'motion/react'
import HeroParticles from './HeroParticles'
import { scrollToTarget } from '../lib/useSmoothScroll'
import './GrowthHero.css'

export default function Hero({ ready }) {
  const modelViewerRef = useRef(null)
  const boxRef = useRef(null)

  // Interactive 3D Mascot pointer tracking (horizontal only) with slight upward face tilt
  useEffect(() => {
    let animId
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024
    const BASE_PHI = 97 // Tilted slightly back, looking upward
    const BASE_Y = 0.28 // Perfectly centered face & upper torso in the studio box

    let targetTheta = 0
    let currentTheta = 0
    let currentPhi = BASE_PHI
    let targetX = 0
    let currentX = 0
    let currentY = BASE_Y

    const updateFromPointer = (clientX) => {
      const box = boxRef.current
      const rect = box
        ? box.getBoundingClientRect()
        : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }

      // Reference horizontal center of the mascot inside the studio box
      const centerX = rect.left + rect.width * 0.5
      const dx = clientX - centerX

      // Normalized relative to half-viewport (-1.5 to 1.5 bounds)
      const normX = Math.max(-1.5, Math.min(1.5, dx / (window.innerWidth * 0.45)))

      // Horizontal tracking ONLY (left-right):
      // Negative theta rotates camera left, angling the front of the mascot towards the right (+X)
      targetTheta = -normX * 28

      // Subtle horizontal lean toward pointer
      targetX = normX * 0.025
    }

    const onMouseMove = (e) => {
      updateFromPointer(e.clientX)
    }

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        updateFromPointer(e.touches[0].clientX)
      }
    }

    const onMouseLeave = () => {
      targetTheta = 0
      targetX = 0
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave, { passive: true })

    // 60-120fps animation loop with smooth spring damping and subtle breathing
    const animate = (time) => {
      // Subtle organic breathing oscillation on theta and phi
      const breathTheta = Math.sin(time * 0.0016) * 1.5
      const breathPhi = Math.cos(time * 0.0012) * 0.6

      const effectiveTargetTheta = targetTheta + breathTheta
      const effectiveTargetPhi = BASE_PHI + breathPhi

      // Organic lerp damping (0.075 provides a natural weighted feel without lag)
      currentTheta += (effectiveTargetTheta - currentTheta) * 0.075
      currentPhi += (effectiveTargetPhi - currentPhi) * 0.075
      currentX += (targetX - currentX) * 0.075

      const el = modelViewerRef.current
      if (el) {
        el.setAttribute(
          'camera-orbit',
          `${currentTheta.toFixed(2)}deg ${currentPhi.toFixed(2)}deg 1.06m`
        )
        el.setAttribute(
          'camera-target',
          `${currentX.toFixed(3)}m ${BASE_Y.toFixed(3)}m 0m`
        )
      }

      if (isVisible) {
        animId = requestAnimationFrame(animate)
      }
    }

    let isVisible = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible
        isVisible = entry.isIntersecting
        if (isVisible && !wasVisible) {
          animId = requestAnimationFrame(animate)
        }
      },
      { threshold: 0.05 }
    )

    if (boxRef.current) observer.observe(boxRef.current)

    animId = requestAnimationFrame(animate)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  // Typing effect for the tagline
  const fullTagline = "Make it live. Make it loud."
  const [typedTagline, setTypedTagline] = useState("")

  useEffect(() => {
    let charIndex = 0
    let intervalId

    const startDelay = setTimeout(() => {
      intervalId = setInterval(() => {
        charIndex++
        setTypedTagline(fullTagline.slice(0, charIndex))
        if (charIndex >= fullTagline.length) {
          clearInterval(intervalId)
        }
      }, 55)
    }, 500)

    return () => {
      clearTimeout(startDelay)
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  return (
    <section className="growth-hero" id="top" aria-label="Nailed It Bro Digital Studio">
      {/* 1. Motion Grid Background */}
      <HeroParticles scrollProgress={0} />
      <div className="growth-hero__canvas-glow" aria-hidden="true" />

      {/* 2. SOBER MODERN HEADLINE */}
      <div className="growth-hero__title-wrap">
        <h1 className="growth-hero__title" aria-label="Nailed It Bro">
          <m.span
            className="growth-hero__word growth-hero__word--dark"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            NAILED
          </m.span>

          <m.span
            className="growth-hero__word growth-hero__word--orange"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.8, delay: 0.23, ease: [0.16, 1, 0.3, 1] }}
          >
            IT
          </m.span>

          <m.span
            className="growth-hero__word growth-hero__word--dark"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.8, delay: 0.31, ease: [0.16, 1, 0.3, 1] }}
          >
            BRO
          </m.span>
        </h1>

        <p className="growth-hero__tagline" aria-label={fullTagline}>
          <span>{typedTagline}</span>
          <span className="growth-hero__tagline-cursor" aria-hidden="true">|</span>
        </p>
      </div>

      {/* 3. MONUMENTAL RECTANGLE BOX WITH GLOWING STUDIO LIGHTING & OVERLAY UI */}
      <m.div
        ref={boxRef}
        className="growth-hero__mascot-box"
        initial={{ opacity: 0, y: 24, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Multi-tone ambient shine & studio vignette glow */}
        <div className="growth-hero__mascot-box-motion-bg" aria-hidden="true" />
        <div className="growth-hero__mascot-box-texture" aria-hidden="true" />
        <div className="growth-hero__mascot-box-glow" aria-hidden="true" />

        {/* Center 3D Mascot with Left-Right Tracking & Upward Tilt */}
        <model-viewer
          ref={modelViewerRef}
          src="/mascot.glb"
          poster="/avatar_front_clean.webp"
          alt="Nailed It Bro 3D Studio Mascot"
          camera-orbit="0deg 97deg 1.06m"
          camera-target="0m 0.28m 0m"
          field-of-view="28deg"
          min-camera-orbit="auto auto 0m"
          min-field-of-view="5deg"
          interaction-prompt="none"
          interpolation-decay="0"
          shadow-intensity="0"
          exposure="1.08"
          environment-image="neutral"
          loading="eager"
          reveal="auto"
          className="growth-hero__mascot-box-model"
        />

        {/* UI Overlay */}
        <div className="growth-hero__box-overlay">
          {/* Top Spacer to preserve vertical layout rhythm */}
          <div className="growth-hero__box-top-spacer" aria-hidden="true" />

          {/* Middle Row: Left Vibe + Right Quote (Brought down, aligned together) */}
          <div className="growth-hero__box-middle-row">
            {/* Left: Vibe statement (Exact same position, does not move) */}
            <m.div
              className="growth-hero__box-vibe"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="growth-hero__box-vibe-line1">
                We don't do<br />boring.
              </h2>
              <p className="growth-hero__box-vibe-line2">4 founders · All builders · Zero fluff</p>
            </m.div>

            {/* Right: Quote brought down to align horizontally with the left text */}
            <m.div
              className="growth-hero__box-right-quote-wrap"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="growth-hero__box-vibe-quote">
                “Code like artists.<br />
                Design like engineers.”
              </p>
            </m.div>
          </div>

          {/* Bottom Row: Pitch + Actions & Capability Pills */}
          <div className="growth-hero__box-bottom">
            {/* Left Column: Pitch & Actions */}
            <div className="growth-hero__box-pitch-col">
              <p className="growth-hero__box-pitch-text">
                Full-stack web engineering, fluid mobile apps &amp; autonomous AI systems — crafted to get you real customers.
              </p>

              <div className="growth-hero__box-actions">
                {/* Button 1: Vertical Rolling Text & Orange Morph */}
                <a
                  href="#contact"
                  className="growth-hero__box-btn-primary"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToTarget('#contact')
                  }}
                  aria-label="Start your project"
                >
                  <span className="growth-hero__btn-primary-roll">
                    <span className="growth-hero__btn-primary-roll-inner">
                      <span className="growth-hero__btn-primary-line growth-hero__btn-primary-line--top">
                        <span>Start your project</span>
                        <span className="growth-hero__btn-primary-arrow">↗</span>
                      </span>
                      <span className="growth-hero__btn-primary-line growth-hero__btn-primary-line--bottom" aria-hidden="true">
                        <span>Start your project</span>
                        <span className="growth-hero__btn-primary-arrow">↗</span>
                      </span>
                    </span>
                  </span>
                </a>

                {/* Button 2: Horizontal Left-to-Right Glass Fill & Morphing Arrow Badge */}
                <a
                  href="#work"
                  className="growth-hero__box-btn-secondary"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToTarget('#work')
                  }}
                  aria-label="Explore our work"
                >
                  <span className="growth-hero__btn-secondary-bg" aria-hidden="true" />
                  <span className="growth-hero__btn-secondary-label">Explore our work</span>
                  <span className="growth-hero__btn-secondary-badge" aria-hidden="true">
                    <span className="growth-hero__btn-secondary-arrow">↗</span>
                  </span>
                </a>
              </div>
            </div>

            {/* Right Column: Stacked Capability Pill Tags */}
            <div className="growth-hero__box-tags-col">
              <div className="growth-hero__box-tags-row">
                <span className="growth-hero__box-tag-pill">Websites</span>
                <span className="growth-hero__box-tag-pill">Games</span>
              </div>
              <span className="growth-hero__box-tag-pill">Mobile Apps</span>
              <span className="growth-hero__box-tag-pill">AI &amp; QR Automation</span>
              <span className="growth-hero__box-tag-pill">Social Media</span>
              <span className="growth-hero__box-tag-pill">CRM Dashboards</span>
            </div>
          </div>
        </div>
      </m.div>

      {/* 4. DEDICATED MOBILE & TABLET STORY + CTA FLOW (< 1024px) */}
      <div className="growth-hero__mobile-content">
        <div className="growth-hero__mobile-vibe">
          <h2 className="growth-hero__mobile-vibe-title">We don't do boring.</h2>
          <p className="growth-hero__mobile-vibe-sub">4 founders · All builders · Zero fluff</p>
          <p className="growth-hero__mobile-vibe-quote">“Code like artists. Design like engineers.”</p>
        </div>

        <p className="growth-hero__mobile-pitch">
          Full-stack web engineering, fluid mobile apps &amp; autonomous AI systems — crafted to get you real customers.
        </p>

        <div className="growth-hero__mobile-actions">
          <a
            href="#contact"
            className="growth-hero__mobile-btn-primary"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#contact')
            }}
            aria-label="Start your project"
          >
            <span>Start your project</span>
            <span className="growth-hero__mobile-btn-arrow">↗</span>
          </a>

          <a
            href="#work"
            className="growth-hero__mobile-btn-secondary"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#work')
            }}
            aria-label="Explore our work"
          >
            <span>Explore our work</span>
            <span className="growth-hero__mobile-btn-arrow">↗</span>
          </a>
        </div>

        <div className="growth-hero__mobile-tags">
          <span className="growth-hero__mobile-tag">Websites</span>
          <span className="growth-hero__mobile-tag">Games</span>
          <span className="growth-hero__mobile-tag">Mobile Apps</span>
          <span className="growth-hero__mobile-tag">AI &amp; QR Automation</span>
          <span className="growth-hero__mobile-tag">Social Media</span>
          <span className="growth-hero__mobile-tag">CRM Dashboards</span>
        </div>
      </div>
    </section>
  )
}
