import { useEffect } from 'react'
import { ScrollTrigger } from './motion'

/**
 * Sections marked data-theme="dark" flip the page palette while they sit
 * under the middle of the viewport. Colour is a CSS transition on custom
 * properties, so nothing re-lays out.
 */
export function useThemeSections(dep) {
  useEffect(() => {
    const root = document.documentElement
    root.dataset.page = 'light'

    let triggers = []
    const timer = setTimeout(() => {
      triggers = [...document.querySelectorAll('[data-theme]')].map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: ({ isActive }) => {
            if (isActive) {
              root.dataset.page = el.dataset.theme
            } else {
              root.dataset.page = 'light'
            }
          },
        }),
      )
      ScrollTrigger.refresh()
    }, 60)

    return () => {
      clearTimeout(timer)
      triggers.forEach((t) => t.kill())
    }
  }, [dep])
}
