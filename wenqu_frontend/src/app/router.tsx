import { createBrowserRouter } from 'react-router-dom'

import { UiGallery } from '@/dev/UiGallery'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div style={{ padding: 40 }}>问渠 · 首页重构中</div>,
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  {
    path: '/dev/ui',
    element: <UiGallery />,
  },
])
