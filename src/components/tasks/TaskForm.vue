<template>
  <form ref="form" @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-5">
    <h2 class="text-lg font-semibold text-gray-900">
      {{ isEditing ? 'Edit Task' : 'Create Task' }}
    </h2>

    <!-- Title -->
    <div>
      <label for="task-title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
      <input
        id="task-title"
        v-model="formData.title"
        type="text"
        required
        placeholder="Enter task title"
        :class="[
          'w-full px-3 py-2 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500',
          errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
        ]"
      />
      <p v-if="errors.title" class="mt-1 text-xs text-red-500">{{ errors.title }}</p>
    </div>

    <!-- Description -->
    <div>
      <label for="task-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        id="task-description"
        v-model="formData.description"
        rows="4"
        placeholder="Describe the task..."
        :class="[
          'w-full px-3 py-2 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 resize-y',
          errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
        ]"
      ></textarea>
      <p v-if="errors.description" class="mt-1 text-xs text-red-500">{{ errors.description }}</p>
    </div>

    <!-- Status and Priority row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Status Dropdown -->
      <div>
        <label for="task-status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          id="task-status"
          v-model="formData.status"
          :class="[
            'w-full px-3 py-2 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 bg-white',
            errors.status ? 'border-red-300 bg-red-50' : 'border-gray-300'
          ]"
        >
          <option value="">Select status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
        <p v-if="errors.status" class="mt-1 text-xs text-red-500">{{ errors.status }}</p>
      </div>

      <!-- Priority Dropdown -->
      <div>
        <label for="task-priority" class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select
          id="task-priority"
          v-model="formData.priority"
          :class="[
            'w-full px-3 py-2 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 bg-white',
            errors.priority ? 'border-red-300 bg-red-50' : 'border-gray-300'
          ]"
        >
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <p v-if="errors.priority" class="mt-1 text-xs text-red-500">{{ errors.priority }}</p>
      </div>
    </div>

    <!-- Assignee and Due Date row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Assignee Dropdown -->
      <div>
        <label for="task-assignee" class="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
        <select
          id="task-assignee"
          v-model="formData.assignee"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">Unassigned</option>
          <option v-for="user in availableUsers" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>

      <!-- Due Date -->
      <div>
        <label for="task-due-date" class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <input
          id="task-due-date"
          v-model="formData.dueDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>

    <!-- Tags Input -->
    <div>
      <label for="task-tags" class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
      <div class="flex flex-wrap gap-2 mb-2" v-if="formData.tags && formData.tags.length">
        <span
          v-for="(tag, index) in formData.tags"
          :key="index"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
        >
          {{ tag }}
          <button
            type="button"
            @click="removeTag(index)"
            class="ml-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-indigo-400 hover:text-indigo-600 hover:bg-indigo-200 transition-colors"
          >
            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      </div>
      <div class="flex gap-2">
        <input
          id="task-tags"
          v-model="tagInput"
          type="text"
          placeholder="Add a tag and press Enter"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
          @keydown.enter.prevent="addTag"
        />
        <button
          type="button"
          @click="addTag"
          class="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          Add
        </button>
      </div>
    </div>

    <!-- Validation errors summary -->
    <div v-if="errorCount > 0" class="bg-red-50 border border-red-200 rounded-lg p-3">
      <p class="text-sm text-red-600 font-medium">
        Please fix {{ errorCount }} error{{ errorCount !== 1 ? 's' : '' }} before submitting.
      </p>
    </div>

    <!-- Form actions -->
    <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
      <button
        type="button"
        @click="resetForm"
        :disabled="!hasChanges"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          hasChanges
            ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            : 'text-gray-400 bg-gray-50 cursor-not-allowed'
        ]"
      >
        Reset
      </button>
      <button
        type="submit"
        :disabled="isSubmitting"
        :class="[
          'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
          isSubmitting
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        ]"
      >
        <span v-if="isSubmitting" class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Saving...
        </span>
        <span v-else>{{ isEditing ? 'Update Task' : 'Create Task' }}</span>
      </button>
    </div>
  </form>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import validationMixin from '@/mixins/validationMixin'

export default {
  name: 'TaskForm',

  mixins: [formMixin, validationMixin],

  props: {
    task: {
      type: Object,
      default: null
    },
    projectId: {
      type: [String, Number],
      required: true
    }
  },

  emits: ['task-created', 'task-updated'],

  data() {
    return {
      tagInput: '',
      availableUsers: [],
      formData: {
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignee: '',
        dueDate: '',
        tags: [],
        projectId: this.projectId
      }
    }
  },

  computed: {
    isEditing() {
      return !!this.task
    }
  },

  watch: {
    'formData.title'(val) {
      this.validateField('title')
    }
  },

  created() {
    this.rules = {
      title: [
        (v) => (v && v.trim().length > 0) || 'Title is required',
        (v) => (v && v.length <= 200) || 'Title must be 200 characters or less'
      ],
      description: [
        (v) => (!v || v.length <= 2000) || 'Description must be 2000 characters or less'
      ],
      status: [
        (v) => !!v || 'Status is required'
      ],
      priority: [
        (v) => !!v || 'Priority is required'
      ]
    }

    if (this.task) {
      this.formData = {
        title: this.task.title || '',
        description: this.task.description || '',
        status: this.task.status || 'todo',
        priority: this.task.priority || 'medium',
        assignee: this.task.assignee?.id || this.task.assignee || '',
        dueDate: this.task.dueDate || '',
        tags: this.task.tags ? [...this.task.tags] : [],
        projectId: this.projectId
      }
    }
  },

  methods: {
    handleSubmit() {
      if (!this.validate()) {
        this.$nextTick(() => {
          if (this.$refs.form) {
            const firstError = this.$refs.form.querySelector('.border-red-300')
            if (firstError) {
              firstError.focus()
            }
          }
        })
        return
      }

      this.submitForm()

      if (this.isEditing) {
        this.$emit('task-updated', { ...this.formData, id: this.task.id })
      } else {
        this.$emit('task-created', { ...this.formData })
      }
    },

    addTag() {
      const tag = this.tagInput.trim()
      if (tag && !this.formData.tags.includes(tag)) {
        this.formData.tags.push(tag)
        this.tagInput = ''
        this.isDirty = true
      }
    },

    removeTag(index) {
      this.formData.tags.splice(index, 1)
      this.isDirty = true
    }
  }
}
</script>
