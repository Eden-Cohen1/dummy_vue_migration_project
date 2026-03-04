<template>
  <div class="max-w-3xl mx-auto">
    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white rounded-xl shadow-md p-8">
      <div class="animate-pulse space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 rounded-full bg-gray-200"></div>
          <div class="flex-1 space-y-3">
            <div class="h-6 bg-gray-200 rounded w-48"></div>
            <div class="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="bg-white rounded-xl shadow-md p-8 text-center">
      <svg class="w-16 h-16 mx-auto text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-semibold text-gray-800 mb-1">Error Loading Profile</h3>
      <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
      <button
        v-if="canRetry"
        @click="retry(loadProfile)"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Profile Content -->
    <div v-else class="space-y-6">
      <!-- Profile Header -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-5">
              <div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold border-3 border-white/40">
                <img
                  v-if="profileData.avatar"
                  :src="profileData.avatar"
                  :alt="profileData.name"
                  class="w-full h-full rounded-full object-cover"
                />
                <span v-else>{{ profileInitials }}</span>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-white">{{ profileData.name || 'Unknown User' }}</h1>
                <p class="text-blue-100 text-sm mt-1">{{ profileData.email }}</p>
                <span
                  v-if="profileData.role"
                  class="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white"
                >
                  {{ profileData.role }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="!isEditing && canEdit"
                @click="toggleEdit"
                class="px-4 py-2 text-sm font-medium text-white bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <span class="flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Details / Edit Form -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="px-8 py-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800">
            {{ isEditing ? 'Edit Profile' : 'Profile Details' }}
          </h2>
          <div v-if="isEditing" class="flex items-center gap-2">
            <button
              @click="cancelEdit"
              class="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveProfile"
              :disabled="isSubmitting"
              class="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <span v-if="isSubmitting">Saving...</span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </div>

        <div class="p-8">
          <!-- View Mode -->
          <div v-if="!isEditing" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                <p class="text-sm text-gray-900">{{ profileData.name || '-' }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                <p class="text-sm text-gray-900">{{ profileData.email || '-' }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Role</label>
                <p class="text-sm text-gray-900">{{ profileData.role || '-' }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Department</label>
                <p class="text-sm text-gray-900">{{ profileData.department || '-' }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Status</label>
                <span class="inline-flex items-center gap-1.5">
                  <span
                    :class="profileData.status === 'active' ? 'bg-green-400' : 'bg-gray-300'"
                    class="w-2 h-2 rounded-full"
                  ></span>
                  <span class="text-sm text-gray-900">{{ profileData.status || '-' }}</span>
                </span>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                <p class="text-sm text-gray-900">{{ profileData.phone || '-' }}</p>
              </div>
            </div>
            <div v-if="profileData.bio">
              <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Bio</label>
              <p class="text-sm text-gray-700 leading-relaxed">{{ profileData.bio }}</p>
            </div>
          </div>

          <!-- Edit Mode -->
          <form v-else ref="form" @submit.prevent="saveProfile" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label for="profile-name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  id="profile-name"
                  v-model="formData.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p v-if="formErrors.name" class="mt-1 text-xs text-red-600">{{ formErrors.name }}</p>
              </div>
              <div>
                <label for="profile-email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  id="profile-email"
                  v-model="formData.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p v-if="formErrors.email" class="mt-1 text-xs text-red-600">{{ formErrors.email }}</p>
              </div>
              <div>
                <label for="profile-role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  id="profile-role"
                  v-model="formData.role"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label for="profile-department" class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  id="profile-department"
                  v-model="formData.department"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label for="profile-phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  id="profile-phone"
                  v-model="formData.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  v-model="formData.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div>
              <label for="profile-bio" class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                id="profile-bio"
                v-model="formData.bio"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
          </form>
        </div>
      </div>

      <!-- Permission Level Indicator -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Your Permissions</h3>
        <div class="flex items-center gap-4">
          <span
            :class="[
              permissionLevel === 'admin' ? 'bg-red-100 text-red-700' :
              permissionLevel === 'editor' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700',
              'px-3 py-1 rounded-full text-xs font-medium'
            ]"
          >
            {{ permissionLevel }}
          </span>
          <span class="text-xs text-gray-500">
            You can {{ canEdit ? 'edit' : 'view' }} profiles{{ canDelete ? ' and delete users' : '' }}.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import permissionMixin from '@/mixins/permissionMixin'
import loadingMixin from '@/mixins/loadingMixin'

export default {
  name: 'UserProfile',

  mixins: [formMixin, permissionMixin, loadingMixin],

  emits: ['form-submitted', 'profile-saved', 'profile-cancelled'],

  data() {
    return {
      isEditing: false,
      profileData: {}
    }
  },

  computed: {
    userId() {
      return this.$route.params.id
    },

    profileInitials() {
      if (!this.profileData.name) return '?'
      return this.profileData.name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    }
  },

  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing
      if (this.isEditing) {
        this.initForm({ ...this.profileData })
      }
    },

    saveProfile() {
      this.isSubmitting = true

      if (this.$refs.form) {
        this.$refs.form.reportValidity()
      }

      this.$nextTick(() => {
        this.profileData = { ...this.formData }
        this.isEditing = false
        this.isSubmitting = false
        this.$emit('profile-saved', this.profileData)
      })
    },

    cancelEdit() {
      this.resetForm()
      this.isEditing = false
      this.$emit('profile-cancelled')
    },

    loadProfile() {
      this.startLoading('Loading user profile...')
      // Simulated profile load using route param
      const id = this.$route.params.id
      setTimeout(() => {
        this.profileData = {
          id: id,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'developer',
          department: 'Engineering',
          status: 'active',
          phone: '+1 (555) 123-4567',
          bio: 'Full-stack developer with a passion for clean code and user experience.',
          avatar: null
        }
        this.stopLoading()
      }, 500)
    }
  },

  mounted() {
    this.loadProfile()

    // Programmatic watcher on profileData
    this.$watch('profileData', function (newVal, oldVal) {
      if (newVal && oldVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.isDirty = true
      }
    }, { deep: true })
  },

  unmounted() {
    console.log('[UserProfile] Component unmounted, cleaning up resources for user:', this.userId)
  }
}
</script>
