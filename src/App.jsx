import { useEffect, useState, lazy, Suspense } from 'react'
import { LazyMotion, domAnimation, AnimatePresence, m } from 'motion/react'
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
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import FloatingSocials from './components/FloatingSocials'
import { useThemeSections } from './lib/useThemeSections'

const AboutPage = lazy(() => import('./components/AboutPage'))
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'))
const TermsConditionsPage = lazy(() => import('./components/TermsConditionsPage'))
const CookiePolicyPage = lazy(() => import('./components/CookiePolicyPage'))
const CaseStudyPage = lazy(() => import('./components/CaseStudyPage'))
const Bubu = lazy(() => import('./components/Bubu'))

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
  if (hash.startsWith('#case-study/') || hash.startsWith('#work/') || path.startsWith('/case-study/')) {
    return 'case-study'
  }
  return 'home'
}

function getCaseStudySlug() {
  const hash = window.location.hash
  const path = window.location.pathname
  if (hash.startsWith('#case-study/')) return hash.replace('#case-study/', '')
  if (hash.startsWith('#work/')) return hash.replace('#work/', '')
  if (path.startsWith('/case-study/')) return path.replace('/case-study/', '')
  return 'creme-and-whisk'
}

export default function App() {
  // Skip the brand reveal for reduced motion and for deep links (#work etc.).
  const [ready, setReady] = useState(() => prefersReducedMotion() || !!window.location.hash)
  const [route, setRoute] = useState(getRoute)
  const [isNavigating, setIsNavigating] = useState(false)

  useSmoothScroll()
  useThemeSections(route)

  useEffect(() => {
    const handleRoute = () => {
      const nextRoute = getRoute()
      setIsNavigating(true)
      setRoute(nextRoute)
      if (nextRoute === 'about' || nextRoute === 'privacy' || nextRoute === 'terms' || nextRoute === 'cookies' || nextRoute === 'case-study') {
        window.scrollTo(0, 0)
        getLenis()?.scrollTo(0, { immediate: true })
      }
      setTimeout(() => {
        setIsNavigating(false)
        ScrollTrigger.refresh()
      }, 450)
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
              : href.startsWith('#case-study/') || href.startsWith('#work/') || href.startsWith('/case-study/')
                ? 'case-study'
                : 'home'

    if (nextRoute !== route) {
      setIsNavigating(true)
      setTimeout(() => setIsNavigating(false), 450)
    }

    setRoute(nextRoute)
    if (nextRoute === 'about' || nextRoute === 'privacy' || nextRoute === 'terms' || nextRoute === 'cookies' || nextRoute === 'case-study') {
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

  const isCaseStudy = route === 'case-study'

  return (
    <LazyMotion features={domAnimation} strict>
      <a className="skip-link" href="#main">Skip to content</a>
      {!ready && <Loader onReveal={() => setReady(true)} />}
      {!isCaseStudy && <Nav onNavigate={handleNavigate} />}
      {!isCaseStudy && <ScrollProgress />}
      {!isCaseStudy && <FloatingSocials />}
      {isNavigating && (
        <m.div
          className="page-route-top-bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      <main id="main">
        <AnimatePresence mode="wait">
          <m.div
            key={route}
            className="page-transition-wrap"
            initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(5px)' }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <Suspense fallback={null}>
              {route === 'about' ? (
                <AboutPage onNavigate={handleNavigate} />
              ) : route === 'privacy' ? (
                <PrivacyPolicyPage onNavigate={handleNavigate} />
              ) : route === 'terms' ? (
                <TermsConditionsPage onNavigate={handleNavigate} />
              ) : route === 'cookies' ? (
                <CookiePolicyPage onNavigate={handleNavigate} />
              ) : route === 'case-study' ? (
                <CaseStudyPage slug={getCaseStudySlug()} onNavigate={handleNavigate} />
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
            </Suspense>
          </m.div>
        </AnimatePresence>
      </main>
      {!isCaseStudy && <Footer onNavigate={handleNavigate} />}
      {!isCaseStudy && ready && (
        <Suspense fallback={null}>
          <Bubu />
        </Suspense>
      )}
    </LazyMotion>
  )
}
