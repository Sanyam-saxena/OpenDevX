import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'sonner'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { Navbar } from '@/components/ui/Navbar'
import { Sidebar } from './Sidebar'
import { useTheme } from '@/hooks/useTheme'
import { AiCopilotDrawer } from '@/components/ai/AiCopilotDrawer'

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const location = useLocation()
  const { theme } = useTheme()
  const toasterTheme = theme === 'dark' ? 'dark' : 'light'

  const isHomePage = location.pathname === '/'

  // Global Ctrl+K / Cmd+K listener & hash listener for Copilot
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (location.hash === '#copilot') {
      setCopilotOpen(true)
    }
  }, [location.hash])

  const handleCloseCopilot = () => {
    setCopilotOpen(false)
    if (window.location.hash === '#copilot') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <Toaster position="top-right" theme={toasterTheme} richColors />

      {/* Desktop Sidebar & Mobile Drawer — hidden on homepage */}
      {!isHomePage && (
        <Sidebar
          isMobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
          onToggleCopilot={() => setCopilotOpen(true)}
        />
      )}

      <div className="flex flex-col flex-1 h-screen overflow-hidden min-w-0">
        <Navbar
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[var(--bg-primary)] relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.995 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={isHomePage ? 'w-full' : 'max-w-7xl mx-auto space-y-6'}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Command Palette Search Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* DevOps AI Copilot Side Drawer */}
      <AiCopilotDrawer
        isOpen={copilotOpen}
        onClose={handleCloseCopilot}
      />
    </div>
  )
}


