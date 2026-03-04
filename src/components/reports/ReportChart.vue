<template>
  <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
    <!-- Chart Header -->
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800">Chart</h3>
      <div class="flex items-center gap-2">
        <button
          v-for="chartOption in chartOptions"
          :key="chartOption"
          @click="currentType = chartOption"
          :class="[
            'px-3 py-1 rounded-md text-xs font-medium transition-colors',
            currentType === chartOption
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ chartOption }}
        </button>
      </div>
    </div>

    <!-- Chart Body -->
    <div ref="chartCanvas" class="p-6">
      <!-- Empty State -->
      <div v-if="!hasChartData" class="flex flex-col items-center justify-center py-16 text-gray-400">
        <svg class="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="text-sm">No chart data available</p>
      </div>

      <!-- Bar Chart -->
      <div v-else-if="currentType === 'bar'" class="space-y-4">
        <div class="flex items-end gap-3 justify-center min-h-[280px] pt-8">
          <div
            v-for="(item, index) in normalizedData"
            :key="index"
            class="flex flex-col items-center gap-2 flex-1 max-w-[80px]"
          >
            <span class="text-xs font-semibold text-gray-700">{{ item.value }}</span>
            <div
              :style="{
                height: item.heightPercent + '%',
                backgroundColor: chartColors[index % chartColors.length],
                minHeight: '4px'
              }"
              class="w-full rounded-t-lg transition-all duration-500 ease-out relative group"
              style="max-height: 220px"
            >
              <!-- Tooltip -->
              <div class="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                {{ item.label }}: {{ item.value }}
              </div>
            </div>
            <span class="text-xs text-gray-600 text-center truncate w-full">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- Pie Chart (CSS-based) -->
      <div v-else-if="currentType === 'pie'" class="flex items-center justify-center gap-8 min-h-[280px]">
        <div class="relative w-48 h-48">
          <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
            <circle
              v-for="(segment, index) in pieSegments"
              :key="index"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              :stroke="chartColors[index % chartColors.length]"
              stroke-width="20"
              :stroke-dasharray="segment.dashArray"
              :stroke-dashoffset="segment.dashOffset"
              class="transition-all duration-500"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-sm font-semibold text-gray-700">{{ totalValue }}</span>
          </div>
        </div>
        <!-- Legend -->
        <div class="space-y-2">
          <div
            v-for="(item, index) in data"
            :key="index"
            class="flex items-center gap-2"
          >
            <span
              :style="{ backgroundColor: chartColors[index % chartColors.length] }"
              class="w-3 h-3 rounded-sm flex-shrink-0"
            ></span>
            <span class="text-xs text-gray-700">{{ item.label || item.name }}</span>
            <span class="text-xs text-gray-400 ml-auto">{{ getPercentage(item) }}%</span>
          </div>
        </div>
      </div>

      <!-- Line Chart (CSS-based) -->
      <div v-else-if="currentType === 'line'" class="min-h-[280px] pt-4">
        <svg :viewBox="'0 0 ' + chartWidth + ' 260'" class="w-full h-auto">
          <!-- Grid lines -->
          <line
            v-for="i in 5"
            :key="'grid-' + i"
            x1="40"
            :y1="(i - 1) * 50 + 20"
            :x2="chartWidth - 20"
            :y2="(i - 1) * 50 + 20"
            stroke="#E5E7EB"
            stroke-width="1"
            stroke-dasharray="4 4"
          />
          <!-- Y-axis labels -->
          <text
            v-for="i in 5"
            :key="'ylabel-' + i"
            x="35"
            :y="(i - 1) * 50 + 24"
            text-anchor="end"
            class="fill-gray-400"
            font-size="10"
          >
            {{ Math.round(maxValue - ((i - 1) / 4) * maxValue) }}
          </text>
          <!-- Line path -->
          <polyline
            v-if="linePoints.length > 0"
            :points="linePoints.map(p => p.x + ',' + p.y).join(' ')"
            fill="none"
            stroke="#3B82F6"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <!-- Data points -->
          <circle
            v-for="(point, index) in linePoints"
            :key="'point-' + index"
            :cx="point.x"
            :cy="point.y"
            r="4"
            fill="white"
            stroke="#3B82F6"
            stroke-width="2.5"
          />
          <!-- X-axis labels -->
          <text
            v-for="(point, index) in linePoints"
            :key="'xlabel-' + index"
            :x="point.x"
            y="255"
            text-anchor="middle"
            class="fill-gray-500"
            font-size="10"
          >
            {{ data[index] ? (data[index].label || data[index].name || '') : '' }}
          </text>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import chartMixin from '@/mixins/chartMixin'

export default {
  name: 'ReportChart',

  mixins: [chartMixin],

  props: {
    data: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'bar',
      validator: (value) => ['bar', 'pie', 'line'].includes(value)
    }
  },

  data() {
    return {
      currentType: this.type,
      chartWidth: 600,
      chartOptions: ['bar', 'pie', 'line']
    }
  },

  computed: {
    hasChartData() {
      return this.data && this.data.length > 0
    },

    maxValue() {
      if (!this.hasChartData) return 0
      return Math.max(...this.data.map(d => d.value || d.count || 0))
    },

    totalValue() {
      if (!this.hasChartData) return 0
      return this.data.reduce((sum, d) => sum + (d.value || d.count || 0), 0)
    },

    normalizedData() {
      if (!this.hasChartData) return []
      return this.data.map(item => {
        const value = item.value || item.count || 0
        return {
          label: item.label || item.name || '',
          value: value,
          heightPercent: this.maxValue > 0 ? (value / this.maxValue) * 100 : 0
        }
      })
    },

    pieSegments() {
      if (!this.hasChartData || this.totalValue === 0) return []
      const circumference = 2 * Math.PI * 40
      let accumulatedOffset = 0
      return this.data.map(item => {
        const value = item.value || item.count || 0
        const proportion = value / this.totalValue
        const dashLength = proportion * circumference
        const segment = {
          dashArray: `${dashLength} ${circumference - dashLength}`,
          dashOffset: -accumulatedOffset
        }
        accumulatedOffset += dashLength
        return segment
      })
    },

    linePoints() {
      if (!this.hasChartData) return []
      const paddingLeft = 50
      const paddingRight = 30
      const usableWidth = this.chartWidth - paddingLeft - paddingRight
      const step = this.data.length > 1 ? usableWidth / (this.data.length - 1) : 0

      return this.data.map((item, index) => {
        const value = item.value || item.count || 0
        const x = paddingLeft + (index * step)
        const y = this.maxValue > 0
          ? 220 - ((value / this.maxValue) * 200) + 20
          : 120
        return { x, y }
      })
    }
  },

  watch: {
    type(newType) {
      this.currentType = newType
    },

    data: {
      immediate: true,
      handler(newData) {
        if (newData && newData.length > 0) {
          this.prepareChartData(newData)
        }
      }
    }
  },

  methods: {
    getPercentage(item) {
      if (this.totalValue === 0) return 0
      const value = item.value || item.count || 0
      return Math.round((value / this.totalValue) * 100)
    },

    handleResize() {
      this.chartWidth = this.$el.offsetWidth || 600
      this.resizeChart()
    }
  },

  mounted() {
    this.resizeChart()
    this.chartWidth = this.$el.offsetWidth || 600
    this._resizeHandler = this.handleResize.bind(this)
    window.addEventListener('resize', this._resizeHandler)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this._resizeHandler)
  }
}
</script>
