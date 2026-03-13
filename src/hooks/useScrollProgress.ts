import { useEffect, useRef, useCallback } from 'react'

/**
 * Returns a scroll progress value [0, 1] for a given ref element.
 * 0 = section top at viewport bottom, 1 = section bottom at viewport top.
 */
export function useScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
  callback: (progress: number) => void
) {
  const rafId = useRef(0)

  const onScroll = useCallback(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const sectionTop = -rect.top
    const sectionHeight = rect.height - window.innerHeight
    const p = Math.max(0, Math.min(1, sectionTop / sectionHeight))
    callback(p)
  }, [ref, callback])

  useEffect(() => {
    const handler = () => {
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(onScroll)
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler() // Initial call
    return () => {
      window.removeEventListener('scroll', handler)
      cancelAnimationFrame(rafId.current)
    }
  }, [onScroll])
}
