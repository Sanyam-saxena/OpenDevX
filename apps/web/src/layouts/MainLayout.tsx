import { Outlet } from 'react-router-dom'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950">
        <nav aria-label="Primary navigation">
          <span className="text-sm font-semibold text-gray-400">
            Navigation coming soon
          </span>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
