import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FolderGit2,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui'

interface NavItem {
  name: string
  path: string
  icon: React.ElementType
  badge?: string
  adminOnly?: boolean
  operatorOnly?: boolean
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderGit2 },
  { name: 'Copilot', path: '#copilot', icon: Sparkles, badge: 'AI' },
  { name: 'Users', path: '/users', icon: Users, adminOnly: true },
  { name: 'Audit Logs', path: '/audit-logs', icon: ShieldCheck, operatorOnly: true },
  { name: 'Metrics', path: '/metrics', icon: Activity },
  { name: 'Docs', path: '/docs', icon: BookOpen },
]


interface SidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  const userRole = user?.role?.toLowerCase() || 'viewer'
  const isAdmin = userRole === 'admin'
  const isOperator = userRole === 'operator' || isAdmin

  const filteredNav = navItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false
    if (item.operatorOnly && !isOperator) return false
    return true
  })

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors">
      {/* Brand Header */}
      <div className={`flex items-center justify-between h-14 ${collapsed && !isMobileOpen ? 'px-2' : 'px-4'} border-b border-[var(--border-color)] transition-all flex-shrink-0`}>
        <Link
          to="/"
          onClick={onMobileClose}
          title="OpenDevX Platform"
          className="flex items-center space-x-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] rounded-md p-1 flex-shrink-0"
        >
          <div className="p-1.5 bg-[#238636] rounded-md text-white flex-shrink-0 shadow-sm transition-transform hover:scale-105">
            <Terminal className="w-5 h-5" />
          </div>
          {(!collapsed || isMobileOpen) && (
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
                OpenDevX
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono tracking-widest">
                Platform
              </span>
            </div>
          )}
        </Link>
        {isMobileOpen ? (
          <button
            type="button"
            onClick={onMobileClose}
            className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors focus:outline-none flex-shrink-0"
            aria-label="Close Mobile Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors focus:outline-none cursor-pointer flex-shrink-0"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const Icon = item.icon
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path))

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onMobileClose}
              title={collapsed && !isMobileOpen ? item.name : undefined}
              className={`relative flex items-center h-10 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${
                collapsed && !isMobileOpen ? 'justify-center px-0' : 'px-3'
              } ${
                isActive
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold shadow-xs border border-[var(--border-color)]/60'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/80'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute left-0 w-1 h-5 bg-[var(--accent-color)] rounded-r-full"
                />
              )}
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-[var(--accent-color)]' : 'group-hover:text-[var(--accent-color)]'
                }`}
              />
              {(!collapsed || isMobileOpen) && (
                <span className="ml-3 text-xs tracking-wide flex-1 truncate">
                  {item.name}
                </span>
              )}
              {(!collapsed || isMobileOpen) && item.badge && (
                <Badge variant="info" showDot={false}>
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Role Footer */}
      {(!collapsed || isMobileOpen) && user && (
        <div className="p-3 m-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl flex items-center justify-between shadow-xs transition-colors">
          <div className="flex flex-col truncate pr-2">
            <span className="text-xs font-bold text-[var(--text-primary)] truncate">
              {user.full_name}
            </span>
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] truncate">
              {user.email}
            </span>
          </div>
          <Badge variant={isAdmin ? 'danger' : isOperator ? 'warning' : 'neutral'} showDot={false} className="capitalize">
            {user.role}
          </Badge>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="hidden md:flex relative flex-col h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-color)] text-[var(--text-primary)] select-none z-30 flex-shrink-0"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Slide-Over Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="md:hidden fixed inset-y-0 left-0 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] z-50 shadow-2xl flex flex-col"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
