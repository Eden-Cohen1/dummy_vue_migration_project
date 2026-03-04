import { ref, computed } from 'vue'

export function useSelection() {
  const selectedItems = ref([])
  const selectionMode = ref('single')
  const lastSelected = ref(null)

  const hasSelection = computed(() => selectedItems.value.length > 0)
  const selectionCount = computed(() => selectedItems.value.length)
  const allSelected = computed(() => false) // Needs context of total items

  function select(item) {
    if (selectionMode.value === 'single') {
      selectedItems.value = [item]
    } else {
      if (!selectedItems.value.includes(item)) {
        selectedItems.value.push(item)
      }
    }
    lastSelected.value = item
  }

  function deselect(item) {
    const index = selectedItems.value.indexOf(item)
    if (index !== -1) {
      selectedItems.value.splice(index, 1)
    }
  }

  function toggleSelection(item) {
    if (selectedItems.value.includes(item)) {
      deselect(item)
    } else {
      select(item)
    }
  }

  function selectAll(items) {
    selectedItems.value = [...items]
    lastSelected.value = items[items.length - 1] || null
  }

  function deselectAll() {
    selectedItems.value = []
    lastSelected.value = null
  }

  function isSelected(item) {
    return selectedItems.value.includes(item)
  }

  // NOTE: deselectAll is intentionally NOT returned
  return {
    selectedItems,
    selectionMode,
    lastSelected,
    hasSelection,
    selectionCount,
    allSelected,
    select,
    deselect,
    toggleSelection,
    selectAll,
    isSelected
  }
}
