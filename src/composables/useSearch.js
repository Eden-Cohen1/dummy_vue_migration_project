import { ref, computed } from 'vue'

export function useSearch() {
  const searchQuery = ref('')
  const searchResults = ref([])
  const isSearching = ref(false)
  const searchHistory = ref([])

  const hasResults = computed(() => searchResults.value.length > 0)
  const resultCount = computed(() => searchResults.value.length)
  const recentSearches = computed(() => searchHistory.value.slice(-5))

  function search() {
    if (!searchQuery.value.trim()) return
    isSearching.value = true
    addToHistory(searchQuery.value)
    // Simulate search logic
    isSearching.value = false
  }

  function clearSearch() {
    searchQuery.value = ''
    searchResults.value = []
  }

  function addToHistory(query) {
    if (!searchHistory.value.includes(query)) {
      searchHistory.value.push(query)
    }
  }

  return {
    searchQuery,
    searchResults,
    isSearching,
    searchHistory,
    hasResults,
    resultCount,
    recentSearches,
    search,
    clearSearch,
    addToHistory
  }
}
