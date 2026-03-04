<template>
  <div class="bg-white rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Tasks per Project</h2>
    </div>

    <div class="p-6">
      <!-- No Data State -->
      <div
        v-if="!hasData && isChartReady"
        class="text-center text-gray-500 py-8"
      >
        No project data available.
      </div>

      <!-- Chart Area -->
      <div v-else ref="chartCanvas" class="space-y-4">
        <div
          v-for="(item, index) in projectStats"
          :key="item.label || index"
          class="space-y-1"
        >
          <!-- Project Label and Count -->
          <div class="flex justify-between items-center text-sm">
            <span class="font-medium text-gray-700 truncate max-w-[200px]">
              {{ item.label }}
            </span>
            <span class="text-gray-500 font-mono">
              {{ item.value }}
            </span>
          </div>

          <!-- Bar -->
          <div class="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
            <div
              class="h-6 rounded-full transition-all duration-500 ease-out flex items-center pl-2"
              :style="{ width: getBarWidth(item.value) + '%', backgroundColor: getBarColor(index) }"
            >
              <span
                v-if="getBarWidth(item.value) > 15"
                class="text-xs text-white font-medium"
              >
                {{ item.value }} tasks
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartMixin from '@/mixins/chartMixin'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'

export default {
  name: 'ProjectSummaryChart',

  mixins: [chartMixin],

  data() {
    return {
      projectStats: []
    }
  },

  mounted() {
    this.loadAndPrepareChart()
  },

  methods: {
    async loadAndPrepareChart() {
      const projectsStore = useProjectsStore()
      const tasksStore = useTasksStore()

      await Promise.all([
        projectsStore.fetchProjects(),
        tasksStore.fetchTasks()
      ])

      const taskCountByProject = {}
      tasksStore.tasks.forEach((task) => {
        const pid = task.projectId
        if (!taskCountByProject[pid]) {
          taskCountByProject[pid] = 0
        }
        taskCountByProject[pid]++
      })

      const raw = projectsStore.projects.map((project) => ({
        name: project.name,
        value: taskCountByProject[project.id] || 0
      }))

      this.prepareChartData(raw)

      this.projectStats = this.chartData || []

      // Use this.$refs.chartCanvas and this.$el.offsetWidth
      this.$nextTick(() => {
        if (this.$refs.chartCanvas) {
          const containerWidth = this.$el.offsetWidth
          this.$refs.chartCanvas.style.maxWidth = containerWidth + 'px'
        }
        this.isChartReady = true
      })
    },

    getBarWidth(value) {
      if (!this.projectStats.length) return 0
      const max = Math.max(...this.projectStats.map((s) => s.value), 1)
      return Math.round((value / max) * 100)
    },

    getBarColor(index) {
      return this.chartColors[index % this.chartColors.length]
    }
  }
}
</script>
