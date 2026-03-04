<template>
  <div class="bg-white rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Task Distribution</h2>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-6">
      <div class="animate-pulse space-y-4">
        <div class="h-8 bg-gray-200 rounded w-full"></div>
        <div class="grid grid-cols-2 gap-4">
          <div class="h-20 bg-gray-200 rounded"></div>
          <div class="h-20 bg-gray-200 rounded"></div>
          <div class="h-20 bg-gray-200 rounded"></div>
          <div class="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="p-6 text-center">
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button
        v-if="canRetry"
        class="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
        @click="retry(loadDistribution)"
      >
        Retry
      </button>
    </div>

    <div v-else class="p-6">
      <!-- Pie-chart-like Segmented Bar -->
      <div class="mb-6">
        <div class="w-full h-8 rounded-full overflow-hidden flex" ref="chartCanvas">
          <div
            v-for="segment in segments"
            :key="segment.status"
            class="h-full transition-all duration-500 ease-out"
            :style="{ width: segment.percentage + '%', backgroundColor: segment.color }"
            :title="segment.label + ': ' + segment.count + ' (' + segment.percentage + '%)'"
          ></div>
        </div>
      </div>

      <!-- Legend & Stats Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="segment in segments"
          :key="'stat-' + segment.status"
          class="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div
            class="w-4 h-4 rounded-full mr-3 flex-shrink-0"
            :style="{ backgroundColor: segment.color }"
          ></div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ segment.label }}</p>
            <p class="text-xs text-gray-500">
              {{ segment.count }} tasks ({{ segment.percentage }}%)
            </p>
          </div>
        </div>
      </div>

      <!-- Total -->
      <div class="mt-4 pt-4 border-t border-gray-100 text-center">
        <p class="text-sm text-gray-500">
          Total: <span class="font-semibold text-gray-900">{{ totalTasks }}</span> tasks
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import chartMixin from '@/mixins/chartMixin'
import loadingMixin from '@/mixins/loadingMixin'
import { useTasksStore } from '@/stores/tasks'

export default {
  name: 'TaskDistribution',

  mixins: [chartMixin, loadingMixin],

  data() {
    return {
      distribution: {
        todo: 0,
        'in-progress': 0,
        review: 0,
        done: 0
      }
    }
  },

  computed: {
    totalTasks() {
      return Object.values(this.distribution).reduce((sum, count) => sum + count, 0)
    },

    segments() {
      const statusConfig = {
        todo: { label: 'To Do', color: '#6B7280' },
        'in-progress': { label: 'In Progress', color: '#3B82F6' },
        review: { label: 'In Review', color: '#F59E0B' },
        done: { label: 'Done', color: '#10B981' }
      }

      return Object.entries(this.distribution).map(([status, count]) => {
        const config = statusConfig[status] || { label: status, color: '#9CA3AF' }
        return {
          status,
          label: config.label,
          color: config.color,
          count,
          percentage: this.totalTasks > 0
            ? Math.round((count / this.totalTasks) * 100)
            : 0
        }
      })
    }
  },

  created() {
    this.loadDistribution()
  },

  methods: {
    async loadDistribution() {
      this.startLoading('Loading task distribution...')
      try {
        const tasksStore = useTasksStore()
        await tasksStore.fetchTasks()

        const tasksByStatus = tasksStore.tasksByStatus
        this.distribution = {
          todo: (tasksByStatus['todo'] || []).length,
          'in-progress': (tasksByStatus['in-progress'] || []).length,
          review: (tasksByStatus['review'] || []).length,
          done: (tasksByStatus['done'] || []).length
        }

        this.$nextTick(() => {
          this.prepareChartData(
            this.segments.map((s) => ({ name: s.label, value: s.count }))
          )
        })

        this.stopLoading()
      } catch (err) {
        this.setError(err.message || 'Failed to load task distribution')
      }
    }
  }
}
</script>
