import { ref, computed } from 'vue'

export function usePagination() {
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalItems = ref(0)

  const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value) || 1)

  const hasNextPage = computed(() => currentPage.value < totalPages.value)

  const paginatedOffset = computed(() => (currentPage.value - 1) * pageSize.value)

  function nextPage() {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  function goToPage(n) {
    if (n >= 1 && n <= totalPages.value) {
      currentPage.value = n
    }
  }

  function changePageSize(size) {
    pageSize.value = size
    currentPage.value = 1
  }

  // NOTE: hasPrevPage and prevPage are NOT defined in this composable

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage,
    paginatedOffset,
    nextPage,
    goToPage,
    changePageSize
  }
}
