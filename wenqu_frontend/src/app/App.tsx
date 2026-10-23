import { RouterProvider } from 'react-router-dom'

import { useThemeSync } from '@/stores/theme'

import { Providers } from './providers'
import { router } from './router'

export function App() {
  useThemeSync()

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
