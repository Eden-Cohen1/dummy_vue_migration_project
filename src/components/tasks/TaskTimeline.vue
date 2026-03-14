<!-- TaskTimeline.vue
  Mixins used:
  - loadingMixin: Provides isLoading, loadingMessage, startLoading/stopLoading for async data fetching
  - commentMixin: Provides comments array, addComment, editComment, sortedComments for timeline events
  This component displays a chronological activity timeline for a task, combining
  comments and system events into a unified vertical timeline view.
-->
<template>
  <div class="task-timeline">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <svg class="animate-spin h-6 w-6 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      <span class="text-sm text-gray-500">{{ loadingMessage }}</span>
    </div>

    <template v-else>
      <!-- Timeline events -->
      <div class="relative border-l-2 border-gray-200 ml-4 space-y-6">
        <div
          v-for="event in timelineEvents"
          :key="event.id"
          class="relative pl-8"
        >
          <span
            class="absolute -left-2 w-4 h-4 rounded-full border-2 border-white"
            :class="eventDotClass(event.type)"
          ></span>
          <div class="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium text-gray-900">{{ event.author }}</span>
              <span class="text-xs text-gray-400">{{ event.createdAt }}</span>
            </div>
            <p class="text-sm text-gray-600">{{ event.text }}</p>
            <span
              class="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
              :class="eventBadgeClass(event.type)"
            >
              {{ event.type }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="timelineEvents.length === 0" class="text-center py-8">
        <p class="text-sm text-gray-400">No activity yet</p>
      </div>

      <!-- Add comment form -->
      <div class="mt-6 border-t border-gray-100 pt-4">
        <textarea
          v-model="newComment"
          rows="2"
          placeholder="Add a comment to the timeline..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
        ></textarea>
        <button
          @click="handleAddEvent"
          :disabled="!newComment.trim()"
          :class="[
            'mt-2 px-4 py-1.5 text-sm font-medium text-white rounded-lg transition-colors',
            newComment.trim() ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
          ]"
        >
          Add to Timeline
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'
import commentMixin from '@/mixins/commentMixin'

export default {
  name: 'TaskTimeline',

  mixins: [loadingMixin, commentMixin],

  props: {
    taskId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      systemEvents: []
    }
  },

  computed: {
    timelineEvents() {
      const all = [
        ...this.sortedComments.map(c => ({ ...c, type: 'comment' })),
        ...this.systemEvents
      ]
      return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  },

  mounted() {
    this.loadTimeline()
  },

  methods: {
    async loadTimeline() {
      this.startLoading('Loading timeline...')
      await this.loadComments(this.taskId)
      this.stopLoading()
    },

    handleAddEvent() {
      this.addComment()
      this.$emit('timeline-updated')
    },

    eventDotClass(type) {
      const map = {
        comment: 'bg-indigo-500',
        status_change: 'bg-yellow-500',
        assignment: 'bg-green-500'
      }
      return map[type] || 'bg-gray-400'
    },

    eventBadgeClass(type) {
      const map = {
        comment: 'bg-indigo-100 text-indigo-700',
        status_change: 'bg-yellow-100 text-yellow-700',
        assignment: 'bg-green-100 text-green-700'
      }
      return map[type] || 'bg-gray-100 text-gray-700'
    }
  }
}
</script>

<style scoped>
.task-timeline {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
