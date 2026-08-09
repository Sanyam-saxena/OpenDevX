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
const UsersPage = lazy(() =>
  import('@/pages/UsersPage').then((m) => ({ default: m.UsersPage })),
)
const AuditLogsPage = lazy(() =>
  import('@/pages/AuditLogsPage').then((m) => ({ default: m.AuditLogsPage })),
)
const MetricsPage = lazy(() =>
  import('@/pages/MetricsPage').then((m) => ({ default: m.MetricsPage })),
)
const DocsPage = lazy(() =>
  import('@/pages/DocsPage').then((m) => ({ default: m.DocsPage })),
)
const PublicSpecsPage = lazy(() =>
  import('@/pages/PublicSpecsPage').then((m) => ({ default: m.PublicSpecsPage })),
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
        path: '/docs',
        element: withSuspense(<DocsPage />),
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
          {
            path: '/metrics',
            element: withSuspense(<MetricsPage />),
          },
        ],
      },
      {
        element: <ProtectedRoute requiredRole="operator" />,
        children: [
          {
            path: '/audit-logs',
            element: withSuspense(<AuditLogsPage />),
          },
        ],
      },
      {
        element: <ProtectedRoute requiredRole="admin" />,
        children: [
          {
            path: '/users',
            element: withSuspense(<UsersPage />),
          },
        ],
      },
    ],
  },
  {
    element: <MinimalLayout />,
    children: [
      {
        path: '/specs',
        element: withSuspense(<PublicSpecsPage />),
      },
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
