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
import PrivacyPolicyPage from './components/PrivacyPolicyPage'
import TermsConditionsPage from './components/TermsConditionsPage'
import CookiePolicyPage from './components/CookiePolicyPage'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import Bubu from './components/Bubu'
import FloatingSocials from './components/FloatingSocials'
import { useThemeSections } from './lib/useThemeSections'

function getRoute() {
  const hash = window.location.hash
  const path = window.location.pathname
  if (hash === '#about' || hash === '#about-us' || path === '/about') {
    return 'about'
  }
  if (hash === '#privacy' || hash === '#privacy-policy' || path === '/privacy' || path === '/privacy-policy') {
    return 'privacy'
  }
  if (hash === '#terms' || hash === '#terms-and-conditions' || path === '/terms' || path === '/terms-and-conditions') {
    return 'terms'
  }
  if (hash === '#cookies' || hash === '#cookie-policy' || path === '/cookies' || path === '/cookie-policy') {
    return 'cookies'
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
      if (nextRoute === 'about' || nextRoute === 'privacy' || nextRoute === 'terms' || nextRoute === 'cookies') {
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
    const nextRoute =
      href === '#about'
        ? 'about'
        : href === '#privacy' || href === '#privacy-policy'
          ? 'privacy'
          : href === '#terms' || href === '#terms-and-conditions'
            ? 'terms'
            : href === '#cookies' || href === '#cookie-policy'
              ? 'cookies'
              : 'home'
    setRoute(nextRoute)
    if (nextRoute === 'about' || nextRoute === 'privacy' || nextRoute === 'terms' || nextRoute === 'cookies') {
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
      <FloatingSocials />
      <main id="main">
        {route === 'about' ? (
          <AboutPage onNavigate={handleNavigate} />
        ) : route === 'privacy' ? (
          <PrivacyPolicyPage onNavigate={handleNavigate} />
        ) : route === 'terms' ? (
          <TermsConditionsPage onNavigate={handleNavigate} />
        ) : route === 'cookies' ? (
          <CookiePolicyPage onNavigate={handleNavigate} />
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
      {ready && <Bubu />}
    </LazyMotion>
  )
}
