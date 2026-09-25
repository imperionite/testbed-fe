import { createContext, useContext } from 'react'

export const defaultPreferences = { mode: 'light', themeId: 'shadTheme' }
export const PreferencesContext = createContext({
  preferences: defaultPreferences,
  updatePreferences: () => {},
})
export const usePreferences = () => useContext(PreferencesContext)
