// Edge case: Intentionally MISSING appliedFilterSummary from return.
// filterMixin has appliedFilterSummary computed, but this composable omits it.
// Tests BLOCKED_NOT_RETURNED detection.
import { ref, computed } from 'vue'

export function useFilter() {
  const filters = ref({})
  const activeFilters = ref([])
  const filterOptions = ref({})

  const activeFilterCount = computed(() => activeFilters.value.length)
  const isFiltered = computed(() => activeFilters.value.length > 0)

  // NOTE: appliedFilterSummary is intentionally NOT implemented

  function applyFilter(key, value) {
    activeFilters.value.push({ key, value })
  }

  function removeFilter(key) {
    activeFilters.value = activeFilters.value.filter(f => f.key !== key)
  }

  function clearAllFilters() {
    activeFilters.value = []
    filters.value = {}
  }

  function getFilterOptions(key) {
    return filterOptions.value[key] || []
  }

  return {
    filters,
    activeFilters,
    filterOptions,
    activeFilterCount,
    isFiltered,
    // NOTE: appliedFilterSummary intentionally NOT returned
    applyFilter,
    removeFilter,
    clearAllFilters,
    getFilterOptions
  }
}
