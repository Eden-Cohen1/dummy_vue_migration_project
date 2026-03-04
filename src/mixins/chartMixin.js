export default {
  data() {
    return {
      chartData: null,
      chartOptions: {},
      chartType: 'bar',
      isChartReady: false
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

    updateChart() {
      this.prepareChartData(this.chartData || [])
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
    this.resizeChart()
  },

  beforeUnmount() {
    this.isChartReady = false
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
