import { useEffect } from 'react'
import { gsap } from 'gsap'

export const useCursor = () => {
  useEffect(() => {
    if (window.innerWidth < 1024) return

    const cursor = document.querySelector('.cursor')
    if (!cursor) return

    const onMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
      })
    }

    const onEnterHoverable = () => cursor.classList.add('cursor--hover')
    const onLeaveHoverable = () => cursor.classList.remove('cursor--hover')

    window.addEventListener('mousemove', onMove)

    const attachHoverListeners = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
        el.addEventListener('mouseenter', onEnterHoverable)
        el.addEventListener('mouseleave', onLeaveHoverable)
      })
    }

    attachHoverListeners()

    const observer = new MutationObserver(attachHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
    }
  }, [])
}
