import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { ThemeProvider, responsiveFontSizes } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createAppTheme } from '../theme/index.js'
import { defaultPreferences } from '../theme/dev-fox/preferences.js'

const ThemeContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = () => useContext(ThemeContext)

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'system')

  const systemMode = useMemo(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [])

  const activeMode = mode === 'system' ? systemMode : mode

  const theme = useMemo(() => {
    const baseTheme = createAppTheme(activeMode, defaultPreferences.themeId)

    return responsiveFontSizes(baseTheme, {
      breakpoints: ['sm', 'md', 'lg'],
      factor: 2,
      variants: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2'],
    })
  }, [activeMode])

  useEffect(() => {
    localStorage.setItem('themeMode', mode)
  }, [mode])

  const toggleTheme = (newMode) => {
    setMode(newMode)
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
