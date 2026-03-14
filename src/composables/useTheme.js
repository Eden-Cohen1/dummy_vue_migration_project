// Edge case: Intentionally MISSING applyTheme method.
// themeMixin has applyTheme() and a watcher 'currentTheme: applyTheme' string handler.
// This composable omits applyTheme entirely. Tests BLOCKED_NOT_RETURNED.
import { ref, computed } from 'vue'

export function useTheme() {
  const currentTheme = ref('light')
  const themes = ref(['light', 'dark', 'blue'])
  const customColors = ref({})

  const themeClass = computed(() => `theme-${currentTheme.value}`)

  const isDarkMode = computed(() => currentTheme.value === 'dark')

  const themeVariables = computed(() => {
    const vars = {
      light: { '--bg': '#ffffff', '--text': '#333333' },
      dark: { '--bg': '#1a1a2e', '--text': '#e0e0e0' },
      blue: { '--bg': '#e3f2fd', '--text': '#0d47a1' }
    }
    return vars[currentTheme.value] || vars.light
  })

  function setTheme(name) {
    if (themes.value.includes(name)) {
      currentTheme.value = name
      localStorage.setItem('selectedTheme', name)
    }
  }

  function toggleDarkMode() {
    currentTheme.value = isDarkMode.value ? 'light' : 'dark'
  }

  // NOTE: applyTheme intentionally NOT implemented

  return {
    currentTheme,
    themes,
    customColors,
    themeClass,
    isDarkMode,
    themeVariables,
    setTheme,
    toggleDarkMode
    // NOTE: applyTheme intentionally NOT returned
  }
}
