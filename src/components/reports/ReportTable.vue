<template>
  <div ref="tableContainer" class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
    <!-- Table Header -->
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
      <div class="flex items-center gap-3">
        <h3 class="text-lg font-semibold text-gray-800">Report Data</h3>
        <span class="text-xs text-gray-500 bg-gray-200 rounded-full px-2.5 py-0.5">
          {{ data.length }} row{{ data.length !== 1 ? 's' : '' }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="exportToCSV(data)"
          :disabled="data.length === 0"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
        <button
          @click="exportToPDF(data)"
          :disabled="data.length === 0"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Export PDF
        </button>
      </div>
    </div>

    <!-- Export Progress -->
    <div v-if="isExporting" class="px-6 py-2 bg-blue-50 border-b border-blue-200">
      <div class="flex items-center gap-3">
        <svg class="animate-spin w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <div class="flex-1">
          <div class="w-full bg-blue-200 rounded-full h-1.5">
            <div
              :style="{ width: exportProgress + '%' }"
              class="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            ></div>
          </div>
        </div>
        <span class="text-xs text-blue-700 font-medium">{{ exportProgress }}%</span>
      </div>
    </div>

    <!-- Table Content -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th
              v-for="col in visibleTableColumns"
              :key="col.key"
              :data-col="col.key"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              @click="sortBy(col.key)"
            >
              <div class="flex items-center gap-1">
                <span>{{ col.label }}</span>
                <span v-if="sortField === col.key" class="text-blue-500">
                  {{ sortDirection === 'asc' ? '\u25B2' : '\u25BC' }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, index) in sortedTableRows"
            :key="index"
            class="hover:bg-gray-50 transition-colors duration-100"
          >
            <td class="px-4 py-3 text-xs text-gray-400 font-mono">
              {{ index + 1 }}
            </td>
            <td
              v-for="col in visibleTableColumns"
              :key="col.key"
              class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
            >
              <template v-if="col.type === 'status'">
                <span
                  :class="getStatusClass(row[col.key])"
                  class="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ row[col.key] }}
                </span>
              </template>
              <template v-else-if="col.type === 'number'">
                <span class="font-mono">{{ formatNumber(row[col.key]) }}</span>
              </template>
              <template v-else-if="col.type === 'percentage'">
                <div class="flex items-center gap-2">
                  <div class="w-16 bg-gray-200 rounded-full h-1.5">
                    <div
                      :style="{ width: Math.min(row[col.key], 100) + '%' }"
                      class="bg-blue-500 h-1.5 rounded-full"
                    ></div>
                  </div>
                  <span class="text-xs text-gray-600">{{ row[col.key] }}%</span>
                </div>
              </template>
              <template v-else>
                {{ row[col.key] }}
              </template>
            </td>
          </tr>
          <tr v-if="data.length === 0">
            <td :colspan="visibleTableColumns.length + 1" class="px-4 py-12 text-center text-gray-400 text-sm">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No report data to display</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer -->
    <div v-if="data.length > 0" class="px-6 py-3 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span>Showing {{ data.length }} rows across {{ visibleTableColumns.length }} columns</span>
        <span>Last updated: {{ lastUpdated }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import tableMixin from '@/mixins/tableMixin'
import exportMixin from '@/mixins/exportMixin'

export default {
  name: 'ReportTable',

  mixins: [tableMixin, exportMixin],

  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      lastUpdated: new Date().toLocaleString()
    }
  },

  computed: {
    visibleTableColumns() {
      if (this.columns.length > 0) {
        return this.columns.filter(c => !c.hidden)
      }
      // Auto-generate columns from data
      if (this.data.length > 0) {
        return Object.keys(this.data[0]).map(key => ({
          key: key,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          sortable: true,
          type: typeof this.data[0][key] === 'number' ? 'number' : 'text'
        }))
      }
      return []
    },

    sortedTableRows() {
      if (!this.sortField) return this.data

      return [...this.data].sort((a, b) => {
        const valA = a[this.sortField]
        const valB = b[this.sortField]

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }
  },

  watch: {
    data: {
      handler() {
        this.rows = this.data
        this.totalItems = this.data.length
        this.exportColumns = this.visibleTableColumns.map(c => c.key)
        this.lastUpdated = new Date().toLocaleString()
      },
      immediate: true
    }
  },

  methods: {
    getStatusClass(status) {
      const classes = {
        active: 'bg-green-100 text-green-700',
        completed: 'bg-blue-100 text-blue-700',
        pending: 'bg-yellow-100 text-yellow-700',
        overdue: 'bg-red-100 text-red-700',
        cancelled: 'bg-gray-100 text-gray-700'
      }
      return classes[status] || 'bg-gray-100 text-gray-700'
    },

    formatNumber(value) {
      if (typeof value !== 'number') return value
      return value.toLocaleString()
    }
  },

  beforeUpdate() {
    // Track render cycle for performance monitoring
    if (this.$refs.tableContainer) {
      this.$refs.tableContainer.dataset.lastRender = Date.now()
    }
  }
}
</script>
