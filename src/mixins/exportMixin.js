import { useSettingsStore } from '@/stores/settings'
import { formatDate, formatDateTime } from '@/utils/helpers'

export default {
  data() {
    return {
      exportFormat: 'csv',
      exportColumns: [],
      isExporting: false,
      exportProgress: 0
    }
  },

  computed: {
    availableFormats() {
      return ['csv', 'pdf', 'xlsx']
    },

    exportFileName() {
      const settingsStore = useSettingsStore()
      const lang = settingsStore.settings.language || 'en'
      const dateStr = formatDate(new Date())
      return 'export_' + lang + '_' + dateStr.replace(/[\s,]/g, '-') + '.' + this.exportFormat
    }
  },

  methods: {
    exportToCSV(data) {
      this.isExporting = true
      this.exportProgress = 0

      const settingsStore = useSettingsStore()
      const maxRows = settingsStore.settings.pageSize || 1000
      const exportData = data.slice(0, maxRows)
      const columns = this.exportColumns.length > 0
        ? this.exportColumns
        : Object.keys(exportData[0] || {})

      const header = columns.join(',')
      const rows = exportData.map(row => {
        return columns.map(col => {
          let value = row[col]
          // Format date columns using helper
          if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)) && col.toLowerCase().includes('date'))) {
            value = formatDateTime(value)
          }
          if (typeof value === 'string' && value.includes(',')) {
            return '"' + value + '"'
          }
          return value
        }).join(',')
      })

      const csv = [header, ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })

      this.exportProgress = 100
      this.isExporting = false
      this.downloadFile(blob, this.exportFileName)
    },

    exportToPDF(data) {
      this.isExporting = true
      this.exportProgress = 0

      // Simulate PDF export processing
      const preparedData = this.prepareExportData(data)
      this.exportProgress = 50

      // Simulated PDF blob creation
      const blob = new Blob([JSON.stringify(preparedData)], { type: 'application/pdf' })

      this.exportProgress = 100
      this.isExporting = false
      this.downloadFile(blob, this.exportFileName)
    },

    downloadFile(blob, name) {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },

    prepareExportData(data) {
      if (this.exportColumns.length === 0) {
        return data
      }
      return data.map(row => {
        const filtered = {}
        this.exportColumns.forEach(col => {
          if (row[col] !== undefined) {
            filtered[col] = row[col]
          }
        })
        return filtered
      })
    }
  }
}
