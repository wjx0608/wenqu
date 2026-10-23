import { useEffect, useRef } from 'react'

/** 无限滚动哨兵：元素进入视口（提前 240px）时触发 onIntersect */
export function useIntersection(onIntersect: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(onIntersect)
  callbackRef.current = onIntersect

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callbackRef.current()
      },
      { rootMargin: '240px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled])

  return ref
}
