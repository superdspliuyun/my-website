import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'my-website-theme'

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

    if (savedTheme === 'dark') {
      return true
    }

    if (savedTheme === 'light') {
      return false
    }
  } catch {
    // Fall back to the system preference when browser storage is unavailable.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  function toggleTheme() {
    const nextTheme = !isDark

    setIsDark(nextTheme)

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme ? 'dark' : 'light')
    } catch {
      // The selected theme still applies for this session if storage is unavailable.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      aria-label={isDark ? '切换为亮色模式' : '切换为暗色模式'}
      aria-pressed={isDark}
    >
      {isDark ? '亮色模式' : '暗色模式'}
    </button>
  )
}

export default ThemeToggle
