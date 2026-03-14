<template>
  <!-- Edge case: undoRedoMixin's pushState interacts with formMixin's isDirty tracking.
       Both track "has changed" state but independently. -->
  <div class="task-template-editor">
    <div class="editor-header">
      <h2 class="editor-title">Task Template Editor</h2>
      <div class="editor-toolbar">
        <button
          class="btn-undo"
          :disabled="!canUndo"
          @click="handleUndo"
          title="Undo"
        >
          Undo ({{ historyLength }})
        </button>
        <button
          class="btn-redo"
          :disabled="!canRedo"
          @click="handleRedo"
          title="Redo"
        >
          Redo
        </button>
        <span v-if="isDirty" class="dirty-indicator">Unsaved changes</span>
        <span v-if="hasChanges" class="changes-badge">{{ dirtyFields.length }} field(s) modified</span>
      </div>
    </div>

    <form ref="form" @submit.prevent="saveTemplate" class="template-form">
      <div class="form-group">
        <label for="template-name">Template Name</label>
        <input
          id="template-name"
          v-model="formData.name"
          type="text"
          class="form-input"
          placeholder="e.g., Bug Report Template"
          @input="trackChange('name')"
          @blur="validateField('name')"
        />
        <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="template-description">Description</label>
        <textarea
          id="template-description"
          v-model="formData.description"
          class="form-textarea"
          rows="3"
          placeholder="Describe when this template should be used"
          @input="trackChange('description')"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="default-status">Default Status</label>
        <select id="default-status" v-model="formData.defaultStatus" class="form-select" @change="trackChange('defaultStatus')">
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
        </select>
      </div>

      <div class="form-group">
        <label for="default-priority">Default Priority</label>
        <select id="default-priority" v-model="formData.defaultPriority" class="form-select" @change="trackChange('defaultPriority')">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div class="form-group">
        <label>Checklist Items</label>
        <div v-for="(item, index) in formData.checklist" :key="index" class="checklist-item">
          <input
            v-model="formData.checklist[index]"
            type="text"
            class="form-input"
            placeholder="Checklist item..."
            @input="trackChange('checklist')"
          />
          <button type="button" class="btn-remove-item" @click="removeChecklistItem(index)">&times;</button>
        </div>
        <button type="button" class="btn-add-item" @click="addChecklistItem">+ Add Item</button>
      </div>

      <div class="validation-summary" v-if="!isValid">
        <p class="error-heading">Please fix the errors below:</p>
        <p v-for="(msg, field) in errors" :key="field" class="error-item">{{ field }}: {{ msg }}</p>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="isSubmitting || !isDirty">
          {{ isSubmitting ? 'Saving...' : 'Save Template' }}
        </button>
        <button type="button" class="btn-secondary" @click="resetForm" :disabled="!isDirty">
          Discard Changes
        </button>
        <button type="button" class="btn-clear-history" @click="clearHistory" :disabled="!canUndo && !canRedo">
          Clear History
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import undoRedoMixin from '@/mixins/undoRedoMixin'
import validationMixin from '@/mixins/validationMixin'
import { api } from '@/services/api'

export default {
  name: 'TaskTemplateEditor',

  mixins: [formMixin, undoRedoMixin, validationMixin],

  props: {
    templateId: {
      type: [String, Number],
      default: null
    }
  },

  created() {
    this.initForm({
      name: '',
      description: '',
      defaultStatus: 'todo',
      defaultPriority: 'medium',
      checklist: []
    })

    this.addRule('name', (v) => (v && v.trim().length >= 3) ? true : 'Template name must be at least 3 characters')

    if (this.templateId) {
      this.loadTemplate()
    }
  },

  methods: {
    trackChange(field) {
      this.isDirty = true
      this.pushState(JSON.parse(JSON.stringify(this.formData)))
    },

    handleUndo() {
      const state = this.undo()
      if (state) {
        this.formData = JSON.parse(JSON.stringify(state))
      }
    },

    handleRedo() {
      const state = this.redo()
      if (state) {
        this.formData = JSON.parse(JSON.stringify(state))
      }
    },

    addChecklistItem() {
      this.formData.checklist.push('')
      this.trackChange('checklist')
    },

    removeChecklistItem(index) {
      this.formData.checklist.splice(index, 1)
      this.trackChange('checklist')
    },

    async loadTemplate() {
      try {
        const data = await api.get(`/task-templates/${this.templateId}`)
        this.initForm(data)
      } catch (err) {
        console.error('Failed to load template:', err)
      }
    },

    async saveTemplate() {
      if (!this.validate()) return

      this.isSubmitting = true
      try {
        if (this.templateId) {
          await api.put(`/task-templates/${this.templateId}`, this.formData)
        } else {
          await api.post('/task-templates', this.formData)
        }
        this.$emit('template-saved', this.formData)
        this.initForm(this.formData)
        this.clearHistory()
      } catch (err) {
        this.setFieldError('_general', err.message || 'Failed to save template')
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.task-template-editor {
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dirty-indicator {
  font-size: 0.75rem;
  color: #d97706;
  background: #fffbeb;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.changes-badge {
  font-size: 0.75rem;
  color: #4f46e5;
  background: #eef2ff;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.375rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.checklist-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.btn-add-item {
  font-size: 0.875rem;
  color: #4f46e5;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.375rem 0;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.field-error {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}
</style>
