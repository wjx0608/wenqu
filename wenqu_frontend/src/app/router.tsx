import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { NotFoundPage } from '@/app/NotFoundPage'
import { RouteError } from '@/app/RouteError'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { AppLayout } from '@/layouts/AppLayout'
import { Spinner } from '@/shared/ui'

const HomePage = lazy(() => import('@/features/feed/HomePage').then((m) => ({ default: m.HomePage })))
const PostDetailPage = lazy(() =>
  import('@/features/post/PostDetailPage').then((m) => ({ default: m.PostDetailPage })),
)
const SearchPage = lazy(() =>
  import('@/features/search/SearchPage').then((m) => ({ default: m.SearchPage })),
)
const EditorPage = lazy(() =>
  import('@/features/editor/EditorPage').then((m) => ({ default: m.EditorPage })),
)
const ProfilePage = lazy(() =>
  import('@/features/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)
const EditProfilePage = lazy(() =>
  import('@/features/profile/EditProfilePage').then((m) => ({ default: m.EditProfilePage })),
)
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
)
const UiGallery = lazy(() => import('@/dev/UiGallery').then((m) => ({ default: m.UiGallery })))

function pending(node: ReactNode) {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64, color: 'var(--color-brand)' }}>
          <Spinner size={24} />
        </div>
      }
    >
      {node}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { path: '/', element: pending(<HomePage />) },
      { path: '/post/:id', element: pending(<PostDetailPage />) },
      { path: '/search', element: pending(<SearchPage />) },
      {
        path: '/create',
        element: (
          <RequireAuth>
            {pending(<EditorPage />)}
          </RequireAuth>
        ),
      },
      {
        path: '/profile',
        element: (
          <RequireAuth>
            {pending(<ProfilePage />)}
          </RequireAuth>
        ),
      },
      {
        path: '/profile/edit',
        element: (
          <RequireAuth>
            {pending(<EditProfilePage />)}
          </RequireAuth>
        ),
      },
      ...(import.meta.env.DEV ? [{ path: '/dev/ui', element: pending(<UiGallery />) }] : []),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/login', element: pending(<LoginPage />) },
  { path: '/register', element: pending(<RegisterPage />) },
  { path: '/reset-password', element: pending(<ResetPasswordPage />) },
])
