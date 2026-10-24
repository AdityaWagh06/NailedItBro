import { useEffect, useState } from 'react'
import { LazyMotion, domAnimation } from 'motion/react'
import { useSmoothScroll, getLenis, scrollToTarget } from './lib/useSmoothScroll'
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
import AboutPage from './components/AboutPage'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import StickyWhatsApp from './components/StickyWhatsApp'
import { useThemeSections } from './lib/useThemeSections'

function getRoute() {
  const hash = window.location.hash
  if (hash === '#about' || hash === '#about-us' || window.location.pathname === '/about') {
    return 'about'
  }
  return 'home'
}

export default function App() {
  // Skip the brand reveal for reduced motion and for deep links (#work etc.).
  const [ready, setReady] = useState(() => prefersReducedMotion() || !!window.location.hash)
  const [route, setRoute] = useState(getRoute)

  useSmoothScroll()
  useThemeSections(route)

  useEffect(() => {
    const handleRoute = () => {
      const nextRoute = getRoute()
      setRoute(nextRoute)
      if (nextRoute === 'about') {
        window.scrollTo(0, 0)
        getLenis()?.scrollTo(0, { immediate: true })
      }
      setTimeout(() => ScrollTrigger.refresh(), 100)
    }
    window.addEventListener('hashchange', handleRoute)
    window.addEventListener('popstate', handleRoute)
    return () => {
      window.removeEventListener('hashchange', handleRoute)
      window.removeEventListener('popstate', handleRoute)
    }
  }, [])

  const handleNavigate = (href) => {
    history.pushState(null, '', href)
    const nextRoute = href === '#about' ? 'about' : 'home'
    setRoute(nextRoute)
    if (nextRoute === 'about') {
      window.scrollTo(0, 0)
      getLenis()?.scrollTo(0, { immediate: true })
    } else {
      setTimeout(() => {
        scrollToTarget(href)
        setTimeout(() => {
          const targetEl = document.querySelector(href)
          if (targetEl && Math.abs(targetEl.getBoundingClientRect().top) > 100) {
            scrollToTarget(href)
          }
        }, 180)
      }, 120)
    }
    setTimeout(() => ScrollTrigger.refresh(), 140)
  }

  useEffect(() => {
    // Fonts change line breaks, so re-measure triggers once they load.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  useEffect(() => {
    // Direct navigation to an anchor: jump once layout and triggers exist.
    const hash = window.location.hash
    if (!hash || hash.startsWith('#work/') || hash === '#about') return
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
      <Nav onNavigate={handleNavigate} />
      <ScrollProgress />
      <main id="main">
        {route === 'about' ? (
          <AboutPage onNavigate={handleNavigate} />
        ) : (
          <>
            <Hero ready={ready} />
            <Marquee />
            <Manifesto />
            <Services />
            <Work />
            <Process />
            <Contact />
          </>
        )}
      </main>
      <Footer onNavigate={handleNavigate} />
    </LazyMotion>
  )
}
