import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  User as UserIcon,
  AlertTriangle,
  AlertCircle,
  Info,
  GitMerge,
  DollarSign,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useClickOutside } from '@/hooks/useClickOutside'
import { Badge, Button } from '@/components/ui'

interface NavbarProps {
  onMobileMenuToggle?: () => void
  onOpenCommandPalette?: () => void
}

type NotifKind = 'success' | 'warning' | 'error' | 'info'

interface Notification {
  id: string
  kind: NotifKind
  title: string
  body: string
  time: string
  read: boolean
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    kind: 'success',
    title: 'Pipeline completed',
    body: 'CI/CD DAG for "balabalaba" finished all 5 stages successfully.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'n2',
    kind: 'error',
    title: 'Deployment failed',
    body: 'Helm deployment to EKS cluster failed on stage 4 — image pull backoff.',
    time: '18 min ago',
    read: false,
  },
  {
    id: 'n3',
    kind: 'warning',
    title: 'Cost anomaly detected',
    body: 'FinOps engine flagged an unexpected 34 % spend increase on RDS instances.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 'n4',
    kind: 'info',
    title: 'Gemini AI RCA complete',
    body: 'Root cause identified: OOM pod termination in namespace "prod-api". Auto-fix available.',
    time: '3 hr ago',
    read: true,
  },
  {
    id: 'n5',
    kind: 'success',
    title: 'New project created',
    body: '"E2E Simulation AI Project" was added and linked to your workspace.',
    time: 'Yesterday',
    read: true,
  },
]

const kindMeta: Record<NotifKind, { icon: React.ElementType; colour: string; bg: string }> = {
  success: { icon: CheckCircle2, colour: 'text-[#3fb950]', bg: 'bg-[#238636]/15' },
  warning: { icon: AlertTriangle, colour: 'text-[#d29922]', bg: 'bg-[#d29922]/15' },
  error:   { icon: AlertCircle,  colour: 'text-[#f85149]', bg: 'bg-[#da3633]/15' },
  info:    { icon: Info,          colour: 'text-[#2f81f7]', bg: 'bg-[#2f81f7]/15' },
}

/** Map notification id prefix to a meaningful icon for variety */
const bodyIconMap: Record<string, React.ElementType> = {
  n1: GitMerge,
  n2: AlertCircle,
  n3: DollarSign,
  n4: Sparkles,
  n5: CheckCircle2,
}

export function Navbar({ onMobileMenuToggle, onOpenCommandPalette }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const unreadCount = notifications.filter((n) => !n.read).length

  useClickOutside(dropdownRef, () => setDropdownOpen(false))
  useClickOutside(notifRef, () => setNotifOpen(false))

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false)
        setNotifOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  const toggleTheme = () => {
    const isCurrentlyDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setTheme(isCurrentlyDark ? 'light' : 'dark')
  }

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))

  const deleteNotif = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id))

  return (
    <header className="sticky top-0 z-20 h-14 bg-[var(--bg-secondary)]/95 backdrop-blur-md border-b border-[var(--border-color)] px-4 sm:px-6 flex items-center justify-between transition-colors shadow-xs">
      {/* Mobile Menu, Native Back Button & Search Input */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
          aria-label="Open Mobile Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {isHomePage ? (
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-color)] text-white flex items-center justify-center font-bold text-xs">
              OX
            </div>
            <span className="font-extrabold text-sm tracking-tight text-[var(--text-primary)]">
              OpenDevX
            </span>
          </Link>
        ) : (
          <>
            {/* Universal Native UI Back Button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all cursor-pointer shadow-2xs group shrink-0"
              title="Go back to previous page"
              aria-label="Back to previous page"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[var(--accent-color)] transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="relative w-40 sm:w-72">
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
          </>
        )}
      </div>

      {/* Right Navbar Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* System Status Indicator - Hidden on Homepage */}
        {!isHomePage && (
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-[#238636]/10 border border-emerald-300 dark:border-[#238636]/30 rounded-full text-xs font-semibold text-emerald-700 dark:text-[#3fb950]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All Systems Operational</span>
          </div>
        )}

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

        {/* Notifications - Hidden on Homepage */}
        {!isHomePage && (
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] cursor-pointer"
              title="Notifications"
              aria-label="View Notifications"
              aria-expanded={notifOpen}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 min-w-[14px] h-[14px] flex items-center justify-center bg-[#2f81f7] text-white text-[9px] font-bold rounded-full px-0.5 leading-none"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </button>

            {/* Notification Panel */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl z-50 overflow-hidden"
                  role="dialog"
                  aria-label="Notifications panel"
                >
                  {/* Panel Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-[var(--accent-color)]" />
                      <span className="text-sm font-bold text-[var(--text-primary)]">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-[#2f81f7]/15 text-[#2f81f7] text-[10px] font-bold rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[10px] font-semibold text-[var(--accent-color)] hover:underline cursor-pointer transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-color)]/50">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                        <Bell className="w-8 h-8 text-[var(--text-secondary)]/40" />
                        <p className="text-xs text-[var(--text-secondary)]">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const { icon: KindIcon, colour, bg } = kindMeta[notif.kind]
                        return (
                          <div
                            key={notif.id}
                            onClick={() => markRead(notif.id)}
                            className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--bg-surface)] ${
                              !notif.read ? 'bg-[var(--accent-color)]/[0.04]' : ''
                            }`}
                          >
                            {/* Kind icon */}
                            <div className={`shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center ${bg}`}>
                              <KindIcon className={`w-3.5 h-3.5 ${colour}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-xs font-semibold truncate ${!notif.read ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                  {notif.title}
                                </p>
                                <span className="text-[9px] text-[var(--text-secondary)] shrink-0 ml-2">
                                  {notif.time}
                                </span>
                              </div>
                              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-0.5 line-clamp-2">
                                {notif.body}
                              </p>
                            </div>

                            {/* Unread dot + delete */}
                            <div className="shrink-0 flex flex-col items-center gap-1.5 mt-1">
                              {!notif.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2f81f7]" />
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id) }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-[var(--text-secondary)] hover:text-[#f85149] cursor-pointer"
                                aria-label="Dismiss notification"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* Panel Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-[var(--border-color)] flex items-center justify-between">
                      <span className="text-[10px] text-[var(--text-secondary)]">
                        {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => setNotifications([])}
                        className="text-[10px] font-semibold text-[#f85149] hover:underline cursor-pointer"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

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
