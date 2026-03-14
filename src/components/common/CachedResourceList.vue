<template>
  <!-- Edge case: cacheMixin uses loadingMixin internally AND expects this.entityId
       from the component's data. Tests chain resolution + external dep detection. -->
  <div class="cached-resource-list">
    <div v-if="isLoading" class="loading">{{ loadingMessage }}</div>
    <div v-if="hasError" class="error">{{ error }}</div>

    <div class="cache-info">
      <span>Cache: {{ cacheSize }} entries</span>
      <span v-if="isCacheStale" class="stale-warning">Stale</span>
      <button @click="refreshData">Refresh</button>
      <button @click="clearAllCache">Clear Cache</button>
    </div>

    <div class="resource-list">
      <div v-for="item in cachedItems" :key="item.id" class="resource-item">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import cacheMixin from '@/mixins/cacheMixin'

export default {
  name: 'CachedResourceList',
  mixins: [cacheMixin],

  data() {
    return {
      entityId: 'resource-list-1',
      cachedItems: []
    }
  },

  created() {
    this.loadFromCache()
  },

  methods: {
    loadFromCache() {
      const cached = this.getFromCache()
      if (cached) {
        this.cachedItems = cached
      } else {
        this.refreshData()
      }
    },

    async refreshData() {
      this.startLoading('Fetching resources...')
      try {
        // Simulated fetch
        const items = [{ id: 1, name: 'Resource A' }, { id: 2, name: 'Resource B' }]
        this.cachedItems = items
        this.setInCache(items)
      } finally {
        this.stopLoading()
      }
    }
  }
}
</script>

<style scoped>
.cached-resource-list { padding: 1rem; }
.stale-warning { color: #ffc107; font-weight: bold; }
</style>
