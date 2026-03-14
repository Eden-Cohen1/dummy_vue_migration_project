<template>
  <!-- Edge case: Uses only auditMixin (level 1 of 5-level chain) to verify
       that partial chain usage works independently of the full chain. -->
  <div class="audit-log-viewer">
    <div class="audit-header">
      <h3>Audit Log</h3>
      <span>{{ auditCount }} entries</span>
      <label>
        <input type="checkbox" v-model="auditEnabled" /> Enabled
      </label>
    </div>

    <div class="audit-entries">
      <div v-for="(entry, index) in auditTrail" :key="index" class="audit-entry">
        <span class="action">{{ entry.action }}</span>
        <span class="timestamp">{{ entry.timestamp }}</span>
        <span class="details">{{ JSON.stringify(entry.details) }}</span>
      </div>
    </div>

    <div v-if="lastAction" class="last-action">
      Last action: {{ lastAction.action }} at {{ lastAction.timestamp }}
    </div>

    <div class="audit-actions">
      <button @click="logAction('manual_entry', { note: 'Test' })">Add Entry</button>
      <button @click="clearAuditTrail">Clear Log</button>
    </div>
  </div>
</template>

<script>
import auditMixin from '@/mixins/auditMixin'

export default {
  name: 'AuditLogViewer',
  mixins: [auditMixin]
}
</script>

<style scoped>
.audit-log-viewer { padding: 1rem; }
.audit-entry {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid #eee;
}
.action { font-weight: bold; }
.timestamp { color: #666; font-size: 0.875rem; }
</style>
