<!-- ReportDashboard.vue
  Mixins used:
  - chartMixin: Provides renderChart, destroyChart for rendering dashboard chart widgets
  - loadingMixin: Provides isLoading, startLoading/stopLoading for fetching dashboard data
  - filterMixin: Provides activeFilters, applyFilter, clearFilters for filtering report data
  This component shows a report overview dashboard with multiple chart widgets,
  a filter/date range bar, and a refresh control.
-->
<template>
  <div class="report-dashboard">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Report Dashboard</h3>
      <div class="flex items-center space-x-3">
        <input
          v-model="dateRange.start"
          type="date"
          class="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
        />
        <span class="text-gray-400 text-sm">to</span>
        <input
          v-model="dateRange.end"
          type="date"
          class="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
        />
        <button
          @click="refreshDashboard"
          class="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="flex items-center space-x-3 mb-6">
      <select @change="applyFilter('type', $event.target.value)" class="text-xs border border-gray-300 rounded px-2 py-1.5">
        <option value="">All Types</option>
        <option value="tasks">Tasks</option>
        <option value="budget">Budget</option>
        <option value="timeline">Timeline</option>
      </select>
      <select @change="applyFilter('project', $event.target.value)" class="text-xs border border-gray-300 rounded px-2 py-1.5">
        <option value="">All Projects</option>
        <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <button @click="clearFilters" class="text-xs text-indigo-600 hover:text-indigo-700">Clear filters</button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-16">
      <svg class="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>

    <!-- Dashboard grid -->
    <div v-else class="grid grid-cols-2 gap-6">
      <div class="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Task Completion Trend</h4>
        <div ref="chartTasks" class="h-48"></div>
      </div>
      <div class="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Budget Allocation</h4>
        <div ref="chartBudget" class="h-48"></div>
      </div>
      <div class="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Team Productivity</h4>
        <div ref="chartTeam" class="h-48"></div>
      </div>
      <div class="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Risk Heatmap</h4>
        <div ref="chartRisk" class="h-48"></div>
      </div>
    </div>
  </div>
</template>

<script>
import chartMixin from '@/mixins/chartMixin'
import loadingMixin from '@/mixins/loadingMixin'
import filterMixin from '@/mixins/filterMixin'

export default {
  name: 'ReportDashboard',

  mixins: [chartMixin, loadingMixin, filterMixin],

  data() {
    return {
      dateRange: { start: '', end: '' },
      projects: [],
      chartInstances: []
    }
  },

  mounted() {
    this.refreshDashboard()
  },

  beforeDestroy() {
    this.destroyChart()
  },

  methods: {
    async refreshDashboard() {
      this.startLoading('Loading dashboard...')
      // Simulated data fetch delay
      await this.$nextTick()
      this.renderCharts()
      this.stopLoading()
    },

    renderCharts() {
      if (this.$refs.chartTasks) {
        this.renderChart(this.$refs.chartTasks, { type: 'line', data: { labels: ['Jan', 'Feb', 'Mar'], values: [12, 18, 24] } })
      }
    },

    getDateRangeLabel() {
      if (this.dateRange.start && this.dateRange.end) {
        return `${this.dateRange.start} - ${this.dateRange.end}`
      }
      return 'All time'
    }
  }
}
</script>

<style scoped>
.report-dashboard {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
