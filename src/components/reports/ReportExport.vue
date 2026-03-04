<template>
  <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
    <!-- Export Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <h3 class="text-lg font-semibold text-gray-800">Export Report</h3>
      <p class="text-sm text-gray-500 mt-1">Configure your export settings and download the report.</p>
    </div>

    <div class="p-6 space-y-6">
      <!-- Report Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
        <p class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
          {{ reportName || 'Untitled Report' }}
        </p>
      </div>

      <!-- Format Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="format in availableFormats"
            :key="format"
            @click="selectedFormat = format"
            :class="[
              'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
              selectedFormat === format
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <svg
              v-if="format === 'csv'"
              class="w-8 h-8"
              :class="selectedFormat === format ? 'text-blue-600' : 'text-gray-400'"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <svg
              v-else-if="format === 'pdf'"
              class="w-8 h-8"
              :class="selectedFormat === format ? 'text-blue-600' : 'text-gray-400'"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <svg
              v-else
              class="w-8 h-8"
              :class="selectedFormat === format ? 'text-blue-600' : 'text-gray-400'"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span
              :class="selectedFormat === format ? 'text-blue-700 font-semibold' : 'text-gray-600'"
              class="text-xs uppercase tracking-wider"
            >
              {{ format }}
            </span>
          </button>
        </div>
      </div>

      <!-- Export Options -->
      <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-700">Options</label>
        <div class="space-y-2">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="includeHeaders"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">Include column headers</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="includeTimestamp"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">Add export timestamp</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="includeFilters"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">Include applied filters in output</span>
          </label>
        </div>
      </div>

      <!-- Data Summary -->
      <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Export Summary</h4>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span class="text-gray-500">Rows:</span>
            <span class="ml-2 font-medium text-gray-900">{{ data.length }}</span>
          </div>
          <div>
            <span class="text-gray-500">Format:</span>
            <span class="ml-2 font-medium text-gray-900 uppercase">{{ selectedFormat }}</span>
          </div>
          <div>
            <span class="text-gray-500">Headers:</span>
            <span class="ml-2 font-medium text-gray-900">{{ includeHeaders ? 'Yes' : 'No' }}</span>
          </div>
          <div>
            <span class="text-gray-500">File name:</span>
            <span class="ml-2 font-medium text-gray-900 truncate">{{ exportFileName }}</span>
          </div>
        </div>
      </div>

      <!-- Export Progress -->
      <div v-if="isExporting" class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600 font-medium">Exporting...</span>
          <span class="text-blue-600 font-medium">{{ exportProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            :style="{ width: exportProgress + '%' }"
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          ></div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          @click="handleExport"
          :disabled="data.length === 0 || isExporting"
          class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="!isExporting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          {{ isExporting ? 'Exporting...' : 'Download ' + selectedFormat.toUpperCase() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import exportMixin from '@/mixins/exportMixin'

export default {
  name: 'ReportExport',

  mixins: [exportMixin],

  props: {
    data: {
      type: Array,
      default: () => []
    },
    reportName: {
      type: String,
      default: 'Report'
    }
  },

  emits: ['export-started', 'export-complete'],

  data() {
    return {
      selectedFormat: 'csv',
      includeHeaders: true,
      includeTimestamp: false,
      includeFilters: false
    }
  },

  methods: {
    handleExport() {
      this.$emit('export-started', {
        format: this.selectedFormat,
        rows: this.data.length,
        reportName: this.reportName
      })

      if (this.selectedFormat === 'csv') {
        this.exportToCSV(this.data)
      } else if (this.selectedFormat === 'pdf') {
        this.exportToPDF(this.data)
      } else {
        // xlsx fallback uses CSV format
        this.exportToCSV(this.data)
      }

      this.$emit('export-complete', {
        format: this.selectedFormat,
        fileName: this.exportFileName,
        rows: this.data.length
      })
    }
  }
}
</script>
