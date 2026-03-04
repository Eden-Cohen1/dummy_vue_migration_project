<template>
  <div class="bg-white rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Project Settings</h2>
      <p class="text-sm text-gray-500 mt-1">
        Manage your project configuration and preferences.
      </p>
    </div>

    <!-- Permission Denied State -->
    <div
      v-if="!canEdit"
      class="p-6 text-center"
    >
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <p class="text-gray-500 text-sm">You do not have permission to edit project settings.</p>
      <p class="text-xs text-gray-400 mt-1">Current permission level: {{ permissionLevel }}</p>
    </div>

    <!-- Settings Form -->
    <form v-else ref="form" class="p-6 space-y-6" @submit.prevent="saveSettings">
      <!-- Project Name -->
      <div>
        <label for="settings-name" class="block text-sm font-medium text-gray-700 mb-1">
          Project Name
        </label>
        <input
          id="settings-name"
          v-model="formData.name"
          type="text"
          class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Project name"
        />
        <p v-if="formErrors.name" class="mt-1 text-sm text-red-600">{{ formErrors.name }}</p>
      </div>

      <!-- Description -->
      <div>
        <label for="settings-description" class="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="settings-description"
          v-model="formData.description"
          rows="3"
          class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your project..."
        ></textarea>
      </div>

      <!-- Visibility -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Visibility
        </label>
        <div class="space-y-3">
          <label class="flex items-start cursor-pointer">
            <input
              v-model="formData.visibility"
              type="radio"
              value="public"
              class="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">Public</p>
              <p class="text-xs text-gray-500">Visible to all team members</p>
            </div>
          </label>
          <label class="flex items-start cursor-pointer">
            <input
              v-model="formData.visibility"
              type="radio"
              value="private"
              class="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">Private</p>
              <p class="text-xs text-gray-500">Only visible to project members</p>
            </div>
          </label>
          <label class="flex items-start cursor-pointer">
            <input
              v-model="formData.visibility"
              type="radio"
              value="internal"
              class="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">Internal</p>
              <p class="text-xs text-gray-500">Visible to organization members only</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Notifications -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Notifications
        </label>
        <div class="space-y-3">
          <label class="flex items-center justify-between cursor-pointer">
            <div>
              <p class="text-sm text-gray-900">Email notifications</p>
              <p class="text-xs text-gray-500">Get notified about project updates via email</p>
            </div>
            <input
              v-model="formData.notifications.email"
              type="checkbox"
              class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <div>
              <p class="text-sm text-gray-900">Push notifications</p>
              <p class="text-xs text-gray-500">Receive browser push notifications</p>
            </div>
            <input
              v-model="formData.notifications.push"
              type="checkbox"
              class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <div>
              <p class="text-sm text-gray-900">Slack integration</p>
              <p class="text-xs text-gray-500">Post updates to a Slack channel</p>
            </div>
            <input
              v-model="formData.notifications.slack"
              type="checkbox"
              class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      <!-- Changes Indicator -->
      <div
        v-if="hasChanges"
        class="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
      >
        <p class="text-sm text-yellow-700">
          You have unsaved changes in: {{ dirtyFields.join(', ') }}
        </p>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          :disabled="isSubmitting || !hasChanges"
          @click="resetForm"
        >
          Discard Changes
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="isSubmitting || !hasChanges"
        >
          <span v-if="isSubmitting">Saving...</span>
          <span v-else>Save Settings</span>
        </button>
      </div>
    </form>

    <!-- Danger Zone (admin only) -->
    <div
      v-if="canDelete"
      class="px-6 py-4 border-t border-red-200 bg-red-50"
    >
      <h3 class="text-sm font-semibold text-red-800 mb-2">Danger Zone</h3>
      <p class="text-xs text-red-600 mb-3">
        These actions are irreversible. Please proceed with caution.
      </p>
      <button
        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        @click="$emit('delete-project')"
      >
        Delete Project
      </button>
    </div>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import permissionMixin from '@/mixins/permissionMixin'

export default {
  name: 'ProjectSettings',

  mixins: [formMixin, permissionMixin],

  emits: ['form-submitted', 'delete-project'],

  data() {
    return {
      formData: {
        name: '',
        description: '',
        visibility: 'public',
        notifications: {
          email: true,
          push: false,
          slack: false
        }
      }
    }
  },

  // beforeMount lifecycle hook is inherited from formMixin

  beforeUpdate() {
    // Check permissions before DOM update
    if (!this.canEdit && this.$refs.form) {
      const inputs = this.$refs.form.querySelectorAll('input, textarea, select')
      inputs.forEach((input) => {
        input.disabled = true
      })
    }
  },

  methods: {
    saveSettings() {
      if (this.$refs.form) {
        this.$refs.form.reportValidity()
      }
      this.submitForm()
    }
  }
}
</script>
