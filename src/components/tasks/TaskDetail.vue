<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center py-20">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-indigo-500 mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <p class="text-sm text-gray-500">{{ loadingMessage }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="flex-1 flex items-center justify-center py-20">
      <div class="flex flex-col items-center text-center">
        <svg class="w-12 h-12 text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="text-sm font-medium text-red-600 mb-2">Failed to load task</p>
        <p class="text-xs text-gray-500 mb-3">{{ error }}</p>
        <button
          v-if="canRetry"
          @click="retry(() => fetchTask())"
          class="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <template v-else-if="task">
      <!-- Left: Task Details -->
      <div class="flex-1 space-y-6">
        <!-- Title and actions -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-start justify-between mb-4">
            <h1 class="text-xl font-bold text-gray-900">{{ task.title }}</h1>
            <div class="flex items-center gap-2" v-if="canEdit">
              <button
                @click="handleEdit"
                class="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Edit
              </button>
              <button
                v-if="canDelete"
                @click="handleDelete"
                class="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Description -->
          <div class="prose prose-sm max-w-none text-gray-700">
            <p v-if="task.description">{{ task.description }}</p>
            <p v-else class="text-gray-400 italic">No description provided.</p>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Comments
            <span v-if="commentCount > 0" class="text-sm font-normal text-gray-500 ml-1">({{ commentCount }})</span>
          </h2>

          <!-- New Comment Input -->
          <div class="mb-6">
            <textarea
              ref="commentInput"
              v-model="newComment"
              rows="3"
              placeholder="Write a comment..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 resize-y"
            ></textarea>
            <div class="flex justify-end mt-2">
              <button
                @click="addComment"
                :disabled="!newComment.trim()"
                :class="[
                  'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
                  newComment.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-indigo-300 cursor-not-allowed'
                ]"
              >
                Post Comment
              </button>
            </div>
          </div>

          <!-- Comments List -->
          <div v-if="isLoadingComments" class="text-center py-4">
            <p class="text-sm text-gray-500">Loading comments...</p>
          </div>
          <div v-else-if="hasComments" class="space-y-4">
            <div
              v-for="comment in sortedComments"
              :key="comment.id"
              class="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium flex-shrink-0">
                {{ (comment.author || 'U').charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-gray-900">{{ comment.author }}</span>
                  <span class="text-xs text-gray-400">{{ comment.createdAt }}</span>
                </div>
                <p class="text-sm text-gray-700">{{ comment.text }}</p>
                <div class="flex items-center gap-3 mt-2">
                  <button
                    @click="startReply(comment.id)"
                    class="text-xs text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                    Reply
                  </button>
                  <button
                    @click="deleteComment(comment.id)"
                    class="text-xs text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6">
            <p class="text-sm text-gray-400">No comments yet. Be the first to comment!</p>
          </div>
        </div>
      </div>

      <!-- Right: Metadata Sidebar -->
      <div class="lg:w-80 space-y-4">
        <!-- Status -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Details</h3>
          <dl class="space-y-3">
            <div class="flex items-center justify-between">
              <dt class="text-sm text-gray-500">Status</dt>
              <dd>
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    statusBadgeClass
                  ]"
                >
                  {{ task.status }}
                </span>
              </dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-sm text-gray-500">Priority</dt>
              <dd>
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    priorityBadgeClass
                  ]"
                >
                  {{ task.priority }}
                </span>
              </dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-sm text-gray-500">Assignee</dt>
              <dd class="text-sm text-gray-900">
                {{ task.assignee?.name || task.assignee || 'Unassigned' }}
              </dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-sm text-gray-500">Due Date</dt>
              <dd class="text-sm text-gray-900">
                {{ task.dueDate || 'No due date' }}
              </dd>
            </div>
            <div class="flex items-center justify-between" v-if="task.createdAt">
              <dt class="text-sm text-gray-500">Created</dt>
              <dd class="text-sm text-gray-900">{{ task.createdAt }}</dd>
            </div>
          </dl>
        </div>

        <!-- Tags -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4" v-if="task.tags && task.tags.length">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tags</h3>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in task.tags"
              :key="tag"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Permission info -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Permissions</h3>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span :class="canEdit ? 'text-green-500' : 'text-red-400'">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path v-if="canEdit" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
              <span class="text-gray-600">Can Edit</span>
            </div>
            <div class="flex items-center gap-2">
              <span :class="canDelete ? 'text-green-500' : 'text-red-400'">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path v-if="canDelete" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
              <span class="text-gray-600">Can Delete</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { usePermission } from '@/composables/usePermission'
import { useLoading } from '@/composables/useLoading'
import { useComment } from '@/composables/useComment'
import { api } from '@/services/api'

export default {
  name: 'TaskDetail',

  props: {
    taskId: {
      type: [String, Number],
      required: true
    }
  },
  setup() {
    const { comments, newComment, isLoadingComments, commentCount, sortedComments, hasComments, addComment, deleteComment, loadComments } = useComment()
    const { isLoading, loadingMessage, error, hasError, canRetry, startLoading, stopLoading, setError, retry } = useLoading()
    const { canEdit, canDelete } = usePermission()

    return { comments, newComment, isLoadingComments, commentCount, sortedComments, hasComments, addComment, deleteComment, loadComments, isLoading, loadingMessage, error, hasError, canRetry, startLoading, stopLoading, setError, retry, canEdit, canDelete }
  },

  data() {
    return {
      task: null,
      replyingTo: null
    }
  },

  computed: {
    statusBadgeClass() {
      const classes = {
        'todo': 'bg-gray-100 text-gray-700',
        'in-progress': 'bg-blue-100 text-blue-700',
        'review': 'bg-yellow-100 text-yellow-700',
        'done': 'bg-green-100 text-green-700'
      }
      return this.task ? classes[this.task.status] || 'bg-gray-100 text-gray-700' : ''
    },

    priorityBadgeClass() {
      const classes = {
        low: 'bg-green-100 text-green-700',
        medium: 'bg-yellow-100 text-yellow-700',
        high: 'bg-orange-100 text-orange-700',
        critical: 'bg-red-100 text-red-700'
      }
      return this.task ? classes[this.task.priority] || 'bg-gray-100 text-gray-700' : ''
    }
  },

  created() {
    this.fetchTask()
  },

  mounted() {
    this.$watch('taskId', (newId, oldId) => {
      if (newId !== oldId) {
        this.fetchTask()
      }
    })
  },

  activated() {
    if (this.task && this.task.id !== this.taskId) {
      this.fetchTask()
    }
  },

  deactivated() {
    this.replyingTo = null
  },

  methods: {
    async fetchTask() {
      this.startLoading('Loading task details...')
      try {
        const task = await api.getTask(this.taskId)
        this.task = task
        this.stopLoading()

        this.loadComments(this.taskId)
      } catch (err) {
        this.setError(err.message || 'An error occurred while loading the task.')
      }
    },

    handleEdit() {
      this.$router.push({ name: 'task-edit', params: { id: this.task.id } })
    },

    handleDelete() {
      this.$emit('task-deleted', this.task)
    },

    startReply(commentId) {
      this.replyingTo = commentId
      this.$nextTick(() => {
        if (this.$refs.commentInput) {
          this.$refs.commentInput.focus()
        }
      })
    }
  }
}
</script>
