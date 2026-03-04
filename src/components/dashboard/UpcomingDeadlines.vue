<template>
  <div class="bg-white rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
      <button
        v-if="deadlines.length > 0"
        class="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
        @click="toggleSort('dueDate')"
      >
        <span>Sort by date</span>
        <span v-if="isSorted && sortKey === 'dueDate'">{{ sortIndicator }}</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-6 space-y-4">
      <div
        v-for="n in 5"
        :key="'skeleton-' + n"
        class="flex items-center justify-between animate-pulse"
      >
        <div class="flex-1">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div class="h-6 bg-gray-200 rounded w-20"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="p-6 text-center">
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button
        v-if="canRetry"
        class="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
        @click="retry(loadDeadlines)"
      >
        Retry
      </button>
    </div>

    <!-- Deadlines List -->
    <div v-else>
      <div
        v-if="sortedDeadlines.length === 0"
        class="p-6 text-center text-gray-500"
      >
        No upcoming deadlines.
      </div>

      <ul v-else class="divide-y divide-gray-200">
        <li
          v-for="task in sortedDeadlines"
          :key="task.id"
          class="px-6 py-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0 mr-4">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ task.title }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ task.projectName || 'No project' }}
              </p>
            </div>

            <div class="flex items-center space-x-3">
              <!-- Urgency Indicator -->
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getUrgencyClass(task.dueDate)"
              >
                {{ formatDueDate(task.dueDate) }}
              </span>

              <!-- Status Badge -->
              <span
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                :class="getStatusBadgeClass(task.status)"
              >
                {{ task.status }}
              </span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mt-2 w-full bg-gray-100 rounded-full h-1.5">
            <div
              class="h-1.5 rounded-full transition-all duration-300"
              :class="getProgressBarColor(task.dueDate)"
              :style="{ width: getProgressWidth(task) + '%' }"
            ></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'
import sortMixin from '@/mixins/sortMixin'
import { formatDate } from '@/utils/helpers'
import { useTasksStore } from '@/stores/tasks'
import { useProjectsStore } from '@/stores/projects'

export default {
  name: 'UpcomingDeadlines',

  mixins: [loadingMixin, sortMixin('dueDate')],

  data() {
    return {
      deadlines: []
    }
  },

  computed: {
    sortedDeadlines() {
      const sorted = [...this.deadlines]
      sorted.sort((a, b) => {
        const dateA = new Date(a[this.sortKey] || 0)
        const dateB = new Date(b[this.sortKey] || 0)
        return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      })
      return sorted
    }
  },

  created() {
    this.loadDeadlines()
  },

  methods: {
    async loadDeadlines() {
      this.startLoading('Loading upcoming deadlines...')
      try {
        const tasksStore = useTasksStore()
        const projectsStore = useProjectsStore()

        await Promise.all([
          tasksStore.fetchTasks(),
          projectsStore.fetchProjects()
        ])

        const now = new Date()
        const projectMap = {}
        projectsStore.projects.forEach((p) => {
          projectMap[p.id] = p.name
        })

        // Filter upcoming tasks (not done, with a due date in the future)
        this.deadlines = tasksStore.tasks
          .filter((task) => {
            if (task.status === 'done') return false
            if (!task.dueDate) return false
            return new Date(task.dueDate) >= now
          })
          .map((task) => ({
            ...task,
            projectName: projectMap[task.projectId] || 'Unknown Project'
          }))

        this.stopLoading()
      } catch (err) {
        this.setError(err.message || 'Failed to load deadlines')
      }
    },

    formatDueDate(date) {
      return formatDate(date)
    },

    getDaysUntilDue(date) {
      const now = new Date()
      const due = new Date(date)
      const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
      return diff
    },

    getUrgencyClass(date) {
      const days = this.getDaysUntilDue(date)
      if (days <= 1) return 'bg-red-100 text-red-800'
      if (days <= 3) return 'bg-orange-100 text-orange-800'
      if (days <= 7) return 'bg-yellow-100 text-yellow-800'
      return 'bg-green-100 text-green-800'
    },

    getStatusBadgeClass(status) {
      const classes = {
        todo: 'bg-gray-100 text-gray-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        review: 'bg-yellow-100 text-yellow-800',
        done: 'bg-green-100 text-green-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getProgressBarColor(date) {
      const days = this.getDaysUntilDue(date)
      if (days <= 1) return 'bg-red-500'
      if (days <= 3) return 'bg-orange-500'
      if (days <= 7) return 'bg-yellow-500'
      return 'bg-green-500'
    },

    getProgressWidth(task) {
      if (task.status === 'done') return 100
      if (task.status === 'review') return 75
      if (task.status === 'in-progress') return 50
      return 25
    }
  }
}
</script>
