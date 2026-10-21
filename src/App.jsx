import { useEffect, useState } from 'react'
import { LazyMotion, domAnimation } from 'motion/react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { ScrollTrigger, prefersReducedMotion } from './lib/motion'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Manifesto from './components/Manifesto'
import Services from './components/Services'
import Work from './components/Work'
import Process from './components/Process'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import { useThemeSections } from './lib/useThemeSections'

export default function App() {
  // Skip the brand reveal for reduced motion and for deep links (#work etc.).
  const [ready, setReady] = useState(() => prefersReducedMotion() || !!window.location.hash)
  useSmoothScroll()
  useThemeSections()

  useEffect(() => {
    // Fonts change line breaks, so re-measure triggers once they load.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  useEffect(() => {
    // Direct navigation to an anchor: jump once layout and triggers exist.
    const hash = window.location.hash
    if (!hash || hash.startsWith('#work/')) return
    const id = setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView()
      ScrollTrigger.refresh()
    }, 120)
    return () => clearTimeout(id)
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <a className="skip-link" href="#main">Skip to content</a>
      {!ready && <Loader onReveal={() => setReady(true)} />}
      <Nav />
      <ScrollProgress />
      <main id="main">
        <Hero ready={ready} />
        <Marquee />
        <Manifesto />
        <Services />
        <Work />
        <Process />
        <Contact />
      </main>
      <Footer />
    </LazyMotion>
  )
}
