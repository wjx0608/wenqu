import { createBrowserRouter } from 'react-router-dom'

import { UiGallery } from '@/dev/UiGallery'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
import { HomePage } from '@/features/feed/HomePage'
import { PostDetailPage } from '@/features/post/PostDetailPage'
import { EditorPage } from '@/features/editor/EditorPage'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { EditProfilePage } from '@/features/profile/EditProfilePage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { SearchPage } from '@/features/search/SearchPage'
import { AppLayout } from '@/layouts/AppLayout'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/post/:id', element: <PostDetailPage /> },
      { path: '/search', element: <SearchPage /> },
      {
        path: '/create',
        element: (
          <RequireAuth>
            <EditorPage />
          </RequireAuth>
        ),
      },
      {
        path: '/profile',
        element: (
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        ),
      },
      {
        path: '/profile/edit',
        element: (
          <RequireAuth>
            <EditProfilePage />
          </RequireAuth>
        ),
      },
      { path: '/dev/ui', element: <UiGallery /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
])
