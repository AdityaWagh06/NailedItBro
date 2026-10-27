/*
  Shared motion layer for the website templates (GSAP + ScrollTrigger + Lenis).
  Pages opt in with data attributes:
    data-hero            intro element, animated in order after the loader
    data-split           heading revealed word by word (hero or on scroll)
    data-reveal          fade and rise on scroll
    data-stagger         children rise one after another on scroll
    data-speed="n"       parallax, n = travel in % (negative moves up)
    data-clip            mask reveal from the bottom, inner content scales down
    data-count           numbers count up (keeps prefix and suffix)
    data-tilt            3D tilt toward the pointer, with glare
    data-marquee         infinite strip that speeds up with scroll velocity
    data-cursor="Label"  cursor grows and shows a label over this element
  Pages can listen for the "m:ready" event to add their own touches.
*/
(() => {
  const html = document.documentElement
  const reveal = () => html.classList.remove('m')
  // ?still skips all motion (used to capture the Work-section preview screenshots).
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('still')
  if (!window.gsap || !window.ScrollTrigger || reduce) { reveal(); return }

  const { gsap, ScrollTrigger } = window
  gsap.registerPlugin(ScrollTrigger)
  const $ = (s, r = document) => [...r.querySelectorAll(s)]
  const fine = matchMedia('(pointer: fine)').matches
  const EASE = 'expo.out'

  /* ---------- Smooth scroll ---------- */
  let lenis = null
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
    $('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')
      const target = id.length > 1 && document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -70, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
    }))
  }

  /* ---------- Split text into masked words ---------- */
  const split = (el) => {
    if (el.dataset.splitDone) return $('.mwi', el)
    const walk = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment()
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) return frag.append(' ')
          const w = document.createElement('span'); w.className = 'mw'
          const i = document.createElement('span'); i.className = 'mwi'; i.textContent = part
          w.append(i); frag.append(w)
        })
        n.replaceWith(frag)
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n)
    })
    walk(el)
    el.dataset.splitDone = '1'
    return $('.mwi', el)
  }

  /* ---------- Initial states (page is still hidden) ---------- */
  const heroEls = $('[data-hero]')
  heroEls.forEach((el) => {
    if (el.hasAttribute('data-split')) gsap.set(split(el), { yPercent: 120, rotate: 4 })
    else if (el.dataset.hero === 'visual') gsap.set(el, { autoAlpha: 0, scale: 0.88, y: 40, rotate: -2 })
    else gsap.set(el, { autoAlpha: 0, y: 30 })
  })

  /* ---------- Loader ---------- */
  const brand = (document.title.split('·')[0] || '').trim()
  const loader = document.createElement('div')
  loader.className = 'm-loader'
  loader.innerHTML = '<div class="m-loader__name"></div><div class="m-loader__foot"><span>Loading</span><div class="m-loader__bar"><i></i></div><span class="m-loader__count">0</span></div>'
  const nameEl = loader.querySelector('.m-loader__name')
  ;[...brand].forEach((ch) => {
    const w = document.createElement('span'); w.className = 'mw'
    const i = document.createElement('span'); i.className = 'mwi'; i.textContent = ch
    w.append(i); nameEl.append(w)
  })
  document.body.append(loader)
  lenis?.stop()
  window.scrollTo(0, 0)
  reveal()

  const counter = { v: 0 }
  const countEl = loader.querySelector('.m-loader__count')
  const intro = gsap.timeline({ defaults: { ease: EASE } })
  intro
    .from($('.mwi', nameEl), { yPercent: 120, duration: 1, stagger: 0.035 })
    .to(loader.querySelector('.m-loader__bar i'), { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.1)
    .to(counter, { v: 100, duration: 1.2, ease: 'power2.inOut', onUpdate: () => { countEl.textContent = Math.round(counter.v) } }, 0.1)
    .to($('.mwi', nameEl), { yPercent: -120, duration: 0.7, stagger: 0.02, ease: 'power3.in' }, 1.35)
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 1.75)
    .add(() => { loader.remove(); lenis?.start() })

  // Hero sequence overlaps the loader exit.
  let at = 2.15
  heroEls.forEach((el) => {
    if (el.hasAttribute('data-split')) {
      intro.to($('.mwi', el), { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.06 }, at)
      at += 0.18
    } else if (el.dataset.hero === 'visual') {
      intro.to(el, { autoAlpha: 1, scale: 1, y: 0, rotate: 0, duration: 1.8 }, 2.05)
    } else {
      intro.to(el, { autoAlpha: 1, y: 0, duration: 1.2 }, at)
      at += 0.1
    }
  })
  intro.add(() => document.dispatchEvent(new CustomEvent('m:ready', { detail: { gsap, ScrollTrigger, lenis, split } })))

  /* ---------- Scroll reveals ---------- */
  $('[data-split]:not([data-hero])').forEach((el) => {
    gsap.from(split(el), { yPercent: 120, rotate: 3, duration: 1.3, ease: EASE, stagger: 0.04, scrollTrigger: { trigger: el, start: 'top 88%' } })
  })
  $('[data-reveal]').forEach((el) => {
    gsap.from(el, { autoAlpha: 0, y: 60, duration: 1.3, ease: EASE, scrollTrigger: { trigger: el, start: 'top 90%' } })
  })
  $('[data-stagger]').forEach((el) => {
    gsap.from(el.children, { autoAlpha: 0, y: 70, duration: 1.3, ease: EASE, stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 85%' } })
  })
  $('[data-clip]').forEach((el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%' } })
    tl.from(el, { clipPath: 'inset(100% 0% 0% 0% round 24px)', duration: 1.5, ease: 'expo.inOut' })
    if (el.firstElementChild) tl.from(el.firstElementChild, { scale: 1.35, duration: 1.9, ease: EASE }, 0)
  })
  $('[data-speed]').forEach((el) => {
    const v = parseFloat(el.dataset.speed) || 10
    gsap.fromTo(el, { yPercent: -v }, { yPercent: v, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
  })

  /* ---------- Count-up numbers ---------- */
  $('[data-count]').forEach((el) => {
    const m = el.textContent.trim().match(/^([^\d]*)([\d,.]+)(.*)$/)
    if (!m) return
    const [, pre, num, post] = m
    const target = parseFloat(num.replace(/,/g, ''))
    const dec = (num.split('.')[1] || '').length
    const fmt = (n) => (num.includes(',') ? n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : n.toFixed(dec))
    const o = { v: 0 }
    el.textContent = pre + fmt(0) + post
    gsap.to(o, { v: target, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' }, onUpdate: () => { el.textContent = pre + fmt(o.v) + post } })
  })

  /* ---------- Marquee with scroll velocity ---------- */
  $('[data-marquee]').forEach((el) => {
    const inner = el.firstElementChild
    inner.style.animation = 'none'
    const loop = gsap.to(inner, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity() / 300
        gsap.to(loop, { timeScale: 1 + Math.abs(v), duration: 0.2, overwrite: true })
        gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.25, ease: 'power2.out' })
        gsap.to(inner, { skewX: gsap.utils.clamp(-8, 8, -v * 1.5), duration: 0.4, overwrite: 'auto' })
      },
    })
  })

  /* ---------- Scroll progress ---------- */
  const bar = document.createElement('div')
  bar.className = 'm-progress'
  document.body.append(bar)
  gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })

  if (!fine) return

  /* ---------- Cursor ---------- */
  const ring = document.createElement('div'); ring.className = 'm-cursor'
  const dot = document.createElement('div'); dot.className = 'm-cursor-dot'
  document.body.append(ring, dot)
  gsap.set([ring, dot], { autoAlpha: 0 })
  const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' })
  const dx = gsap.quickTo(dot, 'x', { duration: 0.12 }), dy = gsap.quickTo(dot, 'y', { duration: 0.12 })
  window.addEventListener('pointermove', (e) => { gsap.to([ring, dot], { autoAlpha: 1, duration: 0.3 }); rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY) }, { passive: true })
  document.addEventListener('pointerleave', () => gsap.to([ring, dot], { autoAlpha: 0 }))
  $('a, button, select, input, summary, [data-cursor]').forEach((el) => {
    el.addEventListener('pointerenter', () => {
      const label = el.closest('[data-cursor]')?.dataset.cursor
      ring.classList.add(label ? 'is-label' : 'is-hover')
      ring.textContent = label || ''
    })
    el.addEventListener('pointerleave', () => { ring.classList.remove('is-hover', 'is-label'); ring.textContent = '' })
  })

  /* ---------- Magnetic buttons ---------- */
  $('.btn').forEach((b) => {
    const mx = gsap.quickTo(b, 'x', { duration: 0.6, ease: 'power3' }), my = gsap.quickTo(b, 'y', { duration: 0.6, ease: 'power3' })
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect()
      mx((e.clientX - r.left - r.width / 2) * 0.3); my((e.clientY - r.top - r.height / 2) * 0.4)
    })
    b.addEventListener('pointerleave', () => { gsap.to(b, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' }) })
  })

  /* ---------- 3D tilt with glare ---------- */
  $('[data-tilt]').forEach((el) => {
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
    const glare = document.createElement('i'); glare.className = 'm-glare'; el.append(glare)
    const max = parseFloat(el.dataset.tilt) || 8
    const tx = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' }), ty = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' })
    gsap.set(el, { transformPerspective: 900 })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
      tx((px - 0.5) * max * 2); ty((0.5 - py) * max * 2)
      el.style.setProperty('--gx', px * 100 + '%'); el.style.setProperty('--gy', py * 100 + '%')
    })
    el.addEventListener('pointerleave', () => { tx(0); ty(0) })
  })

  document.fonts?.ready.then(() => ScrollTrigger.refresh())
})()
