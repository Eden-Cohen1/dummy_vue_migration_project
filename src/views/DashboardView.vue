<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Welcome Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Welcome back, {{ userName }}</h1>
      <p class="mt-1 text-sm text-gray-500">Here's what's happening with your projects today.</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Overview -->
      <div class="mb-8">
        <StatsOverview :projects="projects" :tasks="tasks" />
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Project Summary Chart -->
        <div class="rounded-lg bg-white p-6 shadow">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">Project Summary</h2>
          <ProjectSummaryChart :projects="projects" />
        </div>

        <!-- Task Distribution -->
        <div class="rounded-lg bg-white p-6 shadow">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">Task Distribution</h2>
          <TaskDistribution :tasks="tasks" />
        </div>

        <!-- Recent Activity -->
        <div class="rounded-lg bg-white p-6 shadow">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
          <RecentActivity :projects="projects" :tasks="tasks" />
        </div>

        <!-- Upcoming Deadlines -->
        <div class="rounded-lg bg-white p-6 shadow">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
          <UpcomingDeadlines :tasks="tasks" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StatsOverview from '@/components/dashboard/StatsOverview.vue'
import RecentActivity from '@/components/dashboard/RecentActivity.vue'
import ProjectSummaryChart from '@/components/dashboard/ProjectSummaryChart.vue'
import TaskDistribution from '@/components/dashboard/TaskDistribution.vue'
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines.vue'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import loadingMixin from '@/mixins/loadingMixin'
import chartMixin from '@/mixins/chartMixin'

export default {
  name: 'DashboardView',

  components: {
    StatsOverview,
    RecentActivity,
    ProjectSummaryChart,
    TaskDistribution,
    UpcomingDeadlines
  },

  mixins: [loadingMixin, chartMixin],

  data() {
    return {
      projects: [],
      tasks: [],
      userName: 'User'
    }
  },

  created() {
    this.fetchDashboardData()
  },

  methods: {
    async fetchDashboardData() {
      this.startLoading()
      try {
        const projectStore = useProjectsStore()
        const taskStore = useTasksStore()
        await Promise.all([
          projectStore.fetchProjects(),
          taskStore.fetchTasks()
        ])
        this.projects = projectStore.projects
        this.tasks = taskStore.tasks
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        this.stopLoading()
      }
    }
  }
}
</script>
