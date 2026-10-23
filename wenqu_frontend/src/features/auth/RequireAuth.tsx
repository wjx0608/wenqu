import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { loadTokens } from '@/shared/api/tokens'

/** 路由守卫：无 token 直接跳转登录页，登录后回跳原页面 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation()

  if (!loadTokens()) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  }
  return children
}
