<!-- ReportTemplate.vue
  Mixins used:
  - formMixin: Provides formData management, isDirty, resetForm, handleSubmit for template editing
  - validationMixin: Provides validate, errors, clearErrors for validating template fields
  This component allows users to create and edit report templates, with a name input,
  section editor, field configuration, live preview, and save functionality.
-->
<template>
  <div class="report-template">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Report Template</h3>
      <span v-if="isDirty" class="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Unsaved changes</span>
    </div>

    <form @submit.prevent="handleSave" class="flex space-x-6">
      <!-- Editor pane -->
      <div class="flex-1 space-y-4">
        <!-- Template name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="e.g. Monthly Status Report"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
        </div>

        <!-- Sections -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sections</label>
          <div v-for="(section, idx) in formData.sections" :key="idx" class="flex items-center space-x-2 mb-2">
            <input
              v-model="section.title"
              placeholder="Section title"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <select v-model="section.type" class="px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="text">Text</option>
              <option value="table">Table</option>
              <option value="chart">Chart</option>
            </select>
            <button type="button" @click="removeSection(idx)" class="text-red-400 hover:text-red-600 transition-colors">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button type="button" @click="addSection" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">+ Add Section</button>
        </div>

        <!-- Field configuration -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fields</label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="field in availableFields"
              :key="field"
              @click="toggleField(field)"
              :class="[
                'px-2.5 py-1 text-xs rounded-full cursor-pointer transition-colors',
                formData.selectedFields.includes(field)
                  ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ field }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-3 pt-2">
          <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            Save Template
          </button>
          <button type="button" @click="resetForm" class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Reset
          </button>
        </div>
      </div>

      <!-- Preview pane -->
      <div class="w-72 flex-shrink-0 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Preview</h4>
        <div class="text-sm text-gray-600">
          <p class="font-semibold mb-2">{{ formData.name || 'Untitled Template' }}</p>
          <div v-for="(section, idx) in formData.sections" :key="idx" class="mb-2 pl-3 border-l-2 border-indigo-200">
            <p class="text-xs font-medium text-gray-700">{{ section.title || 'Untitled Section' }}</p>
            <p class="text-xs text-gray-400">Type: {{ section.type }}</p>
          </div>
          <p v-if="formData.sections.length === 0" class="text-xs text-gray-400 italic">No sections added</p>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import validationMixin from '@/mixins/validationMixin'

export default {
  name: 'ReportTemplate',

  mixins: [formMixin, validationMixin],

  data() {
    return {
      formData: {
        name: '',
        sections: [],
        selectedFields: []
      },
      availableFields: ['Title', 'Date', 'Author', 'Status', 'Progress', 'Budget', 'Risks', 'Timeline']
    }
  },

  methods: {
    addSection() {
      this.formData.sections.push({ title: '', type: 'text' })
    },

    removeSection(idx) {
      this.formData.sections.splice(idx, 1)
    },

    toggleField(field) {
      const idx = this.formData.selectedFields.indexOf(field)
      if (idx === -1) {
        this.formData.selectedFields.push(field)
      } else {
        this.formData.selectedFields.splice(idx, 1)
      }
    },

    handleSave() {
      this.clearErrors()
      if (!this.formData.name.trim()) {
        this.errors.name = 'Template name is required'
        return
      }
      this.$emit('save', { ...this.formData })
    }
  }
}
</script>

<style scoped>
.report-template {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
