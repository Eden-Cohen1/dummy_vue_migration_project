// Edge case: Filename does NOT follow useXxx convention.
// Named searchHelpers.js instead of useSearchXxx.js.
// The migration tool maps searchMixin → useSearch.js, so this file
// won't be found by convention-based lookup. Tests BLOCKED_NO_COMPOSABLE.
import { ref, computed } from 'vue'

export function searchHelpers() {
  const query = ref('')
  const results = ref([])
  const isSearching = ref(false)

  const hasResults = computed(() => results.value.length > 0)
  const resultCount = computed(() => results.value.length)

  function search(items, query) {
    isSearching.value = true
    results.value = items.filter(item =>
      JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
    )
    isSearching.value = false
    return results.value
  }

  function clearSearch() {
    query.value = ''
    results.value = []
  }

  return {
    query,
    results,
    isSearching,
    hasResults,
    resultCount,
    search,
    clearSearch
  }
}
