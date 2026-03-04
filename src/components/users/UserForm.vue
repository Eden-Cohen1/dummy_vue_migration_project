<template>
  <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
    <!-- Form Header -->
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-800">
        {{ isEditMode ? 'Edit User' : 'Create User' }}
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        {{ isEditMode ? 'Update the user details below.' : 'Fill in the details to create a new user.' }}
      </p>
    </div>

    <!-- Form Body -->
    <form ref="form" @submit.prevent="handleSubmit" class="p-6 space-y-6">
      <!-- Name Field -->
      <div>
        <label for="user-name" class="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span class="text-red-500">*</span>
        </label>
        <input
          id="user-name"
          v-model="formData.name"
          type="text"
          required
          placeholder="Enter full name"
          :class="[
            'w-full px-4 py-2 border rounded-lg text-sm outline-none transition',
            errors.name
              ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          ]"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
      </div>

      <!-- Email Field -->
      <div>
        <label for="user-email" class="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span class="text-red-500">*</span>
        </label>
        <input
          id="user-email"
          v-model="formData.email"
          type="email"
          required
          placeholder="Enter email address"
          :class="[
            'w-full px-4 py-2 border rounded-lg text-sm outline-none transition',
            errors.email
              ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          ]"
        />
        <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
      </div>

      <!-- Role Dropdown -->
      <div>
        <label for="user-role" class="block text-sm font-medium text-gray-700 mb-1">
          Role <span class="text-red-500">*</span>
        </label>
        <select
          id="user-role"
          v-model="formData.role"
          required
          :class="[
            'w-full px-4 py-2 border rounded-lg text-sm outline-none transition bg-white',
            errors.role
              ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          ]"
        >
          <option value="" disabled>Select a role</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="viewer">Viewer</option>
        </select>
        <p v-if="errors.role" class="mt-1 text-xs text-red-600">{{ errors.role }}</p>
      </div>

      <!-- Department Field -->
      <div>
        <label for="user-department" class="block text-sm font-medium text-gray-700 mb-1">
          Department
        </label>
        <input
          id="user-department"
          v-model="formData.department"
          type="text"
          placeholder="Enter department"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Status Toggle -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="formData.status = formData.status === 'active' ? 'inactive' : 'active'"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              formData.status === 'active' ? 'bg-blue-600' : 'bg-gray-300'
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                formData.status === 'active' ? 'translate-x-6' : 'translate-x-1'
              ]"
            ></span>
          </button>
          <span class="text-sm text-gray-600">
            {{ formData.status === 'active' ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>

      <!-- Form dirty indicator -->
      <div v-if="hasChanges" class="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span class="text-xs text-amber-700">You have unsaved changes</span>
      </div>

      <!-- Validation errors summary -->
      <div v-if="errorCount > 0" class="px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-xs text-red-700 font-medium">Please fix {{ errorCount }} error{{ errorCount > 1 ? 's' : '' }} before submitting.</p>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          v-if="hasChanges"
          @click="resetForm"
          class="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isSubmitting" class="flex items-center gap-2">
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Saving...
          </span>
          <span v-else>{{ isEditMode ? 'Update User' : 'Create User' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import validationMixin from '@/mixins/validationMixin'

export default {
  name: 'UserForm',

  mixins: [formMixin, validationMixin],

  props: {
    user: {
      type: Object,
      default: null
    }
  },

  emits: ['user-saved', 'form-cancelled', 'form-submitted', 'validation-complete'],

  data() {
    return {
      formData: {
        name: '',
        email: '',
        role: '',
        department: '',
        status: 'active'
      },
      rules: {
        name: [
          (v) => !!v || 'Name is required',
          (v) => (v && v.length >= 2) || 'Name must be at least 2 characters'
        ],
        email: [
          (v) => !!v || 'Email is required',
          (v) => /.+@.+\..+/.test(v) || 'Please enter a valid email address'
        ],
        role: [
          (v) => !!v || 'Role is required'
        ]
      }
    }
  },

  computed: {
    isEditMode() {
      return !!this.user
    }
  },

  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (newUser) {
          this.initForm({
            name: newUser.name || '',
            email: newUser.email || '',
            role: newUser.role || '',
            department: newUser.department || '',
            status: newUser.status || 'active'
          })
        }
      }
    },

    'formData.email'(val) {
      this.validateField('email')
    }
  },

  methods: {
    handleSubmit() {
      if (!this.validate()) {
        return
      }

      this.isSubmitting = true

      if (this.$refs.form) {
        this.$refs.form.reportValidity()
      }

      this.$nextTick(() => {
        const payload = {
          ...this.formData,
          id: this.user ? this.user.id : undefined
        }
        this.$emit('user-saved', payload)
        this.isSubmitting = false
      })
    },

    handleCancel() {
      this.resetForm()
      this.$emit('form-cancelled')
    }
  }
}
</script>
