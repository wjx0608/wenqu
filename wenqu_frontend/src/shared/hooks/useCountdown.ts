import { useEffect, useRef, useState } from 'react'

/** 验证码倒计时：start(seconds) 启动，running 期间按钮禁用 */
export function useCountdown() {
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = (from: number) => {
    setSeconds(from)
  }

  useEffect(() => {
    if (seconds <= 0) return
    timerRef.current = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1))
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [seconds > 0]) // eslint-disable-line react-hooks/exhaustive-deps

  return { seconds, running: seconds > 0, start }
}
