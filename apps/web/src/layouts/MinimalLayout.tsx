import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { useTheme } from '@/hooks/useTheme'

export function MinimalLayout() {
  const location = useLocation()
  const { theme } = useTheme()
  const toasterTheme = theme === 'dark' ? 'dark' : 'light'

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-center items-center p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient mesh */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-grid-pattern opacity-30" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2f81f7]/15 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#238636]/15 blur-3xl rounded-full pointer-events-none -z-10" />

      <Toaster position="top-right" theme={toasterTheme} richColors />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center items-center"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
