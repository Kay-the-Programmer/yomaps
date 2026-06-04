import { useRef } from 'react'
import { pageExit, pageEnter } from '../animations/pageTransitions'

export const usePageTransition = () => {
  const containerRef = useRef(null)

  const transitionTo = async (navigate, path) => {
    const el = containerRef.current
    if (el) {
      await pageExit(el)
    }
    navigate(path)
  }

  const onEnter = () => {
    const el = containerRef.current
    if (el) pageEnter(el)
  }

  return { containerRef, transitionTo, onEnter }
}
