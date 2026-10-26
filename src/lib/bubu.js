/**
 * Bubu's body: walking, physics, moods and the looping "flow" of actions.
 * Plain DOM work in one rAF loop so React never re-renders per frame.
 */

const rand = (a, b) => a + Math.random() * (b - a)
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

export function createBubu({ pet, lean, flip, mascot, pupils, hint }, { onTap, reduced }) {
  let W = 104, H = 116, pad = 18, lift = 0
  let x = 0, y = 0, vx = 0, vy = 0 // y is height above the ground
  let mode = 'ground' // ground | air | drag
  let target = null, speed = 1.5, facing = -1
  let open = false, busy = false, asleep = false, napping = false, spinning = false
  let lastActivity = performance.now()
  let squash = 0, lag = 0, lagV = 0, tilt = 0, tiltV = 0, dragTilt = 0
  let pointer = null, pointerAt = 0, lookOverride = null
  let raf = 0, alive = true
  const timers = new Set()
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); if (alive) fn() }, ms); timers.add(id); return id }

  function measure() {
    const r = pet.getBoundingClientRect()
    W = r.width; H = r.height
    const css = getComputedStyle(pet)
    pad = parseFloat(css.getPropertyValue('--bubu-pad')) || 18
    lift = parseFloat(css.getPropertyValue('--bubu-lift')) || 0
  }
  const vw = () => document.documentElement.clientWidth
  const maxX = () => vw() - W - pad
  const maxY = () => window.innerHeight - H - pad * 2 - lift

  // ---------- moods & one-off actions ----------
  let moodTimer
  function setMood(m, ms) {
    clearTimeout(moodTimer)
    mascot.dataset.mood = m
    if (ms) moodTimer = later(() => setMood(asleep ? 'sleepy' : 'normal'), ms)
  }
  function action(cls, ms) {
    pet.classList.remove(cls); void pet.offsetWidth; pet.classList.add(cls)
    busy = true
    later(() => { pet.classList.remove(cls); busy = false }, ms)
  }
  const dance = () => { setMood('happy', 1400); action('bubu--dance', 1300) }
  const wave = () => { setMood('happy', 1700); action('bubu--wave', 1700) }
  function jump(power = 11) {
    if (mode !== 'ground' || reduced) return
    mode = 'air'; vy = power; vx = facing * rand(0, 2); squash = 0.12
  }
  function face(dir) { if (dir) { facing = dir; flip.classList.toggle('is-left', dir < 0) } }
  function lookAround() {
    lookOverride = { x: -5, y: 0 }
    later(() => { lookOverride = { x: 5, y: -1 } }, 600)
    later(() => { lookOverride = null }, 1300)
  }
  function sleep() { asleep = true; target = null; setMood('sleepy') }
  function wake() {
    if (!asleep) return
    asleep = false; napping = false
    setMood('surprised', 1000); jump(7)
    flowAt = performance.now() + 2200
  }

  // ---------- the flow: Bubu keeps cycling through its actions ----------
  const walk = () => {
    const from = x, span = maxX() - pad
    let to = rand(pad, maxX())
    if (Math.abs(to - from) < span * 0.25) to = from > pad + span / 2 ? pad + rand(0, span * 0.3) : maxX() - rand(0, span * 0.3)
    target = to; speed = rand(1.3, 2.1)
    return 'walk'
  }
  const FLOW = [
    walk,
    () => { setMood('happy', 1400); return 1400 },
    () => { wave(); return 1700 },
    walk,
    () => { setMood('curious', 1600); lookAround(); return 1600 },
    () => { setMood('excited', 800); later(() => jump(12), 300); return 1600 },
    walk,
    () => { setMood('surprised', 1200); return 1200 },
    () => { setMood('shy', 1600); return 1600 },
    () => { dance(); return 1400 },
    walk,
    () => { setMood('pout', 1500); return 1500 },
    () => { setMood('happy', 900); return 900 },
    () => { setMood('excited', 500); spinning = true; later(() => { pet.classList.add('bubu--spin'); jump(13) }, 250); return 3400 },
    walk,
    () => { napping = true; sleep(); later(() => { if (napping) wake() }, 3600); return 4800 },
  ]
  let step = 0, flowAt = performance.now() + 1800, walking = false

  function runFlow(t) {
    if (reduced || open || busy || asleep || mode !== 'ground') return
    if (walking) { if (target == null) { walking = false; flowAt = t + rand(500, 1000) } return }
    if (t < flowAt || target != null) return
    const r = FLOW[step % FLOW.length](); step++
    if (r === 'walk') walking = true
    else flowAt = t + r + rand(600, 1200)
  }

  // ---------- activity ----------
  function activity() {
    lastActivity = performance.now()
    if (asleep && !napping) wake()
  }
  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return
    pointer = { x: e.clientX, y: e.clientY }; pointerAt = performance.now()
    activity()
  }
  const onResize = () => { measure(); x = clamp(x, pad, maxX()); y = clamp(y, 0, Math.max(0, maxY())); if (open) target = maxX() }
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('scroll', activity, { passive: true })
  window.addEventListener('touchstart', activity, { passive: true })
  window.addEventListener('resize', onResize)

  // ---------- drag, throw, tap ----------
  let down = null, dragged = false, suppressClick = false, hist = []
  const onDown = (e) => {
    if (e.button !== 0) return
    const r = pet.getBoundingClientRect()
    down = { sx: e.clientX, sy: e.clientY, ox: e.clientX - r.left, oy: e.clientY - r.top }
    dragged = false; hist = []
    mascot.setPointerCapture?.(e.pointerId)
  }
  const onMove = (e) => {
    if (!down) return
    if (!dragged && Math.hypot(e.clientX - down.sx, e.clientY - down.sy) > 6) {
      dragged = true; mode = 'drag'; target = null; walking = false; asleep = false; napping = false
      pet.classList.add('is-dragging', 'is-air')
      setMood('surprised'); later(() => { if (mode === 'drag') setMood('excited') }, 700)
      hint.classList.add('is-gone')
    }
    if (!dragged) return
    const nx = clamp(e.clientX - down.ox, 0, vw() - W)
    const ny = clamp(window.innerHeight - pad - lift - (e.clientY - down.oy + H), 0, window.innerHeight - H - pad - lift)
    const t = performance.now()
    hist.push({ x: nx, y: ny, t }); hist = hist.filter((h) => t - h.t < 90)
    dragTilt = clamp((nx - x) * 1.4, -30, 30)
    x = nx; y = ny
  }
  const onUp = () => {
    if (!down) return
    if (dragged) {
      suppressClick = true
      const a = hist[0], b = hist[hist.length - 1]
      const dt = a && b && b.t > a.t ? (b.t - a.t) / 16.67 : 1
      vx = a && b ? clamp((b.x - a.x) / dt, -28, 28) : 0
      vy = a && b ? clamp((b.y - a.y) / dt, -28, 28) : 0
      mode = 'air'; pet.classList.remove('is-dragging')
      setMood(Math.hypot(vx, vy) > 10 ? 'excited' : 'surprised')
      lastActivity = performance.now()
    }
    down = null
  }
  const onClick = () => {
    if (suppressClick) { suppressClick = false; return }
    activity(); if (asleep) wake()
    hint.classList.add('is-gone')
    onTap()
  }
  mascot.addEventListener('pointerdown', onDown)
  mascot.addEventListener('pointermove', onMove)
  mascot.addEventListener('pointerup', onUp)
  mascot.addEventListener('pointercancel', onUp)
  mascot.addEventListener('click', onClick)

  // ---------- main loop ----------
  measure()
  x = reduced ? maxX() : vw() + 10 // walk in from the right edge
  target = maxX(); speed = 2
  let lastT = performance.now(), lastScroll = window.scrollY, scrollVel = 0

  function frame(t) {
    if (!alive) return
    const dt = Math.min(48, t - lastT) / 16.67; lastT = t
    const sy = window.scrollY, dS = sy - lastScroll; lastScroll = sy
    scrollVel += (dS - scrollVel) * 0.25

    if (mode === 'ground') {
      if (target != null) {
        const d = target - x
        if (Math.abs(d) < 2) { target = null; pet.classList.remove('is-walking', 'is-running'); if (open) face(-1) }
        else {
          face(Math.sign(d))
          x += Math.sign(d) * Math.min(Math.abs(d), (reduced ? 999 : speed) * dt)
          pet.classList.add('is-walking'); pet.classList.toggle('is-running', speed > 3)
        }
      } else pet.classList.remove('is-walking', 'is-running')

      if (!reduced && Math.abs(scrollVel) > 30 && !busy && !asleep) { setMood('surprised', 800); jump(7) }
      if (!open && !busy && !asleep && target == null && t - lastActivity > 45000) sleep()
      runFlow(t)
    } else if (mode === 'air') {
      vy -= 0.65 * dt; x += vx * dt; y += vy * dt
      if (x < 0) { x = 0; vx = -vx * 0.6 }
      if (x > vw() - W) { x = vw() - W; vx = -vx * 0.6 }
      if (y > maxY()) { y = maxY(); vy = -Math.abs(vy) * 0.4 }
      if (y <= 0) {
        y = 0
        const impact = -vy
        squash = clamp(impact * 0.018, 0.04, 0.28)
        if (impact > 8) {
          vy = impact * 0.38; vx *= 0.7
          if (impact > 17) setMood('dizzy', 2200)
        } else {
          mode = 'ground'; vx = 0; vy = 0
          pet.classList.remove('is-air', 'bubu--spin')
          if (spinning) { spinning = false; setMood('dizzy', 2000) }
          else if (!['dizzy', 'happy', 'surprised', 'sleepy'].includes(mascot.dataset.mood)) setMood('happy', 900)
          x = clamp(x, pad, maxX())
          if (open) { target = maxX(); speed = 4 }
        }
      }
    }
    if (mode === 'air') pet.classList.add('is-air')
    if (mode !== 'drag') dragTilt *= 0.85

    if (!reduced) {
      const tLag = mode === 'ground' ? clamp(-scrollVel * 1.2, -22, 22) : 0
      const tTilt = clamp(scrollVel * 0.5, -12, 12) + dragTilt + (mode === 'air' ? clamp(vx * 1.2, -20, 20) : 0)
      lagV = (lagV + (tLag - lag) * 0.12 * dt) * 0.78; lag += lagV * dt
      tiltV = (tiltV + (tTilt - tilt) * 0.14 * dt) * 0.76; tilt += tiltV * dt
    }
    squash *= 0.86
    pet.style.transform = `translate3d(${x.toFixed(1)}px, ${(-y).toFixed(1)}px, 0)`
    lean.style.transform = `translateY(${lag.toFixed(1)}px) rotate(${tilt.toFixed(2)}deg) scale(${(1 + squash).toFixed(3)}, ${(1 - squash).toFixed(3)})`

    // Eyes follow the pointer, or look the way the page scrolls.
    let lx = 0, ly = 0
    if (lookOverride) { lx = lookOverride.x; ly = lookOverride.y }
    else if (Math.abs(scrollVel) > 1.5) ly = clamp(scrollVel * 0.5, -5, 5)
    else if (pointer && t - pointerAt < 3000) {
      const r = pet.getBoundingClientRect()
      const dx = pointer.x - (r.left + r.width / 2), dy = pointer.y - (r.top + r.height * 0.5)
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260)
      lx = (dx / d) * 5 * k; ly = (dy / d) * 5 * k
      if (facing < 0) lx = -lx // the face is mirrored when walking left
    }
    pupils.style.transform = `translate(${lx.toFixed(2)}px, ${ly.toFixed(2)}px)`

    raf = requestAnimationFrame(frame)
  }
  pet.style.transform = `translate3d(${x}px, 0, 0)`
  raf = requestAnimationFrame(frame)

  // Blink every few seconds, sometimes twice.
  const blink = () => { mascot.classList.add('is-blink'); later(() => mascot.classList.remove('is-blink'), 120) }
  ;(function blinkLoop() {
    later(() => { blink(); if (Math.random() < 0.25) later(blink, 260); blinkLoop() }, rand(2000, 5000))
  })()
  later(() => hint.classList.add('is-gone'), 9000)

  // Reactions for taps while the chat is open.
  const REACTIONS = [
    () => dance(),
    () => { setMood('happy', 1200); jump(9) },
    () => setMood('shy', 1500),
    () => wave(),
    () => { setMood('pout', 1300); later(() => setMood('happy', 900), 1300) },
    () => { setMood('excited', 900); later(() => jump(12), 250) },
    () => setMood('surprised', 1200),
  ]
  let lastReaction = -1

  return {
    setMood, dance, wave,
    jump: (p) => jump(p),
    react() {
      let i
      do { i = Math.floor(Math.random() * REACTIONS.length) } while (i === lastReaction)
      lastReaction = i; REACTIONS[i]()
    },
    setOpen(v) {
      open = v
      if (v) { asleep = false; napping = false; walking = false; target = maxX(); speed = 4 }
      else flowAt = performance.now() + 1500
    },
    destroy() {
      alive = false
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout); clearTimeout(moodTimer)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', activity)
      window.removeEventListener('touchstart', activity)
      window.removeEventListener('resize', onResize)
      mascot.removeEventListener('pointerdown', onDown)
      mascot.removeEventListener('pointermove', onMove)
      mascot.removeEventListener('pointerup', onUp)
      mascot.removeEventListener('pointercancel', onUp)
      mascot.removeEventListener('click', onClick)
    },
  }
}
