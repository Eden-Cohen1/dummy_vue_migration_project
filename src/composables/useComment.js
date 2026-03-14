// Edge case: Composable exists but is essentially a stub — missing most members
// from commentMixin. Only implements basic comment loading. Tests BLOCKED_NOT_RETURNED
// for the majority of commentMixin's API surface.
import { ref, computed } from 'vue'

export function useComment() {
  const comments = ref([])
  const newComment = ref('')
  const isLoadingComments = ref(false)

  const commentCount = computed(() => comments.value.length)
  const hasComments = computed(() => comments.value.length > 0)

  // NOTE: sortedComments intentionally NOT implemented
  // NOTE: formattedComments intentionally NOT implemented
  // NOTE: editingComment intentionally NOT implemented

  function loadComments(entityId) {
    isLoadingComments.value = true
    // Stub implementation
    setTimeout(() => {
      isLoadingComments.value = false
    }, 100)
  }

  function addComment(text) {
    comments.value.push({
      id: Date.now(),
      text: text || newComment.value,
      createdAt: new Date().toISOString()
    })
    newComment.value = ''
  }

  // NOTE: editComment intentionally NOT implemented
  // NOTE: deleteComment intentionally NOT implemented
  // NOTE: replyToComment intentionally NOT implemented

  return {
    comments,
    newComment,
    isLoadingComments,
    commentCount,
    hasComments,
    // NOTE: sortedComments intentionally NOT returned
    // NOTE: formattedComments intentionally NOT returned
    // NOTE: editingComment intentionally NOT returned
    loadComments,
    addComment
    // NOTE: editComment intentionally NOT returned
    // NOTE: deleteComment intentionally NOT returned
    // NOTE: replyToComment intentionally NOT returned
  }
}
