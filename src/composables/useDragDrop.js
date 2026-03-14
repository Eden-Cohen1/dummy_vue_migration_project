// Edge case: Happy path — all members from dragDropMixin are present and returned.
// This composable has full coverage, used as a control case for comparison
// against incomplete composables.
import { ref, computed } from 'vue'

export function useDragDrop() {
  const isDragging = ref(false)
  const dragItem = ref(null)
  const dropTarget = ref(null)
  const dragOverIndex = ref(-1)

  const hasDragItem = computed(() => dragItem.value !== null)

  const dropPosition = computed(() => {
    if (dragOverIndex.value === -1) return null
    return dragOverIndex.value
  })

  function onDragStart(item, event) {
    isDragging.value = true
    dragItem.value = item
    if (event && event.target) {
      event.target.classList.add('dragging')
    }
  }

  function onDragOver(index, event) {
    if (event) event.preventDefault()
    dragOverIndex.value = index
    if (event && event.currentTarget) {
      event.currentTarget.classList.add('drag-active')
    }
  }

  function onDrop(targetIndex, emit) {
    if (!dragItem.value) return
    dropTarget.value = targetIndex
    if (emit) {
      emit('item-reordered', {
        item: dragItem.value,
        from: dragItem.value.index,
        to: targetIndex
      })
    }
    onDragEnd()
  }

  function onDragEnd(event) {
    isDragging.value = false
    dragItem.value = null
    dropTarget.value = null
    dragOverIndex.value = -1
    if (event && event.target) {
      event.target.classList.remove('dragging')
    }
    document.querySelectorAll('.drag-active').forEach(el => {
      el.classList.remove('drag-active')
    })
  }

  return {
    isDragging,
    dragItem,
    dropTarget,
    dragOverIndex,
    hasDragItem,
    dropPosition,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd
  }
}
