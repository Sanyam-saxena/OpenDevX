import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/ui/Navbar'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
