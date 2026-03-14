// Edge case: inject consuming provide values from parent — uses inject: [...] array syntax.
// Tests migration of inject pattern alongside provide migration.
export default {
  inject: ['sharedConfig', 'sharedTheme', 'refreshData', 'getConfigValue'],

  computed: {
    configLabel() {
      return `API: ${this.sharedConfig.apiEndpoint} (${this.sharedTheme} theme)`
    },

    isLightTheme() {
      return this.sharedTheme === 'light'
    },

    configTimeout() {
      return this.getConfigValue('timeout')
    }
  },

  methods: {
    triggerRefresh() {
      this.refreshData()
    },

    readConfig(key) {
      return this.getConfigValue(key)
    }
  }
}
