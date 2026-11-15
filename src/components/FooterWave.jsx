import { useEffect, useRef } from 'react'

/**
 * FooterWave — Full-Screen Continuous Living Amber Silk & Flame Motion
 *
 * Characteristics:
 * - Full-screen immersive canvas (100vh) matching the extended full-screen footer.
 * - Continuous, hypnotic, visible autonomous motion that never stops.
 * - Multi-harmonic traveling liquid silk waves, billowing 3D amber crests,
 *   dancing smoke tendrils, and ambient rising ember micro-sparks.
 * - Protects the central brand mark: The wave gracefully dips in the center,
 *   leaving "Nailed It Bro" floating boldly in clean, deep obsidian black.
 */
export default function FooterWave() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId = null
    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      active: false,
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.targetX = e.clientX - rect.left
      mouse.targetY = e.clientY - rect.top
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
    }

    const parent = canvas.closest('.footer') || canvas.parentElement
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove, { passive: true })
      parent.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    }

    // ── Floating Ambient Ember Particles ──
    const sparkCount = 26
    const sparks = Array.from({ length: sparkCount }, () => ({
      x: Math.random(),
      y: 0.6 + Math.random() * 0.4,
      size: 1.0 + Math.random() * 1.8,
      speedY: 0.04 + Math.random() * 0.07,
      speedX: (Math.random() - 0.5) * 0.03,
      alpha: 0.2 + Math.random() * 0.6,
      fadeSpeed: 0.2 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
    }))

    // ── Traveling Ribbon Layers ──
    const ribbonLayers = [
      // 1. Atmospheric Deep Amber Silhouette (Back volume)
      {
        speed: 0.55,
        phase: 0.0,
        thickness: 130,
        blur: 22,
        fillTop: 'rgba(255, 94, 20, 0.16)',
        fillBot: 'rgba(30, 8, 2, 0.0)',
        hasSpine: false,
        swaySpeed: 0.6,
        swayAmp: 0.040,
        breatheSpeed: 0.8,
        breatheAmp: 30,
        peak1Amp: 160,
        peak2Amp: 230,
      },
      // 2. Translucent Studio Orange Living Silk Body (Midground)
      {
        speed: -0.75,
        phase: 1.8,
        thickness: 85,
        blur: 10,
        fillTop: 'rgba(255, 120, 40, 0.26)',
        fillBot: 'rgba(50, 14, 3, 0.0)',
        hasSpine: false,
        swaySpeed: 0.85,
        swayAmp: 0.032,
        breatheSpeed: 1.0,
        breatheAmp: 36,
        peak1Amp: 175,
        peak2Amp: 250,
      },
      // 3. Foreground Radiant Silk Fold (Catching glowing key light)
      {
        speed: 0.95,
        phase: 3.4,
        thickness: 55,
        blur: 3.5,
        fillTop: 'rgba(255, 150, 70, 0.35)',
        fillBot: 'rgba(70, 18, 4, 0.0)',
        hasSpine: true,
        spineColor: 'rgba(255, 195, 120, 0.75)',
        spineWidth: 1.5,
        spineShadow: 12,
        swaySpeed: 1.1,
        swayAmp: 0.026,
        breatheSpeed: 1.25,
        breatheAmp: 34,
        peak1Amp: 190,
        peak2Amp: 280,
      },
    ]

    const getWaveY = (x, t, layer, baselineY) => {
      const normX = x / width

      // Center Dip: Dips down towards lower baseline under "Nailed It Bro" (~0.20 to ~0.70)
      const centerDip = Math.exp(-Math.pow((normX - 0.46) / 0.19, 2)) * 48

      // Right Billow: Swells into tall 3D living silk folds past "Bro" (normX > 0.66)
      const rightEnv = Math.pow(Math.max(0, (normX - 0.66) / 0.34), 1.25)

      // Continuous traveling harmonic undulation along the ribbon
      const travelingWave =
        Math.sin(normX * 9.0 - t * layer.speed * 2.2 + layer.phase) * (20 * rightEnv + 8) +
        Math.cos(normX * 18.0 + t * layer.speed * 1.8 + layer.phase) * (12 * rightEnv + 4)

      // Living swaying peak centers and breathing amplitudes
      const fold1Center = 0.78 + Math.sin(t * layer.swaySpeed + layer.phase) * layer.swayAmp
      const fold2Center = 0.89 + Math.cos(t * (layer.swaySpeed * 0.8) + layer.phase * 1.2) * (layer.swayAmp * 0.8)

      const fold1Height = (layer.peak1Amp + Math.sin(t * layer.breatheSpeed + layer.phase) * layer.breatheAmp) * rightEnv
      const fold2Height = (layer.peak2Amp + Math.cos(t * (layer.breatheSpeed * 0.85) + layer.phase * 0.7) * (layer.breatheAmp * 1.15)) * rightEnv

      const valleyCenter = (fold1Center + fold2Center) * 0.5
      const foldTrough = Math.exp(-Math.pow((normX - valleyCenter) / 0.045, 2)) * (70 + Math.sin(t * 1.1) * 20) * rightEnv

      const fold1 = Math.exp(-Math.pow((normX - fold1Center) / 0.058, 2)) * fold1Height
      const fold2 = Math.exp(-Math.pow((normX - fold2Center) / 0.068, 2)) * fold2Height

      // Left-side gentle horizon drift
      const leftEnv = Math.max(0, 1.0 - normX / 0.28)
      const leftMotion = Math.sin(normX * 6.0 - t * 0.9 + layer.phase) * 10 * leftEnv

      // Interactive mouse deflection
      let mouseOffset = 0
      if (mouse.active) {
        const dx = x - mouse.x
        const dist = Math.abs(dx)
        if (dist < 260) {
          const factor = Math.cos((dist / 260) * (Math.PI / 2)) * 24
          const sign = mouse.y > baselineY ? -1 : 1
          mouseOffset = sign * factor
        }
      }

      const totalOffset =
        centerDip -
        (fold1 + fold2 - foldTrough) -
        travelingWave -
        leftMotion +
        mouseOffset

      return baselineY + totalOffset
    }

    let time = 0
    let lastTime = performance.now()

    const draw = (t, dt) => {
      ctx.clearRect(0, 0, width, height)

      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08
        mouse.y += (mouse.targetY - mouse.y) * 0.08
      }

      // Baseline sits in the lower quadrant of full screen (~100px above bottom border)
      const baselineY = height - 90
      const step = 8

      ctx.save()

      // ── 1. BREATHING AMBIENT WARMTH IN RIGHT QUADRANT ──
      ctx.save()
      const glowPulse = 1.0 + Math.sin(t * 1.3) * 0.2
      const ambientGlow = ctx.createRadialGradient(
        width * 0.85,
        baselineY - 180 + Math.sin(t * 0.8) * 20,
        20,
        width * 0.85,
        baselineY - 180,
        width * 0.32 * glowPulse
      )
      ambientGlow.addColorStop(0, 'rgba(255, 94, 20, 0.18)')
      ambientGlow.addColorStop(0.45, 'rgba(180, 55, 10, 0.06)')
      ambientGlow.addColorStop(1, 'rgba(30, 8, 2, 0.0)')
      ctx.fillStyle = ambientGlow
      ctx.fillRect(0, 0, width, height)
      ctx.restore()

      // ── 2. VOLUMETRIC LIVING SILK SMOKE LAYERS ──
      ribbonLayers.forEach((layer) => {
        const topPts = []
        const botPts = []
        const spinePts = []

        for (let x = -30; x <= width + 30; x += step) {
          const y = getWaveY(x, t, layer, baselineY)
          const halfThick = layer.thickness * 0.5

          topPts.push({ x, y: y - halfThick })
          botPts.push({ x, y: y + halfThick })
          spinePts.push({ x, y })
        }

        ctx.save()
        if (layer.blur > 0) {
          ctx.filter = `blur(${layer.blur}px)`
        }

        ctx.beginPath()
        ctx.moveTo(topPts[0].x, topPts[0].y)
        for (let i = 1; i < topPts.length; i++) {
          const xc = (topPts[i].x + topPts[i - 1].x) / 2
          const yc = (topPts[i].y + topPts[i - 1].y) / 2
          ctx.quadraticCurveTo(topPts[i - 1].x, topPts[i - 1].y, xc, yc)
        }
        ctx.lineTo(topPts[topPts.length - 1].x, topPts[topPts.length - 1].y)

        for (let i = botPts.length - 1; i >= 0; i--) {
          const xc = i > 0 ? (botPts[i].x + botPts[i - 1].x) / 2 : botPts[0].x
          const yc = i > 0 ? (botPts[i].y + botPts[i - 1].y) / 2 : botPts[0].y
          ctx.quadraticCurveTo(botPts[i].x, botPts[i].y, xc, yc)
        }
        ctx.closePath()

        const smokeGrad = ctx.createLinearGradient(0, baselineY - 320, 0, baselineY + 60)
        smokeGrad.addColorStop(0, layer.fillTop)
        smokeGrad.addColorStop(0.5, layer.fillTop)
        smokeGrad.addColorStop(1, layer.fillBot)
        ctx.fillStyle = smokeGrad
        ctx.fill()
        ctx.restore()

        // ── 3. DELICATE CREST HIGHLIGHT (ONLY ON THE RIGHT FOLDS, ZERO HARSH LINES UNDER LOGO) ──
        if (layer.hasSpine) {
          ctx.save()
          const startIdx = Math.max(0, Math.floor((width * 0.70) / step))
          if (startIdx < spinePts.length) {
            ctx.beginPath()
            ctx.moveTo(spinePts[startIdx].x, spinePts[startIdx].y)
            for (let i = startIdx + 1; i < spinePts.length; i++) {
              const xc = (spinePts[i].x + spinePts[i - 1].x) / 2
              const yc = (spinePts[i].y + spinePts[i - 1].y) / 2
              ctx.quadraticCurveTo(spinePts[i - 1].x, spinePts[i - 1].y, xc, yc)
            }
            ctx.lineTo(spinePts[spinePts.length - 1].x, spinePts[spinePts.length - 1].y)

            const spineGrad = ctx.createLinearGradient(width * 0.70, 0, width, 0)
            spineGrad.addColorStop(0, 'rgba(255, 140, 50, 0.0)')
            spineGrad.addColorStop(0.35, layer.spineColor)
            spineGrad.addColorStop(0.85, 'rgba(255, 215, 150, 0.85)')
            spineGrad.addColorStop(1, 'rgba(255, 140, 50, 0.0)')

            ctx.lineWidth = layer.spineWidth
            ctx.strokeStyle = spineGrad
            ctx.shadowColor = '#FF5E14'
            ctx.shadowBlur = layer.spineShadow
            ctx.stroke()
          }
          ctx.restore()
        }
      })

      // ── 4. AUTONOMOUS LIVING SMOKE TENDRILS (Swirling & morphing in continuous motion) ──
      // Primary Tendril
      ctx.save()
      ctx.beginPath()
      const tStartX = width * (0.75 + Math.sin(t * 0.9) * 0.02)
      const tStartY = baselineY - 15
      ctx.moveTo(tStartX, tStartY)
      const c1X = width * (0.80 + Math.sin(t * 1.3) * 0.04)
      const c1Y = baselineY - 120 + Math.sin(t * 1.6) * 28
      const c2X = width * (0.87 + Math.cos(t * 1.1) * 0.035)
      const c2Y = baselineY - 210 + Math.cos(t * 1.4) * 32
      const tEndX = width * (0.94 + Math.sin(t * 0.95) * 0.025)
      const tEndY = baselineY - 290 + Math.cos(t * 1.2) * 22
      ctx.bezierCurveTo(c1X, c1Y, c2X, c2Y, tEndX, tEndY)

      ctx.lineWidth = 1.1
      ctx.strokeStyle = 'rgba(255, 165, 85, 0.40)'
      ctx.shadowColor = '#FF5E14'
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.restore()

      // Secondary Tendril
      ctx.save()
      ctx.beginPath()
      const pStartX = width * (0.78 + Math.cos(t * 0.85) * 0.025)
      const pStartY = baselineY - 130 + Math.sin(t * 1.4) * 18
      ctx.moveTo(pStartX, pStartY)
      const pc1X = width * (0.83 + Math.cos(t * 1.3) * 0.03)
      const pc1Y = baselineY - 200 + Math.cos(t * 1.7) * 22
      const pc2X = width * (0.89 + Math.sin(t * 1.1) * 0.03)
      const pc2Y = baselineY - 280 + Math.sin(t * 1.3) * 24
      const pEndX = width * (0.93 + Math.cos(t * 0.8) * 0.02)
      const pEndY = baselineY - 350
      ctx.bezierCurveTo(pc1X, pc1Y, pc2X, pc2Y, pEndX, pEndY)

      ctx.lineWidth = 0.8
      ctx.strokeStyle = 'rgba(255, 140, 60, 0.28)'
      ctx.shadowColor = '#FF5E14'
      ctx.shadowBlur = 8
      ctx.stroke()
      ctx.restore()

      // ── 5. AMBIENT RISING EMBER SPARKS (Alive, continuous kinetic atmosphere) ──
      ctx.save()
      sparks.forEach((s) => {
        // Continuous upward drift
        s.y -= s.speedY * dt * 0.8
        s.x += Math.sin(t * 1.2 + s.phase) * s.speedX * dt * 0.6

        // Respawn at bottom when drifting past top
        if (s.y < 0.25) {
          s.y = 0.85 + Math.random() * 0.15
          s.x = 0.65 + Math.random() * 0.35 // concentrated in the warm right quadrant
        }

        const sx = s.x * width
        const sy = s.y * height
        const sparkAlpha = (Math.sin(t * 2.0 + s.phase) * 0.3 + 0.7) * s.alpha

        ctx.beginPath()
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 175, 80, ${sparkAlpha})`
        ctx.shadowColor = '#FF5E14'
        ctx.shadowBlur = 6
        ctx.fill()
      })
      ctx.restore()

      // ── 6. SEAMLESS HORIZONTAL EDGE VIGNETTE ──
      const edgeMask = ctx.createLinearGradient(0, 0, width, 0)
      edgeMask.addColorStop(0, 'rgba(0, 0, 0, 0)')
      edgeMask.addColorStop(0.10, 'rgba(0, 0, 0, 1)')
      edgeMask.addColorStop(0.90, 'rgba(0, 0, 0, 1)')
      edgeMask.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.globalCompositeOperation = 'destination-in'
      ctx.fillStyle = edgeMask
      ctx.fillRect(0, 0, width, height)

      ctx.restore()
    }

    const loop = (currentTime) => {
      // Run continuously without stopping
      animId = requestAnimationFrame(loop)
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05)
      lastTime = currentTime
      time += dt
      draw(time, dt)
    }

    lastTime = performance.now()
    animId = requestAnimationFrame(loop)

    return () => {
      if (animId) cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove)
        parent.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="footer__wave"
      aria-hidden="true"
    />
  )
}
