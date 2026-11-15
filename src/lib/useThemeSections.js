import { useEffect } from 'react'
import { ScrollTrigger } from './motion'

/**
 * Sections marked data-theme="dark" flip the page palette while they sit
 * under the middle of the viewport. Colour is a CSS transition on custom
 * properties, so nothing re-lays out.
 */
export function useThemeSections(route) {
  useEffect(() => {
    // Keep the overall page background consistently light / warm beige throughout scrolling
    const root = document.documentElement
    root.dataset.page = 'light'
  }, [route])
}
