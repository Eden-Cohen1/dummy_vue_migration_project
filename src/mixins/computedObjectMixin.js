// Edge case: Computed properties returning object literals { key: value }.
// A string parser might confuse the opening { of the return value with a
// new block scope, breaking brace counting.
export default {
  data() {
    return {
      settings: {
        theme: 'light',
        fontSize: 14,
        language: 'en'
      },
      userPrefs: {
        showSidebar: true,
        compactMode: false
      },
      count: 0,
      status: 'idle'
    }
  },

  computed: {
    mergedConfig() {
      return {
        ...this.settings,
        ...this.userPrefs,
        timestamp: Date.now()
      }
    },

    statusMap() {
      return {
        active: this.count > 0,
        empty: this.count === 0,
        idle: this.status === 'idle',
        busy: this.status === 'busy'
      }
    },

    themeConfig() {
      return {
        backgroundColor: this.settings.theme === 'dark' ? '#1a1a2e' : '#ffffff',
        textColor: this.settings.theme === 'dark' ? '#e0e0e0' : '#333333',
        fontSize: `${this.settings.fontSize}px`,
        fontFamily: this.userPrefs.compactMode ? 'monospace' : 'sans-serif'
      }
    },

    styleObject() {
      // Nested object literal return
      return {
        container: {
          padding: this.userPrefs.compactMode ? '4px' : '16px',
          margin: '0 auto'
        },
        header: {
          fontSize: `${this.settings.fontSize + 4}px`,
          fontWeight: 'bold'
        }
      }
    }
  },

  methods: {
    applyConfig(overrides = {}) {
      // Method also returns object literal
      const config = {
        ...this.mergedConfig,
        ...overrides
      }
      this.settings = { ...this.settings, ...config }
      return { applied: true, config }
    }
  }
}
