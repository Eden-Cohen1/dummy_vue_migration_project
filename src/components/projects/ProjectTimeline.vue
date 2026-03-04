<template>
  <div class="bg-white rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">Project Timeline</h2>
      <div v-if="hasData" class="text-sm text-gray-500">
        {{ timelineItems.length }} task{{ timelineItems.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-6 space-y-4">
      <div
        v-for="n in 4"
        :key="'skeleton-' + n"
        class="animate-pulse"
      >
        <div class="flex items-center space-x-4">
          <div class="h-3 w-3 bg-gray-200 rounded-full"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div class="h-8 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="p-6 text-center">
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button
        v-if="canRetry"
        class="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
        @click="retry(loadTimeline)"
      >
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="timelineItems.length === 0"
      class="p-6 text-center text-gray-500"
    >
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-sm">No timeline items to display.</p>
    </div>

    <!-- Timeline / Gantt-like Display -->
    <div v-else class="p-6">
      <!-- Timeline Header (date range) -->
      <div class="flex items-center justify-between text-xs text-gray-400 mb-4 px-2">
        <span>{{ timelineStartLabel }}</span>
        <span>{{ timelineMidLabel }}</span>
        <span>{{ timelineEndLabel }}</span>
      </div>

      <!-- Timeline Items -->
      <div ref="chartCanvas" class="space-y-3">
        <div
          v-for="item in timelineItems"
          :key="item.id"
          class="group"
        >
          <!-- Task Label Row -->
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium text-gray-700 truncate max-w-[200px]">
              {{ item.title }}
            </span>
            <div class="flex items-center space-x-2 text-xs text-gray-500">
              <span
                class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
                :class="getStatusClass(item.status)"
              >
                {{ item.status }}
              </span>
              <span>{{ formatItemDates(item) }}</span>
            </div>
          </div>

          <!-- Gantt Bar -->
          <div class="w-full bg-gray-100 rounded h-6 relative overflow-hidden">
            <div
              class="absolute h-6 rounded transition-all duration-300 flex items-center px-2 group-hover:opacity-90"
              :style="getBarStyle(item)"
              :title="item.title + ': ' + formatItemDates(item)"
            >
              <span
                v-if="getBarWidthPercent(item) > 20"
                class="text-xs text-white font-medium truncate"
              >
                {{ item.title }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
        <div
          v-for="statusItem in statusLegend"
          :key="statusItem.status"
          class="flex items-center text-xs text-gray-600"
        >
          <div
            class="w-3 h-3 rounded mr-1.5"
            :style="{ backgroundColor: statusItem.color }"
          ></div>
          <span>{{ statusItem.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'
import chartMixin from '@/mixins/chartMixin'
import { useTasksStore } from '@/stores/tasks'

export default {
  name: 'ProjectTimeline',

  mixins: [loadingMixin, chartMixin],

  props: {
    projectId: {
      type: [String, Number],
      default: null
    }
  },

  data() {
    return {
      timelineItems: []
    }
  },

  computed: {
    timelineRange() {
      if (this.timelineItems.length === 0) {
        const now = new Date()
        return { start: now, end: new Date(now.getTime() + 30 * 86400000) }
      }

      const starts = this.timelineItems
        .map((item) => new Date(item.startDate || item.createdAt).getTime())
        .filter((d) => !isNaN(d))
      const ends = this.timelineItems
        .map((item) => new Date(item.dueDate || item.endDate || item.createdAt).getTime())
        .filter((d) => !isNaN(d))

      const earliest = Math.min(...starts, ...ends)
      const latest = Math.max(...starts, ...ends)

      // Add some padding
      const padding = (latest - earliest) * 0.05 || 86400000
      return {
        start: new Date(earliest - padding),
        end: new Date(latest + padding)
      }
    },

    timelineDuration() {
      return this.timelineRange.end.getTime() - this.timelineRange.start.getTime()
    },

    timelineStartLabel() {
      return this.formatShortDate(this.timelineRange.start)
    },

    timelineMidLabel() {
      const mid = new Date(
        (this.timelineRange.start.getTime() + this.timelineRange.end.getTime()) / 2
      )
      return this.formatShortDate(mid)
    },

    timelineEndLabel() {
      return this.formatShortDate(this.timelineRange.end)
    },

    statusLegend() {
      return [
        { status: 'todo', label: 'To Do', color: '#6B7280' },
        { status: 'in-progress', label: 'In Progress', color: '#3B82F6' },
        { status: 'review', label: 'Review', color: '#F59E0B' },
        { status: 'done', label: 'Done', color: '#10B981' }
      ]
    }
  },

  created() {
    this.loadTimeline()
  },

  methods: {
    async loadTimeline() {
      this.startLoading('Loading project timeline...')
      try {
        const tasksStore = useTasksStore()
        await tasksStore.fetchTasks(this.projectId)

        this.timelineItems = tasksStore.tasks
          .filter((task) => task.startDate || task.createdAt)
          .sort((a, b) => {
            const dateA = new Date(a.startDate || a.createdAt)
            const dateB = new Date(b.startDate || b.createdAt)
            return dateA - dateB
          })

        this.prepareChartData(
          this.timelineItems.map((item) => ({
            name: item.title,
            value: this.getItemDurationDays(item)
          }))
        )

        this.$nextTick(() => {
          // Use this.$el.querySelector for DOM measurement
          const container = this.$el.querySelector('.space-y-3')
          if (container) {
            const containerWidth = container.offsetWidth
            if (this.$refs.chartCanvas) {
              this.$refs.chartCanvas.style.maxWidth = containerWidth + 'px'
            }
          }
        })

        this.stopLoading()
      } catch (err) {
        this.setError(err.message || 'Failed to load timeline')
      }
    },

    getBarStyle(item) {
      const start = new Date(item.startDate || item.createdAt).getTime()
      const end = new Date(item.dueDate || item.endDate || start + 7 * 86400000).getTime()

      const rangeStart = this.timelineRange.start.getTime()
      const totalDuration = this.timelineDuration || 1

      const leftPercent = Math.max(0, ((start - rangeStart) / totalDuration) * 100)
      const widthPercent = Math.max(2, ((end - start) / totalDuration) * 100)

      return {
        left: leftPercent + '%',
        width: Math.min(widthPercent, 100 - leftPercent) + '%',
        backgroundColor: this.getStatusBarColor(item.status)
      }
    },

    getBarWidthPercent(item) {
      const start = new Date(item.startDate || item.createdAt).getTime()
      const end = new Date(item.dueDate || item.endDate || start + 7 * 86400000).getTime()
      const totalDuration = this.timelineDuration || 1
      return ((end - start) / totalDuration) * 100
    },

    getStatusBarColor(status) {
      const colors = {
        todo: '#6B7280',
        'in-progress': '#3B82F6',
        review: '#F59E0B',
        done: '#10B981'
      }
      return colors[status] || '#9CA3AF'
    },

    getStatusClass(status) {
      const classes = {
        todo: 'bg-gray-100 text-gray-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        review: 'bg-yellow-100 text-yellow-800',
        done: 'bg-green-100 text-green-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getItemDurationDays(item) {
      const start = new Date(item.startDate || item.createdAt).getTime()
      const end = new Date(item.dueDate || item.endDate || start + 7 * 86400000).getTime()
      return Math.max(1, Math.ceil((end - start) / 86400000))
    },

    formatItemDates(item) {
      const start = this.formatShortDate(new Date(item.startDate || item.createdAt))
      const end = item.dueDate || item.endDate
        ? this.formatShortDate(new Date(item.dueDate || item.endDate))
        : 'TBD'
      return start + ' - ' + end
    },

    formatShortDate(date) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const d = new Date(date)
      return months[d.getMonth()] + ' ' + d.getDate()
    }
  }
}
</script>
