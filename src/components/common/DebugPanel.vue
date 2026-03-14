<template>
  <div class="debug-panel">
    <div class="log-section">
      <h3>Debug Log ({{ logEntries.length }} entries)</h3>
      <div v-for="(entry, i) in recentLogs" :key="i" class="log-entry">
        {{ entry.message }}
      </div>
    </div>
    <div class="items-section">
      <h3>Active Items ({{ activeItems.length }})</h3>
      <ul>
        <li v-for="item in activeItems" :key="item.id">{{ item.name }}</li>
      </ul>
    </div>
    <button @click="logEvent('test', { action: 'click' })">Log Test Event</button>
    <button @click="processItems()">Process Items</button>
    <pre>{{ debugSummary }}</pre>
  </div>
</template>

<script>
import stringContainsCodeMixin from '@/mixins/stringContainsCodeMixin'
import arrowFunctionMixin from '@/mixins/arrowFunctionMixin'

export default {
  name: 'DebugPanel',
  mixins: [stringContainsCodeMixin, arrowFunctionMixin]
}
</script>

<style scoped>
.debug-panel { padding: 1rem; font-family: monospace; }
.log-entry { padding: 0.25rem; border-bottom: 1px solid #eee; font-size: 0.85rem; }
</style>
