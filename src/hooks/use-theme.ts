import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

export type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setTheme] = useKV<Theme>('app-theme', 'system')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    const currentTheme = theme || 'system'

    if (currentTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(currentTheme)
  }, [theme])

  return { theme, setTheme }
}
