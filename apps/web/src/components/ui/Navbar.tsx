import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  CheckCircle2,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  User as UserIcon,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useClickOutside } from '@/hooks/useClickOutside'
import { Badge, Button } from '@/components/ui'

interface NavbarProps {
  onMobileMenuToggle?: () => void
  onOpenCommandPalette?: () => void
}

export function Navbar({ onMobileMenuToggle, onOpenCommandPalette }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => setDropdownOpen(false))

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dropdownOpen) {
        setDropdownOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dropdownOpen])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/login')
  }

  const toggleTheme = () => {
    const isCurrentlyDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setTheme(isCurrentlyDark ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-20 h-14 bg-[var(--bg-secondary)]/95 backdrop-blur-md border-b border-[var(--border-color)] px-4 sm:px-6 flex items-center justify-between transition-colors shadow-xs">
      {/* Mobile Menu & Search Input */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
          aria-label="Open Mobile Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-48 sm:w-72">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search resources... (Ctrl+K)"
            onClick={onOpenCommandPalette}
            readOnly={!!onOpenCommandPalette}
            className="w-full bg-[var(--bg-primary)] text-xs font-medium text-[var(--text-primary)] pl-8 pr-3 py-1.5 rounded-md border border-[var(--border-color)] focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] placeholder-[var(--text-secondary)] transition-colors cursor-pointer shadow-2xs"
            aria-label="Global Search"
          />
        </div>
      </div>

      {/* Right Navbar Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* System Status Indicator */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-[#238636]/10 border border-emerald-300 dark:border-[#238636]/30 rounded-full text-xs font-semibold text-emerald-700 dark:text-[#3fb950]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>All Systems Operational</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] cursor-pointer"
          title="Toggle Dark/Light Theme"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] cursor-pointer"
          title="Notifications"
          aria-label="View Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2f81f7] rounded-full" />
        </button>

        {/* Authentication State / User Menu */}
        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-label="User account menu"
              className="flex items-center space-x-2 p-1 rounded-md hover:bg-[var(--bg-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#2f81f7] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {user.full_name ? user.full_name[0] : 'U'}
              </div>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-56 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-2xl py-1.5 z-50 text-xs text-[var(--text-primary)]"
                  role="menu"
                >
                  <div className="px-4 py-2 border-b border-[var(--border-color)]">
                    <p className="font-semibold text-sm truncate">{user.full_name}</p>
                    <p className="text-[var(--text-secondary)] truncate">{user.email}</p>
                    <div className="mt-1.5">
                      <Badge variant="info" showDot={false}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                    role="menuitem"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Dashboard Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-[#f85149] hover:bg-[#da3633]/10 transition-colors text-left cursor-pointer"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
