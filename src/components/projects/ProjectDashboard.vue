<template>
  <!-- Edge case: Triple collision. loadingMixin provides `isLoading`, component data() also
       defines `isLoading: true`, AND setup() returns `isLoading` from useLoading() composable.
       Tests which source wins in Vue 2 merge resolution. -->
  <div class="project-dashboard">
    <div class="dashboard-header">
      <h2 class="dashboard-title">Project Dashboard</h2>
      <div class="dashboard-controls">
        <select v-model="chartType" class="chart-type-select">
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
        <button @click="refreshDashboard" class="btn-refresh" :disabled="isLoading">
          {{ isLoading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner-container">
        <div class="spinner"></div>
        <p>{{ loadingMessage || 'Loading dashboard data...' }}</p>
      </div>
    </div>

    <div v-else class="dashboard-grid">
      <div class="chart-panel">
        <h3>Task Distribution</h3>
        <div v-if="hasData" class="chart-wrapper">
          <canvas ref="chartCanvas"></canvas>
        </div>
        <div v-else class="no-data">
          <p>No chart data available</p>
        </div>
      </div>

      <div class="stats-panel">
        <div class="stat-card">
          <span class="stat-label">Total Tasks</span>
          <span class="stat-value">{{ projectStats.totalTasks }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Completed</span>
          <span class="stat-value">{{ projectStats.completedTasks }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">In Progress</span>
          <span class="stat-value">{{ projectStats.inProgressTasks }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Overdue</span>
          <span class="stat-value text-danger">{{ projectStats.overdueTasks }}</span>
        </div>
      </div>

      <div class="recent-activity-panel">
        <h3>Recent Activity</h3>
        <ul class="activity-list">
          <li v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <span class="activity-user">{{ activity.user }}</span>
            <span class="activity-action">{{ activity.action }}</span>
            <span class="activity-time">{{ activity.timeAgo }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="hasError" class="error-banner">
      <p>{{ error }}</p>
      <button v-if="canRetry" @click="retry(() => refreshDashboard())">Retry</button>
    </div>
  </div>
</template>

<script>
import { useLoading } from '@/composables/useLoading'
import loadingMixin from '@/mixins/loadingMixin'
import chartMixin from '@/mixins/chartMixin'
import { api } from '@/services/api'

export default {
  name: 'ProjectDashboard',

  mixins: [loadingMixin, chartMixin],

  setup() {
    const { isLoading, startLoading: startComposableLoading, stopLoading: stopComposableLoading } = useLoading()

    return {
      isLoading,
      startComposableLoading,
      stopComposableLoading
    }
  },

  props: {
    projectId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      isLoading: true,
      projectStats: {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0
      },
      recentActivities: []
    }
  },

  async created() {
    await this.refreshDashboard()
  },

  methods: {
    async refreshDashboard() {
      this.startLoading('Loading dashboard data...')
      try {
        const [stats, activities] = await Promise.all([
          api.get(`/projects/${this.projectId}/stats`),
          api.get(`/projects/${this.projectId}/activities`)
        ])
        this.projectStats = stats
        this.recentActivities = activities

        await this.loadTaskChartData(this.projectId)
      } catch (err) {
        this.setError(err.message || 'Failed to load dashboard')
      } finally {
        this.stopLoading()
      }
    }
  }
}
</script>

<style scoped>
.project-dashboard {
  padding: 1.5rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.stats-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 4rem;
}

.error-banner {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
}
</style>
