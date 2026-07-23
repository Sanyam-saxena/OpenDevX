import { useContext } from 'react'
import { ThemeContext } from '@/providers/ThemeContext'
import type { Theme } from '@/types/theme'

interface UseThemeReturn {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export function useTheme(): UseThemeReturn {
  const context = useContext(ThemeContext)
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
