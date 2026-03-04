<template>
  <div class="bg-white rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">
        {{ isEditMode ? 'Edit Project' : 'Create Project' }}
      </h2>
    </div>

    <form ref="form" class="p-6 space-y-6" @submit.prevent="handleSubmit">
      <!-- Name Field -->
      <div>
        <label for="project-name" class="block text-sm font-medium text-gray-700 mb-1">
          Project Name <span class="text-red-500">*</span>
        </label>
        <input
          id="project-name"
          v-model="formData.name"
          type="text"
          class="block w-full px-3 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          :class="errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'"
          placeholder="Enter project name"
          required
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
      </div>

      <!-- Description Field -->
      <div>
        <label for="project-description" class="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="project-description"
          v-model="formData.description"
          rows="4"
          class="block w-full px-3 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          :class="errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'"
          placeholder="Describe your project..."
        ></textarea>
        <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
      </div>

      <!-- Status Dropdown -->
      <div>
        <label for="project-status" class="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="project-status"
          v-model="formData.status"
          class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="active">Active</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <!-- Date Fields -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Start Date -->
        <div>
          <label for="project-start-date" class="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            id="project-start-date"
            v-model="formData.startDate"
            type="date"
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="errors.startDate" class="mt-1 text-sm text-red-600">{{ errors.startDate }}</p>
        </div>

        <!-- End Date -->
        <div>
          <label for="project-end-date" class="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            id="project-end-date"
            v-model="formData.endDate"
            type="date"
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="errors.endDate" class="mt-1 text-sm text-red-600">{{ errors.endDate }}</p>
        </div>
      </div>

      <!-- Validation Summary -->
      <div
        v-if="errorCount > 0"
        class="bg-red-50 border border-red-200 rounded-lg p-4"
      >
        <p class="text-sm text-red-700">
          Please fix {{ errorCount }} error{{ errorCount > 1 ? 's' : '' }} before submitting.
        </p>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          :disabled="isSubmitting"
          @click="resetForm"
        >
          {{ isEditMode ? 'Reset' : 'Clear' }}
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="isSubmitting || !isFormValid"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Saving...
          </span>
          <span v-else>{{ isEditMode ? 'Update Project' : 'Create Project' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import validationMixin from '@/mixins/validationMixin'

export default {
  name: 'ProjectForm',

  mixins: [formMixin, validationMixin],

  props: {
    project: {
      type: Object,
      default: null
    }
  },

  emits: ['form-submitted'],

  data() {
    return {
      formData: {
        name: '',
        description: '',
        status: 'active',
        startDate: '',
        endDate: ''
      }
    }
  },

  computed: {
    isEditMode() {
      return !!this.project
    }
  },

  watch: {
    // Dot-notation watcher
    'formData.name'(val) {
      this.validateField('name')
    },

    project: {
      immediate: true,
      deep: true,
      handler(newProject) {
        if (newProject) {
          this.initForm({
            name: newProject.name || '',
            description: newProject.description || '',
            status: newProject.status || 'active',
            startDate: newProject.startDate || '',
            endDate: newProject.endDate || ''
          })
        }
      }
    }
  },

  created() {
    // Set up validation rules
    this.rules = {
      name: [
        (v) => !!v || 'Project name is required',
        (v) => (v && v.length >= 3) || 'Name must be at least 3 characters',
        (v) => (v && v.length <= 100) || 'Name must be less than 100 characters'
      ],
      description: [
        (v) => (!v || v.length <= 500) || 'Description must be less than 500 characters'
      ],
      endDate: [
        (v) => {
          if (!v || !this.formData.startDate) return true
          return new Date(v) >= new Date(this.formData.startDate) || 'End date must be after start date'
        }
      ]
    }
  },

  // beforeMount lifecycle hook from formMixin is inherited

  methods: {
    handleSubmit() {
      if (!this.validate()) return

      this.$refs.form.reportValidity()

      this.$nextTick(() => {
        this.$emit('form-submitted', { ...this.formData })
      })
    }
  }
}
</script>
