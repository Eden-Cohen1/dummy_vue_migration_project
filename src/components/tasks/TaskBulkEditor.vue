<template>
  <!-- Edge case: 5 mixins with name collisions. loadingMixin has `error`,
       validationMixin has `errors`, formMixin has `formErrors`.
       Three different error-tracking patterns collide. -->
  <div class="task-bulk-editor">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p class="loading-text">{{ loadingMessage }}</p>
    </div>

    <div v-else class="bulk-editor-content">
      <div class="selection-summary" v-if="hasSelection">
        <span class="selection-count">{{ selectionCount }} tasks selected</span>
        <button class="btn-clear" @click="deselectAll">Clear Selection</button>
      </div>

      <form ref="form" @submit.prevent="submitBulkEdit" class="bulk-form">
        <div class="form-group">
          <label for="bulk-status">Status</label>
          <select id="bulk-status" v-model="formData.status" @change="isDirty = true">
            <option value="">-- No Change --</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div class="form-group">
          <label for="bulk-priority">Priority</label>
          <select id="bulk-priority" v-model="formData.priority" @change="isDirty = true">
            <option value="">-- No Change --</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div class="form-group">
          <label for="bulk-assignee">Assignee</label>
          <input id="bulk-assignee" v-model="formData.assignee" placeholder="Enter assignee name" />
        </div>

        <div class="validation-errors" v-if="!isValid">
          <p class="error-heading">Please fix the following errors:</p>
          <ul>
            <li v-for="(msg, field) in errors" :key="field">{{ field }}: {{ msg }}</li>
          </ul>
        </div>

        <div class="form-errors" v-if="Object.keys(formErrors).length > 0">
          <p v-for="(msg, field) in formErrors" :key="field" class="form-error-item">
            {{ field }}: {{ msg }}
          </p>
        </div>

        <div v-if="hasError" class="global-error">
          <p class="error-text">{{ error }}</p>
          <button v-if="canRetry" @click="retry(() => submitBulkEdit())" class="btn-retry">
            Retry
          </button>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn-primary"
            :disabled="!hasSelection || isSubmitting || !canEdit"
            v-if="canEdit"
          >
            {{ isSubmitting ? 'Applying...' : 'Apply Changes' }}
          </button>
          <button type="button" class="btn-secondary" @click="resetForm" :disabled="!isDirty">
            Reset
          </button>
          <button
            type="button"
            class="btn-danger"
            v-if="canDelete"
            :disabled="!hasSelection"
            @click="bulkDelete"
          >
            Delete Selected
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import validationMixin from '@/mixins/validationMixin'
import loadingMixin from '@/mixins/loadingMixin'
import selectionMixin from '@/mixins/selectionMixin'
import permissionMixin from '@/mixins/permissionMixin'
import { api } from '@/services/api'

export default {
  name: 'TaskBulkEditor',

  mixins: [formMixin, validationMixin, loadingMixin, selectionMixin, permissionMixin],

  props: {
    tasks: {
      type: Array,
      default: () => []
    }
  },

  created() {
    this.initForm({
      status: '',
      priority: '',
      assignee: ''
    })
    this.addRule('status', (v) => v || this.formData.priority || this.formData.assignee ? true : 'At least one field must be set')
  },

  methods: {
    async submitBulkEdit() {
      if (!this.validate()) return

      this.startLoading('Applying bulk changes...')
      try {
        const payload = {
          taskIds: this.selectedItems.map((t) => t.id),
          changes: this.formData
        }
        await api.post('/tasks/bulk-update', payload)
        this.$emit('bulk-edit-complete', payload)
        this.deselectAll()
        this.resetForm()
      } catch (err) {
        this.setError(err.message || 'Failed to apply bulk changes')
      } finally {
        this.stopLoading()
      }
    },

    async bulkDelete() {
      this.startLoading('Deleting selected tasks...')
      try {
        const ids = this.selectedItems.map((t) => t.id)
        await api.post('/tasks/bulk-delete', { ids })
        this.$emit('bulk-delete-complete', ids)
        this.deselectAll()
      } catch (err) {
        this.setError(err.message || 'Failed to delete tasks')
      } finally {
        this.stopLoading()
      }
    }
  }
}
</script>

<style scoped>
.task-bulk-editor {
  position: relative;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.selection-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #eef2ff;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.validation-errors {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #fef2f2;
  border-radius: 6px;
  color: #dc2626;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
</style>
