import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { MinimalLayout } from '@/layouts/MinimalLayout'
import { LoadingPage } from '@/pages/LoadingPage'
import { ProtectedRoute } from '@/router/ProtectedRoute'

const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const ProjectsPage = lazy(() =>
  import('@/pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
)
const ProjectDetailPage = lazy(() =>
  import('@/pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })),
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
      {
        element: <ProtectedRoute requiredRole="viewer" />,
        children: [
          {
            path: '/dashboard',
            element: withSuspense(<DashboardPage />),
          },
          {
            path: '/projects',
            element: withSuspense(<ProjectsPage />),
          },
          {
            path: '/projects/:id',
            element: withSuspense(<ProjectDetailPage />),
          },
        ],
      },
    ],
  },
  {
    element: <MinimalLayout />,
    children: [
      {
        path: '/login',
        element: withSuspense(<LoginPage />),
      },
      {
        path: '/register',
        element: withSuspense(<RegisterPage />),
      },
      {
        path: '*',
        element: withSuspense(<NotFoundPage />),
      },
    ],
  },
])
