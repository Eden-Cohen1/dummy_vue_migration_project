<template>
  <div
    class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
    @click="selectUser"
  >
    <!-- Card Header with Avatar -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold border-2 border-white/40">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.name"
            class="w-full h-full rounded-full object-cover"
          />
          <span v-else>{{ userInitials }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-white font-semibold text-lg truncate">{{ user.name }}</h3>
          <span
            :class="roleBadgeClass"
            class="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ capitalize(user.role) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Card Body -->
    <div class="px-6 py-4">
      <div class="flex items-center gap-2 text-gray-600 text-sm mb-3">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span class="truncate">{{ user.email }}</span>
      </div>

      <div v-if="user.department" class="flex items-center gap-2 text-gray-600 text-sm mb-3">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span>{{ user.department }}</span>
      </div>

      <div v-if="user.status" class="flex items-center gap-2 text-sm">
        <span
          :class="user.status === 'active' ? 'bg-green-400' : 'bg-gray-300'"
          class="w-2.5 h-2.5 rounded-full inline-block"
        ></span>
        <span :class="user.status === 'active' ? 'text-green-700' : 'text-gray-500'">
          {{ capitalize(user.status) }}
        </span>
      </div>
    </div>

    <!-- Card Actions -->
    <div class="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
      <button
        v-if="canEdit"
        @click.stop="$emit('edit-user', user)"
        class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
      >
        <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </button>
      <button
        v-if="canDelete"
        @click.stop="$emit('delete-user', user)"
        class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
      >
        <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
      <button
        @click.stop="$emit('view-user', user)"
        class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View
      </button>
    </div>
  </div>
</template>

<script>
import permissionMixin from '@/mixins/permissionMixin'
import { capitalize } from '@/utils/helpers'

export default {
  name: 'UserCard',

  mixins: [permissionMixin],

  props: {
    user: {
      type: Object,
      required: true
    }
  },

  emits: ['user-selected', 'edit-user', 'delete-user', 'view-user'],

  computed: {
    userInitials() {
      if (!this.user.name) return '?'
      return this.user.name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    },

    roleBadgeClass() {
      const classes = {
        admin: 'bg-red-100 text-red-800',
        manager: 'bg-purple-100 text-purple-800',
        developer: 'bg-blue-100 text-blue-800',
        designer: 'bg-pink-100 text-pink-800',
        viewer: 'bg-gray-100 text-gray-800'
      }
      return classes[this.user.role] || 'bg-gray-100 text-gray-800'
    }
  },

  methods: {
    capitalize,

    selectUser() {
      this.$emit('user-selected', this.user)
    }
  }
}
</script>
