// Edge case: Intentionally MISSING exportToPDF and prepareExportData.
// exportMixin has both, but this composable only implements CSV export.
// Tests partial composable coverage.
import { ref, computed } from 'vue'

export function useExport() {
  const exportFormat = ref('csv')
  const exportColumns = ref([])
  const isExporting = ref(false)
  const exportProgress = ref(0)

  const availableFormats = computed(() => ['csv', 'pdf', 'xlsx'])

  const exportFileName = computed(() => {
    const date = new Date().toISOString().split('T')[0]
    return `export_${date}.${exportFormat.value}`
  })

  function exportToCSV(data) {
    isExporting.value = true
    exportProgress.value = 0

    const headers = exportColumns.value.map(c => c.label).join(',')
    const rows = data.map(row =>
      exportColumns.value.map(c => row[c.key] || '').join(',')
    )
    const csv = [headers, ...rows].join('\n')

    exportProgress.value = 100
    isExporting.value = false
    return csv
  }

  // NOTE: exportToPDF intentionally NOT implemented
  // NOTE: prepareExportData intentionally NOT implemented

  function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || exportFileName.value
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    exportFormat,
    exportColumns,
    isExporting,
    exportProgress,
    availableFormats,
    exportFileName,
    exportToCSV,
    // NOTE: exportToPDF intentionally NOT returned
    // NOTE: prepareExportData intentionally NOT returned
    downloadFile
  }
}
