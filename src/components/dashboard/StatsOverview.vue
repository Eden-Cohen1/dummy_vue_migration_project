<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Loading State -->
    <template v-if="isLoading">
      <div
        v-for="n in 4"
        :key="'skeleton-' + n"
        class="bg-white rounded-lg shadow p-6 animate-pulse"
      >
        <div class="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
        <div class="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </template>

    <!-- Error State -->
    <div
      v-else-if="hasError"
      class="col-span-full bg-red-50 border border-red-200 rounded-lg p-6 text-center"
    >
      <svg class="mx-auto h-10 w-10 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button
        v-if="canRetry"
        class="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
        @click="retry(loadStats)"
      >
        Retry
      </button>
    </div>

    <!-- Stat Cards -->
    <template v-else>
      <!-- Total Projects -->
      <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0 p-3 bg-blue-100 rounded-full">
            <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-3xl font-bold text-gray-900">{{ stats.projects }}</p>
            <p class="text-sm text-gray-500">Total Projects</p>
          </div>
        </div>
      </div>

      <!-- Total Tasks -->
      <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0 p-3 bg-indigo-100 rounded-full">
            <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-3xl font-bold text-gray-900">{{ stats.tasks }}</p>
            <p class="text-sm text-gray-500">Total Tasks</p>
          </div>
        </div>
      </div>

      <!-- Completed Tasks -->
      <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0 p-3 bg-green-100 rounded-full">
            <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-3xl font-bold text-gray-900">{{ stats.completed }}</p>
            <p class="text-sm text-gray-500">Completed Tasks</p>
          </div>
        </div>
      </div>

      <!-- Team Members -->
      <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0 p-3 bg-purple-100 rounded-full">
            <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-3xl font-bold text-gray-900">{{ stats.members }}</p>
            <p class="text-sm text-gray-500">Team Members</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'
import chartMixin from '@/mixins/chartMixin'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { useUsersStore } from '@/stores/users'

export default {
  name: 'StatsOverview',

  mixins: [loadingMixin, chartMixin],

  data() {
    return {
      stats: {
        projects: 0,
        tasks: 0,
        completed: 0,
        members: 0
      }
    }
  },

  created() {
    this.loadStats()
  },

  methods: {
    async loadStats() {
      this.startLoading('Loading dashboard statistics...')
      try {
        const projectsStore = useProjectsStore()
        const tasksStore = useTasksStore()
        const usersStore = useUsersStore()

        await Promise.all([
          projectsStore.fetchProjects(),
          tasksStore.fetchTasks(),
          usersStore.fetchUsers()
        ])

        this.stats.projects = projectsStore.projectCount
        this.stats.tasks = tasksStore.taskCount
        this.stats.completed = tasksStore.tasks.filter(
          (t) => t.status === 'done'
        ).length
        this.stats.members = usersStore.userCount

        this.$nextTick(() => {
          this.prepareChartData([
            { name: 'Projects', value: this.stats.projects },
            { name: 'Tasks', value: this.stats.tasks },
            { name: 'Completed', value: this.stats.completed },
            { name: 'Members', value: this.stats.members }
          ])
        })

        this.stopLoading()
      } catch (err) {
        this.setError(err.message || 'Failed to load statistics')
      }
    }
  }
}
</script>
