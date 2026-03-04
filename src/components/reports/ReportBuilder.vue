<template>
  <div class="space-y-6">
    <!-- Builder Header -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600">
        <h2 class="text-xl font-bold text-white">Report Builder</h2>
        <p class="text-emerald-100 text-sm mt-1">Configure and generate custom reports</p>
      </div>

      <div class="p-6 space-y-6">
        <!-- Report Type Selector -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              v-for="type in reportTypes"
              :key="type.value"
              @click="reportType = type.value"
              :class="[
                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all text-center',
                reportType === type.value
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              ]"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="type.icon" />
              </svg>
              <span class="text-xs font-medium">{{ type.label }}</span>
            </button>
          </div>
        </div>

        <!-- Chart Type Selector -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
          <div class="flex items-center gap-3">
            <button
              v-for="chart in chartTypes"
              :key="chart.value"
              @click="chartType = chart.value"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium',
                chartType === chart.value
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              ]"
            >
              {{ chart.label }}
            </button>
          </div>
        </div>

        <!-- Date Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Start Date</label>
              <input
                v-model="dateRange.start"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">End Date</label>
              <input
                v-model="dateRange.end"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">Filters</label>
            <button
              v-if="isFiltered"
              @click="clearAllFilters"
              class="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear all ({{ activeFilterCount }})
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <select
              @change="applyFilter('status', $event.target.value); $event.target.value = ''"
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="">Filter by Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
            <select
              @change="applyFilter('priority', $event.target.value); $event.target.value = ''"
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="">Filter by Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select
              @change="applyFilter('assignee', $event.target.value); $event.target.value = ''"
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="">Filter by Assignee</option>
              <option value="me">Assigned to me</option>
              <option value="unassigned">Unassigned</option>
              <option value="team">My team</option>
            </select>
          </div>

          <!-- Active filter tags -->
          <div v-if="isFiltered" class="flex flex-wrap gap-2 mt-3">
            <span
              v-for="(value, key) in activeFilters"
              :key="key"
              class="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium"
            >
              {{ key }}: {{ value }}
              <button @click="removeFilter(key)" class="hover:text-emerald-900">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            @click="downloadReport"
            :disabled="reportData.length === 0"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </span>
          </button>
          <button
            @click="generateReport"
            class="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Report
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Chart Preview -->
    <div v-if="reportData.length > 0" class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800">Report Preview</h3>
        <span class="text-xs text-gray-500">{{ reportData.length }} data points</span>
      </div>
      <div class="p-6">
        <div ref="chartCanvas" class="w-full min-h-[300px] flex items-end gap-2 justify-center">
          <!-- CSS-based bar chart preview -->
          <div
            v-for="(item, index) in reportData"
            :key="index"
            class="flex flex-col items-center gap-2"
          >
            <span class="text-xs text-gray-500 font-medium">{{ item.value }}</span>
            <div
              :style="{ height: getBarHeight(item.value) + 'px', backgroundColor: chartColors[index % chartColors.length] }"
              class="w-12 rounded-t-md transition-all duration-300"
            ></div>
            <span class="text-xs text-gray-600 truncate max-w-[60px]">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Progress -->
    <div v-if="isExporting" class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div class="flex items-center gap-4">
        <svg class="animate-spin w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-800">Exporting report...</p>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              :style="{ width: exportProgress + '%' }"
              class="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartMixin from '@/mixins/chartMixin'
import exportMixin from '@/mixins/exportMixin'
import filterMixin from '@/mixins/filterMixin'

export default {
  name: 'ReportBuilder',

  mixins: [chartMixin, exportMixin, filterMixin],

  emits: ['filters-changed'],

  data() {
    return {
      reportType: 'tasks-by-status',
      dateRange: {
        start: null,
        end: null
      },
      reportData: [],
      reportTypes: [
        { value: 'tasks-by-status', label: 'Tasks by Status', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { value: 'tasks-by-assignee', label: 'By Assignee', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
        { value: 'tasks-by-priority', label: 'By Priority', icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' },
        { value: 'project-progress', label: 'Project Progress', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' }
      ],
      chartTypes: [
        { value: 'bar', label: 'Bar Chart' },
        { value: 'pie', label: 'Pie Chart' },
        { value: 'line', label: 'Line Chart' }
      ]
    }
  },

  methods: {
    generateReport() {
      // Simulate report generation based on type
      const mockData = {
        'tasks-by-status': [
          { label: 'To Do', value: 12 },
          { label: 'In Progress', value: 8 },
          { label: 'Review', value: 5 },
          { label: 'Done', value: 23 }
        ],
        'tasks-by-assignee': [
          { label: 'Alice', value: 15 },
          { label: 'Bob', value: 10 },
          { label: 'Charlie', value: 8 },
          { label: 'Diana', value: 12 },
          { label: 'Eve', value: 3 }
        ],
        'tasks-by-priority': [
          { label: 'Low', value: 10 },
          { label: 'Medium', value: 18 },
          { label: 'High', value: 7 },
          { label: 'Critical', value: 3 }
        ],
        'project-progress': [
          { label: 'Project A', value: 75 },
          { label: 'Project B', value: 45 },
          { label: 'Project C', value: 90 },
          { label: 'Project D', value: 30 }
        ]
      }

      this.reportData = mockData[this.reportType] || []
      this.prepareChartData(this.reportData)

      this.$nextTick(() => {
        if (this.$refs.chartCanvas) {
          this.resizeChart()
        }
      })

      // Anti-pattern for testing: emit through parent
      this.$parent.$emit('report-generated', {
        type: this.reportType,
        chartType: this.chartType,
        dateRange: this.dateRange,
        filters: this.activeFilters,
        data: this.reportData
      })
    },

    downloadReport() {
      if (this.reportData.length === 0) return
      this.exportToCSV(this.reportData)
    },

    getBarHeight(value) {
      const maxValue = Math.max(...this.reportData.map(d => d.value), 1)
      return Math.round((value / maxValue) * 200)
    }
  }
}
</script>
