<template>
  <div class="relative inline-block">
    <!-- Export button -->
    <button
      @click="showDropdown = !showDropdown"
      class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export
      <svg :class="['w-3 h-3 transition-transform', showDropdown ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-30 overflow-hidden"
    >
      <div class="px-3 py-2 border-b bg-gray-50">
        <p class="text-xs font-semibold text-gray-500 uppercase">Export format</p>
      </div>
      <ul class="py-1">
        <li
          v-for="format in availableFormats"
          :key="format"
          @click="exportData(format)"
          class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors"
        >
          <span class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs font-bold uppercase text-gray-500">
            {{ format }}
          </span>
          <div>
            <p class="font-medium">{{ formatLabel(format) }}</p>
            <p class="text-xs text-gray-400">{{ formatDescription(format) }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- Progress overlay -->
    <div
      v-if="isExporting"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-xs w-full mx-4">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          <p class="text-sm font-medium text-gray-700">Exporting...</p>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: exportProgress + '%' }"
            ></div>
          </div>
          <p class="text-xs text-gray-400">{{ exportProgress }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import exportMixin from '@/mixins/exportMixin'

export default {
  name: 'ExportButton',

  mixins: [exportMixin],

  props: {
    data: {
      type: Array,
      default: () => []
    },
    filename: {
      type: String,
      default: 'export'
    }
  },

  data() {
    return {
      showDropdown: false
    }
  },

  emits: ['export-complete'],

  methods: {
    exportData(format) {
      this.exportFormat = format
      this.showDropdown = false

      if (format === 'csv') {
        this.exportToCSV(this.data)
      } else if (format === 'pdf') {
        this.exportToPDF(this.data)
      } else {
        this.exportToCSV(this.data)
      }

      this.$emit('export-complete', { format, filename: this.exportFileName })
    },

    formatLabel(format) {
      const labels = {
        csv: 'CSV File',
        pdf: 'PDF Document',
        xlsx: 'Excel Spreadsheet'
      }
      return labels[format] || format.toUpperCase()
    },

    formatDescription(format) {
      const descriptions = {
        csv: 'Comma-separated values',
        pdf: 'Portable document format',
        xlsx: 'Microsoft Excel format'
      }
      return descriptions[format] || 'Export file'
    }
  },

  mounted() {
    document.addEventListener('click', this._handleClickOutside = (e) => {
      if (!this.$el.contains(e.target)) {
        this.showDropdown = false
      }
    })
  },

  beforeUnmount() {
    document.removeEventListener('click', this._handleClickOutside)
  }
}
</script>
