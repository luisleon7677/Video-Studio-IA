import { useCallback, useEffect, useState } from 'react'
import { loadTheme, saveTheme } from '../utils/storage'

function applyThemeClass(isDark) {
  document.documentElement.classList.toggle('dark', isDark)
}

export function useTheme() {
  const [isDark, setIsDark] = useState(() => loadTheme() === 'dark')

  useEffect(() => {
    applyThemeClass(isDark)
    saveTheme(isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev)
  }, [])

  return { isDark, toggleTheme }
}
