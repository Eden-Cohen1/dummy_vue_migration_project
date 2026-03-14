<template>
  <div class="watcher-demo">
    <h3>Watcher Patterns Demo</h3>
    <div class="inputs">
      <input v-model="watchedValue" placeholder="Watched value" />
      <input v-model="nested.deep.value" placeholder="Deep value" />
      <input v-model="watchTarget" placeholder="Watch array target" />
    </div>
    <div class="log-section">
      <h4>Watch Log ({{ watchLog.length }})</h4>
      <div v-for="(entry, i) in watchLog" :key="i" class="log-entry">
        {{ entry.field }}: {{ entry.newVal }}
      </div>
      <button @click="clearWatchLog">Clear Log</button>
    </div>
    <div class="change-log-section">
      <h4>Change Log ({{ changeLog.length }})</h4>
      <div v-for="(entry, i) in changeLog" :key="'c'+i" class="log-entry">
        {{ entry.from }} → {{ entry.to }}
      </div>
      <button @click="clearLog">Clear</button>
    </div>
  </div>
</template>

<script>
import watcherMixin from '@/mixins/watcherMixin'
import watchArrayMixin from '@/mixins/watchArrayMixin'

export default {
  name: 'WatcherDemo',
  mixins: [watcherMixin, watchArrayMixin]
}
</script>

<style scoped>
.watcher-demo { padding: 1rem; }
.inputs { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.log-entry { padding: 0.25rem; font-family: monospace; font-size: 0.85rem; }
</style>
