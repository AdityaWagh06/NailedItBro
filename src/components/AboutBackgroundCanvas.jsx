import { useEffect, useRef } from 'react'

/**
 * AboutBackgroundCanvas
 * High-performance, living dynamic background canvas for the About page.
 * Features:
 * - Fluid, warm radiant light orbs that continuously drift and morph
 * - Ambient floating micro-spark particles drifting gently upwards
 * - Interactive cursor glow & soft particle deflection
 * - Cohesive warm studio palette (rich orange, warm amber, soft peach, glowing cream)
 * - 60fps lightweight canvas rendering with low CPU overhead
 */
export default function AboutBackgroundCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Mouse tracking with smooth lerp
    const mouse = {
      x: width * 0.5,
      y: height * 0.35,
      targetX: width * 0.5,
      targetY: height * 0.35,
      radius: 260,
      active: false,
    }

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize, { passive: true })

    // 4 Dynamic Luminous Ambient Nodes (Living Studio Mesh)
    const orbs = [
      {
        baseX: 0.18,
        baseY: 0.16,
        radius: 460,
        color: 'rgba(255, 94, 20, 0.22)', // Brand Studio Orange
        speedX: 0.0052,
        speedY: 0.0042,
        ampX: 180,
        ampY: 130,
        phase: 0,
      },
      {
        baseX: 0.84,
        baseY: 0.32,
        radius: 480,
        color: 'rgba(255, 145, 77, 0.20)', // Soft Apricot
        speedX: 0.0044,
        speedY: 0.0058,
        ampX: 190,
        ampY: 140,
        phase: Math.PI * 0.5,
      },
      {
        baseX: 0.32,
        baseY: 0.74,
        radius: 500,
        color: 'rgba(251, 191, 36, 0.18)', // Warm Golden Amber
        speedX: 0.0058,
        speedY: 0.0046,
        ampX: 160,
        ampY: 130,
        phase: Math.PI,
      },
      {
        baseX: 0.86,
        baseY: 0.82,
        radius: 460,
        color: 'rgba(255, 120, 50, 0.19)', // Vibrant Peach Ember
        speedX: 0.0048,
        speedY: 0.0062,
        ampX: 170,
        ampY: 150,
        phase: Math.PI * 1.5,
      },
    ]

    // 42 Floating Studio Micro-Particles (Warm atmospheric dust/sparks)
    const particleCount = prefersReducedMotion ? 0 : 42
    const particles = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.8 + 1.4,
        baseSpeedY: -(Math.random() * 0.7 + 0.4),
        swaySpeed: Math.random() * 0.015 + 0.008,
        swayAmp: Math.random() * 2.0 + 0.8,
        phase: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.45 + 0.25,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        // Brand orange or golden amber
        color: Math.random() > 0.4 ? '255, 94, 20' : '245, 158, 11',
      })
    }

    let time = 0

    const render = () => {
      time += 1

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08
      mouse.y += (mouse.targetY - mouse.y) * 0.08

      ctx.clearRect(0, 0, width, height)

      // 1. Draw Living Ambient Radiant Nodes
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i]
        // Calculate dynamic drifting position
        const motionFactor = prefersReducedMotion ? 0.1 : 1
        const ox =
          orb.baseX * width +
          Math.sin(time * orb.speedX * motionFactor + orb.phase) * orb.ampX
        const oy =
          orb.baseY * height +
          Math.cos(time * orb.speedY * motionFactor + orb.phase) * orb.ampY

        // Subtle mouse pull
        const dx = mouse.x - ox
        const dy = mouse.y - oy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const pull = mouse.active ? Math.max(0, 1 - dist / 800) * 35 : 0

        const finalX = ox + (dist > 0 ? (dx / dist) * pull : 0)
        const finalY = oy + (dist > 0 ? (dy / dist) * pull : 0)

        // Pulsing radius
        const r = orb.radius + Math.sin(time * 0.015 + orb.phase) * 25

        const gradient = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, r)
        gradient.addColorStop(0, orb.color)
        gradient.addColorStop(0.5, orb.color.replace(/[\d\.]+\)$/, '0.08)'))
        gradient.addColorStop(1, 'rgba(250, 247, 242, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(finalX, finalY, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. Interactive Cursor Flashlight (Soft warm spotlight)
      if (mouse.active && !prefersReducedMotion) {
        const spotGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius
        )
        spotGrad.addColorStop(0, 'rgba(255, 94, 20, 0.16)')
        spotGrad.addColorStop(0.4, 'rgba(255, 145, 77, 0.06)')
        spotGrad.addColorStop(1, 'rgba(255, 94, 20, 0)')

        ctx.fillStyle = spotGrad
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // 3. Floating Studio Ambient Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Drift upwards
        p.y += p.baseSpeedY
        p.x += Math.sin(time * p.swaySpeed + p.phase) * p.swayAmp

        // Mouse deflection
        const pdx = p.x - mouse.x
        const pdy = p.y - mouse.y
        const pdist = Math.sqrt(pdx * pdx + pdy * pdy)
        if (pdist < 140 && mouse.active) {
          const force = (1 - pdist / 140) * 2.2
          p.x += (pdx / pdist) * force
          p.y += (pdy / pdist) * force
        }

        // Wrap around screen
        if (p.y < -20) {
          p.y = height + 20
          p.x = Math.random() * width
        } else if (p.y > height + 20) {
          p.y = -20
        }
        if (p.x < -20) p.x = width + 20
        else if (p.x > width + 20) p.x = -20

        // Pulsing alpha
        const currentAlpha = p.alpha + Math.sin(time * p.pulseSpeed + p.phase) * 0.12

        ctx.fillStyle = `rgba(${p.color}, ${Math.max(0.08, currentAlpha)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="about-living-canvas"
      aria-hidden="true"
    />
  )
}
