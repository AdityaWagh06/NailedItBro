import { useEffect } from 'react'
import { ScrollTrigger } from './motion'

/**
 * Sections marked data-theme="dark" flip the page palette while they sit
 * under the middle of the viewport. Colour is a CSS transition on custom
 * properties, so nothing re-lays out.
 */
export function useThemeSections() {
  useEffect(() => {
    const root = document.documentElement
    const triggers = [...document.querySelectorAll('[data-theme]')].map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: ({ isActive }) => {
          if (isActive) root.dataset.page = el.dataset.theme
        },
      }),
    )
    return () => triggers.forEach((t) => t.kill())
  }, [])
}
