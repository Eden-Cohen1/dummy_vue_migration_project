// Edge case: Mixin that uses another mixin (loadingMixin) AND has external
// dependencies from the component — expects this.entityId to be provided
// by the component's data. Tests chain resolution + external dep detection.
import loadingMixin from '@/mixins/loadingMixin'

export default {
  mixins: [loadingMixin],

  data() {
    return {
      cacheStore: {},
      cacheTTL: 300000,
      isCacheEnabled: true
    }
  },

  computed: {
    cacheSize() {
      return Object.keys(this.cacheStore).length
    },

    isCacheStale() {
      const key = this.getCacheKey()
      const entry = this.cacheStore[key]
      if (!entry) return true
      return Date.now() - entry.timestamp > this.cacheTTL
    }
  },

  methods: {
    getCacheKey() {
      return `entity_${this.entityId}`
    },

    getFromCache(key) {
      const entry = this.cacheStore[key || this.getCacheKey()]
      if (!entry) return null
      if (Date.now() - entry.timestamp > this.cacheTTL) {
        this.invalidateCache(key)
        return null
      }
      return entry.data
    },

    setInCache(data, key) {
      const cacheKey = key || this.getCacheKey()
      this.cacheStore = {
        ...this.cacheStore,
        [cacheKey]: { data, timestamp: Date.now() }
      }
    },

    invalidateCache(key) {
      const cacheKey = key || this.getCacheKey()
      const { [cacheKey]: _, ...rest } = this.cacheStore
      this.cacheStore = rest
    },

    clearAllCache() {
      this.cacheStore = {}
    }
  }
}
