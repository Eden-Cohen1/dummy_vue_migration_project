// Edge case: Feature flag management with external storage integration.
// Tests migration of mixins that import from external services and
// use async methods to load/persist configuration state.
import { getItem, setItem } from '@/services/storage'

export default {
  data() {
    return {
      featureFlags: {},
      flagsLoaded: false,
      flagSource: 'local'
    }
  },

  computed: {
    enabledFeatures() {
      return Object.keys(this.featureFlags).filter(key => {
        return this.featureFlags[key] === true
      })
    },

    enabledFeatureCount() {
      return this.enabledFeatures.length
    }
  },

  methods: {
    isFeatureEnabled(flag) {
      if (!this.flagsLoaded) return false
      return this.featureFlags[flag] === true
    },

    async loadFlags() {
      try {
        if (this.flagSource === 'local') {
          const stored = getItem('featureFlags')
          if (stored) {
            this.featureFlags = JSON.parse(stored)
          }
        } else if (this.flagSource === 'remote') {
          // Remote flag loading would go through an API
          const response = await fetch('/api/feature-flags')
          if (response.ok) {
            this.featureFlags = await response.json()
          }
        }
        this.flagsLoaded = true
      } catch (err) {
        console.warn('[featureFlagMixin] Failed to load flags:', err)
        this.featureFlags = {}
        this.flagsLoaded = true
      }
    },

    toggleFlag(flag) {
      const current = this.featureFlags[flag] || false
      this.featureFlags = {
        ...this.featureFlags,
        [flag]: !current
      }
      this._persistFlags()
      this.$emit('flag-toggled', { flag, enabled: !current })
    },

    setFlags(flags) {
      this.featureFlags = { ...flags }
      this.flagsLoaded = true
      this._persistFlags()
    },

    _persistFlags() {
      try {
        setItem('featureFlags', JSON.stringify(this.featureFlags))
      } catch (err) {
        console.warn('[featureFlagMixin] Failed to persist flags:', err)
      }
    }
  },

  created() {
    this.loadFlags()
  }
}
