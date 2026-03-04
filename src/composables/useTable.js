import { ref, computed } from 'vue'

export function useTable() {
  const rows = ref([])
  const columns = ref([])
  const sortField = ref('')
  const sortDirection = ref('asc')
  const expandedRows = ref([])

  const sortedRows = computed(() => {
    if (!sortField.value) return rows.value
    return [...rows.value].sort((a, b) => {
      const aVal = a[sortField.value]
      const bVal = b[sortField.value]
      const modifier = sortDirection.value === 'asc' ? 1 : -1
      if (aVal < bVal) return -1 * modifier
      if (aVal > bVal) return 1 * modifier
      return 0
    })
  })

  const visibleColumns = computed(() => {
    return columns.value.filter(col => col.visible !== false)
  })

  const hasExpandedRows = computed(() => expandedRows.value.length > 0)

  function sortBy(field) {
    if (sortField.value === field) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortDirection.value = 'asc'
    }
  }

  function toggleRow(id) {
    const index = expandedRows.value.indexOf(id)
    if (index === -1) {
      expandedRows.value.push(id)
    } else {
      expandedRows.value.splice(index, 1)
    }
  }

  function collapseAll() {
    expandedRows.value = []
  }

  function getColumnClass(col) {
    return {
      sortable: col.sortable !== false,
      sorted: sortField.value === col.key,
      [sortDirection.value]: sortField.value === col.key
    }
  }

  // NOTE: sortDirection and collapseAll are intentionally NOT returned
  return {
    rows,
    columns,
    sortField,
    expandedRows,
    sortedRows,
    visibleColumns,
    hasExpandedRows,
    sortBy,
    toggleRow,
    getColumnClass
  }
}
