import { ref, computed } from 'vue'

export function useChart() {
  const chartData = ref(null)
  const chartOptions = ref({})
  const chartType = ref('bar')
  const isChartReady = ref(false)

  const formattedChartData = computed(() => {
    if (!chartData.value) return null
    return {
      labels: chartData.value.labels || [],
      datasets: chartData.value.datasets || []
    }
  })

  const chartColors = computed(() => {
    return chartOptions.value.colors || ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0']
  })

  const hasData = computed(() => chartData.value !== null)

  function prepareChartData(raw) {
    if (!raw) return
    chartData.value = {
      labels: raw.labels || [],
      datasets: (raw.datasets || []).map((ds, i) => ({
        ...ds,
        backgroundColor: chartColors.value[i % chartColors.value.length]
      }))
    }
    isChartReady.value = true
  }

  function updateChart() {
    if (chartData.value) {
      isChartReady.value = false
      // Trigger re-render
      isChartReady.value = true
    }
  }

  function resizeChart() {
    // Handle chart resize logic
    updateChart()
  }

  function exportChart(format) {
    if (!isChartReady.value) return null
    return {
      type: chartType.value,
      format: format || 'png',
      data: formattedChartData.value
    }
  }

  return {
    chartData,
    chartOptions,
    chartType,
    isChartReady,
    formattedChartData,
    chartColors,
    hasData,
    prepareChartData,
    updateChart,
    resizeChart,
    exportChart
  }
}
