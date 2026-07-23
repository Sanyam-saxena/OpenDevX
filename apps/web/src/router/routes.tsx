import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { MinimalLayout } from '@/layouts/MinimalLayout'
import { LoadingPage } from '@/pages/LoadingPage'

const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage })),
)

const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<LoadingPage />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: withSuspense(<HomePage />),
      },
    ],
  },
  {
    element: <MinimalLayout />,
    children: [
      {
        path: '*',
        element: withSuspense(<NotFoundPage />),
      },
    ],
  },
])
