import { useTasksStore } from '@/stores/tasks'
import { useSettingsStore } from '@/stores/settings'
import { debounce } from '@/utils/helpers'

export default {
  data() {
    return {
      chartData: null,
      chartOptions: {},
      chartType: 'bar',
      isChartReady: false,
      _debouncedResize: null
    }
  },

  computed: {
    formattedChartData() {
      if (!this.chartData || this.chartData.length === 0) {
        return { labels: [], datasets: [] }
      }
      return {
        labels: this.chartData.map(d => d.label),
        datasets: [{
          data: this.chartData.map(d => d.value),
          backgroundColor: this.chartColors
        }]
      }
    },

    chartColors() {
      const settingsStore = useSettingsStore()
      const isDark = settingsStore.theme === 'dark'
      if (isDark) {
        return [
          '#66BB6A',
          '#42A5F5',
          '#FFA726',
          '#EF5350',
          '#AB47BC',
          '#26C6DA',
          '#FFEE58',
          '#8D6E63'
        ]
      }
      return [
        '#4CAF50',
        '#2196F3',
        '#FF9800',
        '#F44336',
        '#9C27B0',
        '#00BCD4',
        '#FFEB3B',
        '#795548'
      ]
    },

    hasData() {
      return !!this.chartData && this.chartData.length > 0
    }
  },

  methods: {
    prepareChartData(raw) {
      this.chartData = raw.map(item => ({
        label: item.name || item.label,
        value: item.value || item.count || 0
      }))
    },

    async loadTaskChartData(projectId) {
      const tasksStore = useTasksStore()
      await tasksStore.fetchTasks(projectId)
      const byStatus = tasksStore.tasksByStatus
      const raw = Object.entries(byStatus).map(([status, tasks]) => ({
        label: status,
        value: tasks.length
      }))
      this.prepareChartData(raw)
    },

    updateChart() {
      this.isChartReady = true
      this.$nextTick(() => {
        // Chart DOM updated
      })
    },

    resizeChart() {
      const width = this.$el.offsetWidth
      if (this.$refs.chartCanvas) {
        this.$refs.chartCanvas.width = width
        this.$refs.chartCanvas.height = width * 0.6
      }
    },

    exportChart(format) {
      const canvas = this.$refs.chartCanvas
      if (!canvas) return null

      if (format === 'png') {
        return canvas.toDataURL('image/png')
      } else if (format === 'jpg') {
        return canvas.toDataURL('image/jpeg')
      }
      return null
    }
  },

  mounted() {
    this._debouncedResize = debounce(this.resizeChart, 150)
    window.addEventListener('resize', this._debouncedResize)
    this.resizeChart()
  },

  beforeUnmount() {
    this.isChartReady = false
    if (this._debouncedResize) {
      window.removeEventListener('resize', this._debouncedResize)
    }
  },

  watch: {
    chartData: {
      deep: true,
      handler() {
        this.updateChart()
      }
    }
  }
}
