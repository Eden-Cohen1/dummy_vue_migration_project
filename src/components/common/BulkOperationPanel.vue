<template>
  <!-- Edge case: asyncOperationMixin internally uses loadingMixin + notificationMixin.
       Component adds selectionMixin on top. Tests deep composite mixin chains. -->
  <div class="bulk-operation-panel">
    <div class="selection-info" v-if="hasSelection">
      {{ selectionCount }} items selected
      <button @click="deselectAll">Clear Selection</button>
    </div>

    <div class="queue-info">
      <span>Queue: {{ pendingOperationCount }} pending</span>
      <span>Progress: {{ operationProgress }}%</span>
    </div>

    <div v-if="isLoading" class="processing">
      {{ loadingMessage }}
    </div>

    <div class="actions">
      <button @click="bulkDelete" :disabled="!hasSelection || isProcessing">Delete Selected</button>
      <button @click="bulkExport" :disabled="!hasSelection">Export Selected</button>
      <button @click="processQueue" :disabled="queueIsEmpty || isProcessing">Process Queue</button>
    </div>

    <div v-if="notifications.length" class="notifications">
      <div v-for="n in sortedNotifications" :key="n.id" :class="n.type">
        {{ n.message }}
      </div>
    </div>
  </div>
</template>

<script>
import asyncOperationMixin from '@/mixins/asyncOperationMixin'
import selectionMixin from '@/mixins/selectionMixin'

export default {
  name: 'BulkOperationPanel',
  mixins: [asyncOperationMixin, selectionMixin],

  methods: {
    bulkDelete() {
      this.selectedItems.forEach(item => {
        this.enqueueOperation({
          type: 'delete',
          targetId: item.id,
          handler: async () => {
            // simulated delete
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        })
      })
      this.processQueue()
    },

    bulkExport() {
      this.enqueueOperation({
        type: 'export',
        handler: async () => {
          const data = JSON.stringify(this.selectedItems)
          console.log('Exported:', data)
        }
      })
    }
  }
}
</script>

<style scoped>
.bulk-operation-panel { padding: 1rem; }
.queue-info { display: flex; gap: 1rem; margin: 0.5rem 0; }
</style>
