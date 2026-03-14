<template>
  <!-- Edge case: Component overrides mixin method. Component defines its own selectAll()
       that calls super behavior then does extra work. -->
  <div class="batch-actions" v-if="hasSelection || showAlways">
    <div class="batch-actions-bar">
      <div class="selection-info">
        <input
          type="checkbox"
          class="select-all-checkbox"
          :checked="allSelected"
          @change="selectAll(availableItems)"
        />
        <span class="selection-label">
          {{ hasSelection ? selectionCount + ' selected' : 'Select all' }}
        </span>
      </div>

      <div class="action-buttons" v-if="hasSelection">
        <button
          v-if="canEdit"
          class="btn-action btn-edit"
          @click="handleBulkEdit"
          :disabled="isLoading"
        >
          Edit
        </button>
        <button
          v-if="canCreate"
          class="btn-action btn-duplicate"
          @click="handleDuplicate"
          :disabled="isLoading"
        >
          Duplicate
        </button>
        <button
          class="btn-action btn-archive"
          @click="handleArchive"
          :disabled="isLoading"
        >
          Archive
        </button>
        <button
          v-if="canDelete"
          class="btn-action btn-delete"
          @click="handleDelete"
          :disabled="isLoading"
        >
          Delete
        </button>
      </div>

      <div class="batch-status" v-if="isLoading">
        <div class="spinner-small"></div>
        <span>{{ loadingMessage }}</span>
      </div>

      <div v-if="hasError" class="batch-error">
        <span>{{ error }}</span>
        <button v-if="canRetry" @click="retry(() => lastAction())" class="btn-retry-small">Retry</button>
      </div>
    </div>

    <div class="selection-mode-toggle">
      <button
        class="mode-btn"
        :class="{ active: selectionMode === 'single' }"
        @click="selectionMode = 'single'"
      >
        Single
      </button>
      <button
        class="mode-btn"
        :class="{ active: selectionMode === 'multiple' }"
        @click="selectionMode = 'multiple'"
      >
        Multiple
      </button>
    </div>
  </div>
</template>

<script>
import selectionMixin from '@/mixins/selectionMixin'
import permissionMixin from '@/mixins/permissionMixin'
import loadingMixin from '@/mixins/loadingMixin'
import { api } from '@/services/api'

export default {
  name: 'BatchActions',

  mixins: [selectionMixin, permissionMixin, loadingMixin],

  props: {
    availableItems: {
      type: Array,
      default: () => []
    },
    showAlways: {
      type: Boolean,
      default: false
    },
    entityType: {
      type: String,
      default: 'item'
    }
  },

  data() {
    return {
      lastAction: null
    }
  },

  methods: {
    selectAll(items) {
      // Call the mixin's selectAll first, then add custom tracking logic
      this.$options.mixins[0].methods.selectAll.call(this, items)

      // Custom logic: log the bulk selection event and notify parent
      this.$emit('bulk-selection', {
        count: items.length,
        timestamp: Date.now(),
        entityType: this.entityType
      })
    },

    async handleBulkEdit() {
      this.$emit('bulk-edit', this.selectedItems)
    },

    async handleDuplicate() {
      this.startLoading('Duplicating items...')
      this.lastAction = this.handleDuplicate
      try {
        const ids = this.selectedItems.map((item) => item.id)
        await api.post(`/${this.entityType}s/duplicate`, { ids })
        this.$emit('items-duplicated', ids)
        this.deselectAll()
      } catch (err) {
        this.setError(err.message || 'Failed to duplicate items')
      } finally {
        this.stopLoading()
      }
    },

    async handleArchive() {
      this.startLoading('Archiving items...')
      this.lastAction = this.handleArchive
      try {
        const ids = this.selectedItems.map((item) => item.id)
        await api.post(`/${this.entityType}s/archive`, { ids })
        this.$emit('items-archived', ids)
        this.deselectAll()
      } catch (err) {
        this.setError(err.message || 'Failed to archive items')
      } finally {
        this.stopLoading()
      }
    },

    async handleDelete() {
      if (!this.canDelete) return

      this.startLoading('Deleting items...')
      this.lastAction = this.handleDelete
      try {
        const ids = this.selectedItems.map((item) => item.id)
        await api.delete(`/${this.entityType}s/bulk`, { data: { ids } })
        this.$emit('items-deleted', ids)
        this.deselectAll()
      } catch (err) {
        this.setError(err.message || 'Failed to delete items')
      } finally {
        this.stopLoading()
      }
    }
  }
}
</script>

<style scoped>
.batch-actions {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}

.batch-actions-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.375rem;
}

.btn-action {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-action:hover:not(:disabled) {
  background: #f3f4f6;
}

.btn-delete {
  color: #dc2626;
  border-color: #fecaca;
}

.btn-delete:hover:not(:disabled) {
  background: #fef2f2;
}

.batch-error {
  color: #dc2626;
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selection-mode-toggle {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.mode-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border: 1px solid #d1d5db;
  background: #fff;
  cursor: pointer;
  border-radius: 4px;
}

.mode-btn.active {
  background: #4f46e5;
  color: #fff;
  border-color: #4f46e5;
}
</style>
