// Edge case: provide() that references this — instance-dependent provide function.
// Vue 2 provide as function can access this. Migration to setup() provide needs
// reactive wrappers since provide() in setup doesn't have this.
export default {
  data() {
    return {
      config: {
        apiEndpoint: '/api/v2',
        maxRetries: 3,
        timeout: 5000
      },
      currentTheme: 'light',
      refreshCount: 0
    }
  },

  provide() {
    return {
      sharedConfig: this.config,
      sharedTheme: this.currentTheme,
      refreshData: this.refresh,
      getConfigValue: this.getConfigValue
    }
  },

  methods: {
    refresh() {
      this.refreshCount++
      this.$emit('data-refreshed', this.refreshCount)
    },

    getConfigValue(key) {
      return this.config[key]
    },

    updateConfig(key, value) {
      this.config = { ...this.config, [key]: value }
    },

    switchTheme(theme) {
      this.currentTheme = theme
    }
  }
}
