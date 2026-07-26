import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light')
    else setTheme('dark')
  }

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80 sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            <span className="inline-block h-6 w-6 rounded-md bg-indigo-600 font-extrabold text-white text-center leading-6 text-sm">
              X
            </span>
            OpenDevX
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </Button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4 dark:border-gray-800">
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  {user.full_name}
                </p>
                <div className="mt-0.5">
                  <Badge variant={user.role === 'admin' ? 'error' : user.role === 'operator' ? 'warning' : 'info'}>
                    {user.role}
                  </Badge>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
