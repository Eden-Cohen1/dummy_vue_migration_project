// Edge case: sortKey is declared as a plain `let` instead of ref().
// This means it won't be reactive when used in templates. Tests type mismatch
// detection — the composable has the member but it's not properly reactive.
import { ref, computed } from 'vue'

export function useSort(defaultKey = 'name') {
  // BUG: sortKey is a plain let, not ref() — won't be reactive
  let sortKey = defaultKey
  const sortOrder = ref('asc')
  const multiSort = ref([])
  const sortHistory = ref([])

  const sortIndicator = computed(() => {
    return sortOrder.value === 'asc' ? '▲' : '▼'
  })

  const isSorted = computed(() => {
    return sortKey !== ''
  })

  function toggleSort(key) {
    if (sortKey === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey = key
      sortOrder.value = 'asc'
    }
    sortHistory.value.push({ key: sortKey, order: sortOrder.value })
  }

  function clearSort() {
    sortKey = ''
    sortOrder.value = 'asc'
    multiSort.value = []
  }

  function addSortLevel(key, order = 'asc') {
    multiSort.value.push({ key, order })
  }

  return {
    sortKey,
    sortOrder,
    multiSort,
    sortHistory,
    sortIndicator,
    isSorted,
    toggleSort,
    clearSort,
    addSortLevel
  }
}
