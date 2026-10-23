import { useEffect, useState } from 'react'

/** 防抖值：输入停止 delay 毫秒后才更新（用于搜索联想等场景） */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
