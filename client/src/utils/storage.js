const THEME_KEY = 'vsi:theme:v1'

export function loadTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    return stored === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Incognito, quota exceeded, or disabled storage
  }
}
