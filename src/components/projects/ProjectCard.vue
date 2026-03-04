<template>
  <div
    class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
    @click="navigateToProject"
  >
    <div class="p-6">
      <!-- Header: Name & Status Badge -->
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-900 truncate mr-3">
          {{ project.name }}
        </h3>
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
          :class="statusBadgeClass"
        >
          {{ project.status }}
        </span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">
        {{ project.description || 'No description provided.' }}
      </p>

      <!-- Progress Bar -->
      <div class="mb-4">
        <div class="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{{ progressPercentage }}%</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :class="progressBarColor"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Footer: Members & Actions -->
      <div class="flex items-center justify-between">
        <!-- Member Count -->
        <div class="flex items-center text-sm text-gray-500">
          <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ memberCount }} members</span>
        </div>

        <!-- Action Buttons (permission-gated) -->
        <div class="flex space-x-2">
          <button
            v-if="canEdit"
            class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit project"
            @click.stop="$emit('project-selected', project)"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            v-if="canDelete"
            class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete project"
            @click.stop="$emit('project-deleted', project)"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import permissionMixin from '@/mixins/permissionMixin'
import { getStatusColor } from '@/utils/helpers'

export default {
  name: 'ProjectCard',

  mixins: [permissionMixin],

  props: {
    project: {
      type: Object,
      required: true
    }
  },

  emits: ['project-selected', 'project-deleted'],

  computed: {
    memberCount() {
      return this.project.members ? this.project.members.length : 0
    },

    progressPercentage() {
      if (!this.project.progress && this.project.progress !== 0) return 0
      return Math.min(Math.max(this.project.progress, 0), 100)
    },

    statusBadgeClass() {
      const colorClass = getStatusColor(this.project.status)
      const bgMap = {
        'text-gray-500': 'bg-gray-100 text-gray-800',
        'text-blue-500': 'bg-blue-100 text-blue-800',
        'text-yellow-500': 'bg-yellow-100 text-yellow-800',
        'text-green-500': 'bg-green-100 text-green-800'
      }
      return bgMap[colorClass] || 'bg-gray-100 text-gray-800'
    },

    progressBarColor() {
      if (this.progressPercentage >= 80) return 'bg-green-500'
      if (this.progressPercentage >= 50) return 'bg-blue-500'
      if (this.progressPercentage >= 25) return 'bg-yellow-500'
      return 'bg-gray-400'
    }
  },

  methods: {
    navigateToProject() {
      this.$emit('project-selected', this.project)
      this.$router.push({ name: 'project-detail', params: { id: this.project.id } })
    }
  }
}
</script>
