<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Back Navigation -->
    <div class="mb-6">
      <button
        class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        @click="goBack"
      >
        <svg class="mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" />
        </svg>
        Back to Tasks
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>

    <template v-else-if="task">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Task Detail Component -->
          <div class="rounded-lg bg-white p-6 shadow">
            <TaskDetail :task="task" />
          </div>

          <!-- Comments Section -->
          <div class="mt-6 rounded-lg bg-white p-6 shadow">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">
                Comments ({{ commentCount }})
              </h2>
              <span v-if="isLoadingComments" class="text-sm text-gray-400">Loading comments...</span>
            </div>

            <!-- Add Comment -->
            <div class="mb-6">
              <textarea
                ref="commentInput"
                v-model="newComment"
                rows="3"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Write a comment..."
              ></textarea>
              <div class="mt-2 flex justify-end">
                <button
                  class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                  :disabled="!newComment.trim()"
                  @click="addComment"
                >
                  Post Comment
                </button>
              </div>
            </div>

            <!-- Comment List -->
            <div v-if="hasComments" class="space-y-4">
              <div
                v-for="comment in formattedComments"
                :key="comment.id"
                class="rounded-md border border-gray-200 p-4"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-gray-900">{{ comment.author }}</span>
                      <span class="text-xs text-gray-500">{{ comment.timeLabel }}</span>
                    </div>

                    <!-- Edit mode -->
                    <div v-if="editingComment === comment.id" class="mt-2">
                      <textarea
                        :value="comment.text"
                        rows="2"
                        class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        @input="e => comment._draft = e.target.value"
                      ></textarea>
                      <div class="mt-1 flex gap-2">
                        <button class="text-xs text-indigo-600" @click="editComment(comment.id, comment._draft || comment.text)">Save</button>
                        <button class="text-xs text-gray-500" @click="editingComment = null">Cancel</button>
                      </div>
                    </div>

                    <!-- Display mode -->
                    <p v-else class="mt-1 text-sm text-gray-700">{{ comment.text }}</p>
                    <span v-if="comment.parentId" class="mt-1 text-xs italic text-gray-400">reply</span>
                  </div>

                  <!-- Actions -->
                  <div class="ml-4 flex gap-2">
                    <button class="text-xs text-gray-400 hover:text-indigo-600" @click="replyToComment(comment.id, 'Quick reply')">Reply</button>
                    <button class="text-xs text-gray-400 hover:text-indigo-600" @click="editingComment = comment.id">Edit</button>
                    <button class="text-xs text-gray-400 hover:text-red-600" @click="deleteComment(comment.id)">Delete</button>
                  </div>
                </div>
              </div>
            </div>

            <p v-else-if="!isLoadingComments && sortedComments.length === 0" class="py-6 text-center text-sm text-gray-500">
              No comments yet. Be the first to comment!
            </p>

            <TaskComments :task-id="task.id" />
          </div>
        </div>

        <!-- Sidebar Metadata -->
        <div class="lg:col-span-1">
          <div class="rounded-lg bg-white p-6 shadow">
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Details</h3>

            <dl class="space-y-4">
              <!-- Status -->
              <div>
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    :class="{
                      'bg-yellow-100 text-yellow-800': task.status === 'todo',
                      'bg-blue-100 text-blue-800': task.status === 'in-progress',
                      'bg-green-100 text-green-800': task.status === 'done',
                      'bg-gray-100 text-gray-800': task.status === 'backlog'
                    }"
                  >
                    {{ task.status }}
                  </span>
                </dd>
              </div>

              <!-- Priority -->
              <div>
                <dt class="text-sm font-medium text-gray-500">Priority</dt>
                <dd class="mt-1">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    :class="{
                      'bg-red-100 text-red-800': task.priority === 'high',
                      'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                      'bg-green-100 text-green-800': task.priority === 'low'
                    }"
                  >
                    {{ task.priority }}
                  </span>
                </dd>
              </div>

              <!-- Assignee -->
              <div>
                <dt class="text-sm font-medium text-gray-500">Assignee</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ task.assignee || 'Unassigned' }}</dd>
              </div>

              <!-- Due Date -->
              <div>
                <dt class="text-sm font-medium text-gray-500">Due Date</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ task.dueDate || 'No due date' }}</dd>
              </div>

              <!-- Project -->
              <div>
                <dt class="text-sm font-medium text-gray-500">Project</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ task.projectName || 'No project' }}</dd>
              </div>

              <!-- Created -->
              <div>
                <dt class="text-sm font-medium text-gray-500">Created</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ task.createdAt || 'Unknown' }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </template>

    <!-- Task Not Found -->
    <div v-else class="py-20 text-center">
      <h2 class="text-2xl font-semibold text-gray-900">Task not found</h2>
      <p class="mt-2 text-gray-500">The task you are looking for does not exist.</p>
      <button
        class="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        @click="goBack"
      >
        Go back to Tasks
      </button>
    </div>
  </div>
</template>

<script>
import TaskDetail from '@/components/tasks/TaskDetail.vue'
import TaskComments from '@/components/tasks/TaskComments.vue'
import { useTasksStore } from '@/stores/tasks'
import loadingMixin from '@/mixins/loadingMixin'
import commentMixin from '@/mixins/commentMixin'

export default {
  name: 'TaskDetailView',

  components: {
    TaskDetail,
    TaskComments
  },

  mixins: [loadingMixin, commentMixin],

  data() {
    return {
      task: null,
      entityId: null
    }
  },

  created() {
    this.loadTask()
  },

  methods: {
    async loadTask() {
      const taskId = this.$route.params.id
      if (!taskId) return

      this.entityId = taskId
      this.startLoading()
      try {
        const taskStore = useTasksStore()
        await taskStore.fetchTaskById(taskId)
        this.task = taskStore.currentTask
        this.loadComments(taskId)
      } catch (error) {
        console.error('Failed to load task:', error)
        this.task = null
      } finally {
        this.stopLoading()
      }
    },

    goBack() {
      this.$router.push({ name: 'tasks' })
    }
  }
}
</script>
