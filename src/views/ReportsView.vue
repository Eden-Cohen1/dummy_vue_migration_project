<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Reports</h1>
      <p class="mt-1 text-sm text-gray-500">Generate and view reports to track project progress and team performance.</p>
    </div>

    <!-- Report Builder Controls -->
    <div class="mb-6 rounded-lg bg-white p-6 shadow">
      <h2 class="mb-4 text-lg font-semibold text-gray-900">Report Builder</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <!-- Report Type Selector -->
        <div>
          <label for="reportType" class="block text-sm font-medium text-gray-700">Report Type</label>
          <select
            id="reportType"
            v-model="reportType"
            class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="tasks-by-status">Tasks by Status</option>
            <option value="tasks-by-priority">Tasks by Priority</option>
            <option value="projects-overview">Projects Overview</option>
            <option value="team-workload">Team Workload</option>
            <option value="completion-trends">Completion Trends</option>
          </select>
        </div>

        <!-- Date Range (placeholder) -->
        <div>
          <label for="dateRange" class="block text-sm font-medium text-gray-700">Date Range</label>
          <select
            id="dateRange"
            v-model="dateRange"
            class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <!-- Generate Button -->
        <div class="flex items-end">
          <button
            class="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="generateReport"
          >
            Generate Report
          </button>
        </div>
      </div>

      <ReportBuilder
        class="mt-4"
        :report-type="reportType"
        @generate="generateReport"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>

    <!-- Report Results -->
    <template v-else-if="showReport">
      <!-- Chart Display -->
      <div class="mb-6 rounded-lg bg-white p-6 shadow">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Chart</h2>
          <ReportExport :report-data="reportData" :report-type="reportType" />
        </div>
        <ReportChart :data="reportData" :type="reportType" />
      </div>

      <!-- Table Display -->
      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="mb-4 text-lg font-semibold text-gray-900">Data Table</h2>
        <ReportTable :data="reportData" :type="reportType" />
      </div>
    </template>

    <!-- Empty State -->
    <div v-else class="rounded-lg bg-white py-16 text-center shadow">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No report generated</h3>
      <p class="mt-1 text-sm text-gray-500">Select a report type and click Generate to view results.</p>
    </div>
  </div>
</template>

<script>
import ReportBuilder from '@/components/reports/ReportBuilder.vue'
import ReportChart from '@/components/reports/ReportChart.vue'
import ReportTable from '@/components/reports/ReportTable.vue'
import ReportExport from '@/components/reports/ReportExport.vue'
import loadingMixin from '@/mixins/loadingMixin'
import chartMixin from '@/mixins/chartMixin'

export default {
  name: 'ReportsView',

  components: {
    ReportBuilder,
    ReportChart,
    ReportTable,
    ReportExport
  },

  mixins: [loadingMixin, chartMixin],

  data() {
    return {
      reportData: [],
      reportType: 'tasks-by-status',
      dateRange: '30d',
      showReport: false
    }
  },

  methods: {
    async generateReport() {
      this.startLoading()
      try {
        // Simulate report generation
        await new Promise((resolve) => setTimeout(resolve, 500))
        this.reportData = []
        this.showReport = true
      } catch (error) {
        console.error('Failed to generate report:', error)
      } finally {
        this.stopLoading()
      }
    }
  }
}
</script>
