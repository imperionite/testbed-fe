import { createAppTheme } from './dev-fox/create-app-theme'

export { createAppTheme }
export { defaultPreferences, PreferencesContext, usePreferences } from './dev-fox/preferences'
export { themePresets, presetTokens } from './dev-fox/presets'

const theme = createAppTheme('light', 'devfox')

export default theme
