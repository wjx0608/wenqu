import { createBrowserRouter } from 'react-router-dom'

import { UiGallery } from '@/dev/UiGallery'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
import { AppLayout } from '@/layouts/AppLayout'

const placeholder = (text: string) => <div>{text}</div>

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: placeholder('首页 · 重构中') },
      { path: '/search', element: placeholder('搜索 · 重构中') },
      { path: '/create', element: placeholder('创作 · 重构中') },
      { path: '/profile', element: placeholder('我的 · 重构中') },
      { path: '/dev/ui', element: <UiGallery /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
])
