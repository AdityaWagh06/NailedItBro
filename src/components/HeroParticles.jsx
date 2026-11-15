import { useEffect, useRef } from 'react'

/**
 * Infinite Slow-Moving Architectural Pattern Background
 * Clean, modern aesthetic design grid (hairline lines + intersection micro-markers)
 * continuously and seamlessly drifting at a soothing, slow diagonal pace.
 * Provides a distinct, unmistakable pattern motion background without pulling
 * visual focus away from the mascot and typography.
 */
export default function HeroParticles({ scrollProgress = 0 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1

    const setupSize = () => {
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
    }
    setupSize()

    let width = canvas.width
    let height = canvas.height

    const handleResize = () => {
      if (!canvas) return
      setupSize()
      width = canvas.width
      height = canvas.height
    }
    window.addEventListener('resize', handleResize)

    // Smooth mouse coordinates for gentle ambient spotlight interactivity
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.targetX = (e.clientX - rect.left) * dpr
      mouse.targetY = (e.clientY - rect.top) * dpr
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Pattern configuration
    const spacing = 48 * dpr       // Grid cell size
    const crossSize = 3 * dpr      // Size of intersection cross (+)
    const lineWidth = 0.85 * dpr   // Fine hairline width
    const driftSpeed = 0.28 * dpr  // Soothing, slow drift velocity per frame

    let offsetX = 0
    let offsetY = 0
    let time = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // 1. Progress seamless drift
      offsetX = (offsetX + driftSpeed) % spacing
      offsetY = (offsetY + driftSpeed) % spacing
      time += 0.005

      // Mouse easing
      if (mouse.active) {
        if (mouse.x === -1000) {
          mouse.x = mouse.targetX
          mouse.y = mouse.targetY
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.04
          mouse.y += (mouse.targetY - mouse.y) * 0.04
        }
      }

      // Slow-traveling warm ambient illumination beam
      const lightX = width * 0.5 + Math.sin(time * 0.6) * (width * 0.32)
      const lightY = height * 0.52 + Math.cos(time * 0.45) * (height * 0.25)
      const lightRadius = 420 * dpr

      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'

      // =====================================================================
      // DRAW MOVING ARCHITECTURAL GRID LINES
      // =====================================================================
      // Vertical lines
      for (let x = offsetX - spacing; x <= width + spacing; x += spacing) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)

        // Calculate proximity to warm ambient spotlight
        const dx = Math.abs(x - lightX)
        const lightFactor = Math.max(0, 1 - dx / lightRadius)
        const alpha = 0.045 + lightFactor * 0.06

        if (lightFactor > 0.15) {
          ctx.strokeStyle = `rgba(255, 94, 20, ${alpha * 1.2})`
        } else {
          ctx.strokeStyle = `rgba(35, 30, 26, ${alpha})`
        }
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = offsetY - spacing; y <= height + spacing; y += spacing) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)

        const dy = Math.abs(y - lightY)
        const lightFactor = Math.max(0, 1 - dy / lightRadius)
        const alpha = 0.045 + lightFactor * 0.06

        if (lightFactor > 0.15) {
          ctx.strokeStyle = `rgba(255, 94, 20, ${alpha * 1.2})`
        } else {
          ctx.strokeStyle = `rgba(35, 30, 26, ${alpha})`
        }
        ctx.stroke()
      }

      // =====================================================================
      // DRAW MOVING INTERSECTION CROSSHAIRS (+) & ACCENT DOTS
      // =====================================================================
      for (let x = offsetX - spacing; x <= width + spacing; x += spacing) {
        for (let y = offsetY - spacing; y <= height + spacing; y += spacing) {
          const dx = x - lightX
          const dy = y - lightY
          const dist = Math.hypot(dx, dy)
          const lightGlow = Math.max(0, 1 - dist / lightRadius)

          let mouseGlow = 0
          if (mouse.active) {
            const mdx = x - mouse.x
            const mdy = y - mouse.y
            const mDist = Math.hypot(mdx, mdy)
            const mRadius = 160 * dpr
            mouseGlow = Math.max(0, 1 - mDist / mRadius)
          }

          const combinedGlow = lightGlow * 0.28 + mouseGlow * 0.35
          const markerAlpha = 0.07 + combinedGlow

          if (combinedGlow > 0.06) {
            ctx.strokeStyle = `rgba(255, 94, 20, ${Math.min(markerAlpha, 0.45)})`
            ctx.fillStyle = `rgba(255, 94, 20, ${Math.min(markerAlpha, 0.45)})`
          } else {
            ctx.strokeStyle = `rgba(30, 26, 22, ${markerAlpha})`
            ctx.fillStyle = `rgba(30, 26, 22, ${markerAlpha})`
          }

          // Intersection precision micro-cross (+)
          ctx.beginPath()
          ctx.moveTo(x - crossSize, y)
          ctx.lineTo(x + crossSize, y)
          ctx.moveTo(x, y - crossSize)
          ctx.lineTo(x, y + crossSize)
          ctx.stroke()
        }
      }

      if (isVisible) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    let isVisible = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible
        isVisible = entry.isIntersecting
        if (isVisible && !wasVisible) {
          animationFrameId = requestAnimationFrame(render)
        }
      },
      { threshold: 0.02 }
    )
    observer.observe(canvas)

    animationFrameId = requestAnimationFrame(render)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="hero-motion-particles-canvas"
      aria-hidden="true"
      style={{
        opacity: Math.max(1 - scrollProgress * 3.5, 0),
      }}
    />
  )
}
