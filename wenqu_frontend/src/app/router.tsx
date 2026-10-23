import { createBrowserRouter } from 'react-router-dom'

import { UiGallery } from '@/dev/UiGallery'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
import { HomePage } from '@/features/feed/HomePage'
import { PostDetailPage } from '@/features/post/PostDetailPage'
import { EditorPage } from '@/features/editor/EditorPage'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { AppLayout } from '@/layouts/AppLayout'

const placeholder = (text: string) => <div>{text}</div>

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/post/:id', element: <PostDetailPage /> },
      { path: '/search', element: placeholder('搜索 · 重构中') },
      {
        path: '/create',
        element: (
          <RequireAuth>
            <EditorPage />
          </RequireAuth>
        ),
      },
      { path: '/profile', element: placeholder('我的 · 重构中') },
      { path: '/dev/ui', element: <UiGallery /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
])
