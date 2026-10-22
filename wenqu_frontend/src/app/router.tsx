import { createBrowserRouter } from 'react-router-dom'

import { UiGallery } from '@/dev/UiGallery'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

import { AppLayout } from './AppLayout'
import { RouteError } from './RouteError'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'search',
        element: (
          <PlaceholderPage
            title="搜索"
            description="关键词检索、前缀联想与游标分页将在阶段 7 接入。"
          />
        ),
      },
      {
        path: 'learn',
        element: <PlaceholderPage title="我的学习" description="收藏与阅读进度会在阶段 6 接入。" />,
      },
      {
        path: 'profile',
        element: (
          <PlaceholderPage title="个人主页" description="资料编辑与我的知文将在阶段 6 接入。" />
        ),
      },
      { path: 'dev/ui', element: <UiGallery /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
