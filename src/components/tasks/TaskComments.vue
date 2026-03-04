<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      Comments
      <span v-if="commentCount > 0" class="text-sm font-normal text-gray-500 ml-1">({{ commentCount }})</span>
    </h3>

    <!-- Loading state -->
    <div v-if="isLoadingComments" class="flex items-center justify-center py-8">
      <svg class="animate-spin h-6 w-6 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      <span class="text-sm text-gray-500">Loading comments...</span>
    </div>

    <template v-else>
      <!-- New Comment Input -->
      <div class="mb-6">
        <div class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            U
          </div>
          <div class="flex-1">
            <textarea
              ref="commentInput"
              v-model="newComment"
              rows="3"
              placeholder="Write a comment..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 resize-y"
            ></textarea>
            <div class="flex items-center justify-between mt-2">
              <p class="text-xs text-gray-400">
                Press Ctrl+Enter to submit
              </p>
              <button
                @click="handleAddComment"
                :disabled="!newComment.trim()"
                :class="[
                  'px-4 py-1.5 text-sm font-medium text-white rounded-lg transition-colors',
                  newComment.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-indigo-300 cursor-not-allowed'
                ]"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reply input (shown when replying) -->
      <div v-if="replyingTo !== null" class="mb-4 ml-11 pl-4 border-l-2 border-indigo-200">
        <p class="text-xs text-indigo-600 mb-2 font-medium">Replying to comment</p>
        <textarea
          v-model="replyText"
          rows="2"
          placeholder="Write your reply..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 resize-y"
        ></textarea>
        <div class="flex items-center gap-2 mt-2">
          <button
            @click="handleReply"
            :disabled="!replyText.trim()"
            :class="[
              'px-3 py-1 text-sm font-medium text-white rounded-md transition-colors',
              replyText.trim()
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-indigo-300 cursor-not-allowed'
            ]"
          >
            Reply
          </button>
          <button
            @click="cancelReply"
            class="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Comments list -->
      <div v-if="hasComments" class="space-y-1">
        <div
          v-for="comment in sortedComments"
          :key="comment.id"
          :class="[
            'flex gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50',
            comment.parentId ? 'ml-11 pl-4 border-l-2 border-gray-200' : ''
          ]"
        >
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0',
              comment.parentId ? 'bg-gray-200 text-gray-600' : 'bg-gray-300 text-gray-700'
            ]"
          >
            {{ (comment.author || 'U').charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-medium text-gray-900">{{ comment.author }}</span>
              <span class="text-xs text-gray-400">{{ comment.createdAt }}</span>
              <span v-if="comment.updatedAt" class="text-xs text-gray-400 italic">(edited)</span>
            </div>

            <!-- Editing state -->
            <div v-if="editingComment === comment.id">
              <textarea
                v-model="editText"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 resize-y"
              ></textarea>
              <div class="flex items-center gap-2 mt-2">
                <button
                  @click="saveEdit(comment.id)"
                  class="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Save
                </button>
                <button
                  @click="cancelEdit"
                  class="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            <!-- Display state -->
            <template v-else>
              <p class="text-sm text-gray-700">{{ comment.text }}</p>
              <div class="flex items-center gap-3 mt-2">
                <button
                  v-if="!comment.parentId"
                  @click="startReply(comment.id)"
                  class="text-xs text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  Reply
                </button>
                <button
                  @click="startEdit(comment)"
                  class="text-xs text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="deleteComment(comment.id)"
                  class="text-xs text-gray-500 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-8">
        <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-sm text-gray-400">No comments yet</p>
        <p class="text-xs text-gray-400 mt-1">Start the conversation!</p>
      </div>
    </template>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="flex items-center justify-center py-4">
      <p class="text-sm text-gray-500">{{ loadingMessage }}</p>
    </div>

    <!-- Error state -->
    <div v-if="hasError" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
      <p class="text-sm text-red-600">{{ error }}</p>
      <button
        v-if="canRetry"
        @click="retry(() => loadComments(entityId || taskId))"
        class="mt-2 text-sm text-red-600 underline hover:text-red-700"
      >
        Retry
      </button>
    </div>
  </div>
</template>

<script>
import commentMixin from '@/mixins/commentMixin'
import loadingMixin from '@/mixins/loadingMixin'

export default {
  name: 'TaskComments',

  mixins: [commentMixin, loadingMixin],

  props: {
    taskId: {
      type: [String, Number],
      required: true
    },
    entityId: {
      type: [String, Number],
      default: null
    }
  },

  data() {
    return {
      replyingTo: null,
      replyText: '',
      editText: ''
    }
  },

  mounted() {
    this.loadComments(this.entityId || this.taskId)
  },

  methods: {
    handleAddComment() {
      this.addComment()
      this.$emit('comment-added')
    },

    startReply(commentId) {
      this.replyingTo = commentId
      this.replyText = ''
    },

    cancelReply() {
      this.replyingTo = null
      this.replyText = ''
    },

    handleReply() {
      if (!this.replyText.trim() || this.replyingTo === null) return
      this.replyToComment(this.replyingTo, this.replyText)
      this.replyingTo = null
      this.replyText = ''
      this.$emit('comment-added')
    },

    startEdit(comment) {
      this.editingComment = comment.id
      this.editText = comment.text
    },

    cancelEdit() {
      this.editingComment = null
      this.editText = ''
    },

    saveEdit(commentId) {
      if (!this.editText.trim()) return
      this.editComment(commentId, this.editText)
      this.editText = ''
    }
  }
}
</script>
