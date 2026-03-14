<!-- TaskDependencyGraph.vue
  Mixins used:
  - loadingMixin: Provides isLoading, startLoading/stopLoading for async chart data fetching
  - chartMixin: Provides chartInstance, renderChart, destroyChart for dependency graph visualization
  This component renders an interactive dependency graph showing how tasks
  relate to and depend on each other, with controls for zoom and layout.
-->
<template>
  <div class="task-dependency-graph">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Dependency Graph</h3>
      <div class="flex items-center space-x-2">
        <button
          @click="zoomIn"
          class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
          title="Zoom In"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m6-6H6" />
          </svg>
        </button>
        <button
          @click="zoomOut"
          class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
          title="Zoom Out"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
          </svg>
        </button>
        <button
          @click="resetView"
          class="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="relative">
      <div class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
        <div class="text-center">
          <svg class="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p class="text-sm text-gray-500">{{ loadingMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Chart container -->
    <div ref="chartContainer" class="chart-area border border-gray-200 rounded-lg bg-gray-50 min-h-[400px]"></div>

    <!-- Legend -->
    <div class="mt-4 flex items-center space-x-6 text-xs text-gray-500">
      <div class="flex items-center space-x-1">
        <span class="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
        <span>Completed</span>
      </div>
      <div class="flex items-center space-x-1">
        <span class="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
        <span>In Progress</span>
      </div>
      <div class="flex items-center space-x-1">
        <span class="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
        <span>Blocked</span>
      </div>
      <div class="flex items-center space-x-1">
        <span class="w-3 h-3 rounded-full bg-gray-400 inline-block"></span>
        <span>Pending</span>
      </div>
    </div>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'
import chartMixin from '@/mixins/chartMixin'

export default {
  name: 'TaskDependencyGraph',

  mixins: [loadingMixin, chartMixin],

  props: {
    taskId: {
      type: [String, Number],
      required: true
    },
    dependencies: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      zoomLevel: 1,
      graphData: null
    }
  },

  mounted() {
    this.loadGraph()
  },

  beforeDestroy() {
    this.destroyChart()
  },

  methods: {
    async loadGraph() {
      this.startLoading('Building dependency graph...')
      this.graphData = this.buildGraphData(this.dependencies)
      this.renderChart(this.$refs.chartContainer, {
        type: 'network',
        data: this.graphData
      })
      this.stopLoading()
    },

    buildGraphData(deps) {
      return {
        nodes: deps.map(d => ({ id: d.id, label: d.name, status: d.status })),
        edges: deps.flatMap(d => (d.dependsOn || []).map(depId => ({ from: depId, to: d.id })))
      }
    },

    zoomIn() {
      this.zoomLevel = Math.min(this.zoomLevel + 0.2, 3)
    },

    zoomOut() {
      this.zoomLevel = Math.max(this.zoomLevel - 0.2, 0.5)
    },

    resetView() {
      this.zoomLevel = 1
    }
  }
}
</script>

<style scoped>
.task-dependency-graph {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
.chart-area {
  transition: transform 0.2s ease;
}
</style>
