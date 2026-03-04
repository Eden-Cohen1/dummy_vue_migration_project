<template>
  <div class="bg-white rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-6 space-y-4">
      <div
        v-for="n in 5"
        :key="'skeleton-' + n"
        class="flex items-center space-x-4 animate-pulse"
      >
        <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
        <div class="flex-1">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="p-6 text-center">
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button
        v-if="canRetry"
        class="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
        @click="retry(loadActivities)"
      >
        Retry
      </button>
    </div>

    <!-- Activity Feed -->
    <div v-else>
      <div
        v-if="paginatedActivities.length === 0"
        class="p-6 text-center text-gray-500"
      >
        No recent activity found.
      </div>

      <ul v-else class="divide-y divide-gray-200">
        <li
          v-for="activity in paginatedActivities"
          :key="activity.id"
          class="px-6 py-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start space-x-3">
            <!-- User Avatar -->
            <div
              class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              :class="getAvatarColor(activity.user)"
            >
              {{ getInitials(activity.user) }}
            </div>

            <!-- Activity Content -->
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">
                <span class="font-medium">{{ activity.user }}</span>
                {{ activity.action }}
                <span v-if="activity.target" class="font-medium">{{ activity.target }}</span>
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatTimeAgo(activity.createdAt) }}
              </p>
            </div>

            <!-- Activity Type Badge -->
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              :class="getActivityBadgeClass(activity.type)"
            >
              {{ activity.type }}
            </span>
          </div>
        </li>
      </ul>

      <!-- Pagination Controls -->
      <div
        v-if="totalPages > 1"
        class="px-6 py-3 border-t border-gray-200 flex items-center justify-between"
      >
        <button
          class="px-3 py-1 text-sm rounded border"
          :class="hasPrevPage ? 'text-gray-700 hover:bg-gray-50 border-gray-300' : 'text-gray-400 border-gray-200 cursor-not-allowed'"
          :disabled="!hasPrevPage"
          @click="prevPage"
        >
          Previous
        </button>
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          class="px-3 py-1 text-sm rounded border"
          :class="hasNextPage ? 'text-gray-700 hover:bg-gray-50 border-gray-300' : 'text-gray-400 border-gray-200 cursor-not-allowed'"
          :disabled="!hasNextPage"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'
import paginationMixin from '@/mixins/paginationMixin'
import { timeAgo } from '@/utils/helpers'
import { api } from '@/services/api'

export default {
  name: 'RecentActivity',

  mixins: [loadingMixin, paginationMixin],

  data() {
    return {
      activities: []
    }
  },

  computed: {
    // Component override: defines its own hasPrevPage computed
    // (overrides paginationMixin's missing composable member)
    hasPrevPage() {
      return this.currentPage > 1
    },

    paginatedActivities() {
      const start = this.paginatedOffset
      const end = start + this.pageSize
      return this.activities.slice(start, end)
    }
  },

  created() {
    this.pageSize = 5
    this.loadActivities()
  },

  methods: {
    async loadActivities() {
      this.startLoading('Loading recent activity...')
      try {
        const data = await api.getActivities()
        // Use const vm = this pattern in a callback
        const vm = this
        data.forEach(function (activity) {
          vm.activities.push(activity)
        })
        this.totalItems = this.activities.length
        this.stopLoading()
      } catch (err) {
        this.setError(err.message || 'Failed to load activities')
      }
    },

    formatTimeAgo(date) {
      return timeAgo(date)
    },

    getInitials(name) {
      if (!name) return '?'
      return name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    },

    getAvatarColor(name) {
      const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-teal-500'
      ]
      if (!name) return colors[0]
      const index = name.charCodeAt(0) % colors.length
      return colors[index]
    },

    getActivityBadgeClass(type) {
      const classes = {
        create: 'bg-green-100 text-green-800',
        update: 'bg-blue-100 text-blue-800',
        delete: 'bg-red-100 text-red-800',
        comment: 'bg-yellow-100 text-yellow-800',
        assign: 'bg-purple-100 text-purple-800'
      }
      return classes[type] || 'bg-gray-100 text-gray-800'
    }
  }
}
</script>
