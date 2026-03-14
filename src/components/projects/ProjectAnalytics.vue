<template>
  <!-- Edge case: Three-way external dep overlap. Component imports useSettingsStore directly.
       chartMixin internally uses useSettingsStore. exportMixin also uses useSettingsStore.
       Three independent imports of the same store. -->
  <div class="project-analytics">
    <div class="analytics-header">
      <h2 class="analytics-title">Project Analytics</h2>
      <div class="analytics-actions">
        <select v-model="chartType" class="chart-type-select">
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
        <select v-model="dateRange" class="date-range-select">
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>
    </div>

    <div class="chart-section">
      <div v-if="hasData" class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
      <div v-else class="chart-empty">
        <p>No analytics data available for the selected period</p>
      </div>
    </div>

    <div class="analytics-summary">
      <div class="summary-card" v-for="metric in summaryMetrics" :key="metric.key">
        <span class="metric-label">{{ metric.label }}</span>
        <span class="metric-value">{{ metric.value }}</span>
        <span class="metric-trend" :class="metric.trend > 0 ? 'trend-up' : 'trend-down'">
          {{ metric.trend > 0 ? '+' : '' }}{{ metric.trend }}%
        </span>
      </div>
    </div>

    <div class="export-section">
      <h3>Export Analytics</h3>
      <div class="export-controls">
        <select v-model="exportFormat" class="format-select">
          <option v-for="fmt in availableFormats" :key="fmt" :value="fmt">{{ fmt.toUpperCase() }}</option>
        </select>
        <button
          class="btn-export"
          :disabled="isExporting || !hasData"
          @click="handleExport"
        >
          {{ isExporting ? 'Exporting...' : 'Export Report' }}
        </button>
      </div>
      <div v-if="isExporting" class="export-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: exportProgress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartMixin from '@/mixins/chartMixin'
import exportMixin from '@/mixins/exportMixin'
import { useSettingsStore } from '@/stores/settings'
import { api } from '@/services/api'

export default {
  name: 'ProjectAnalytics',

  mixins: [chartMixin, exportMixin],

  props: {
    projectId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      dateRange: '30d',
      summaryMetrics: [],
      analyticsData: []
    }
  },

  computed: {
    currentLocale() {
      const settingsStore = useSettingsStore()
      return settingsStore.settings.language || 'en'
    }
  },

  watch: {
    dateRange() {
      this.fetchAnalytics()
    }
  },

  async created() {
    await this.fetchAnalytics()
  },

  methods: {
    async fetchAnalytics() {
      try {
        const data = await api.get(`/projects/${this.projectId}/analytics`, {
          range: this.dateRange,
          locale: this.currentLocale
        })
        this.analyticsData = data.chartData || []
        this.summaryMetrics = data.metrics || []
        this.prepareChartData(this.analyticsData)
      } catch (err) {
        console.error('Failed to load analytics:', err)
      }
    },

    handleExport() {
      if (this.exportFormat === 'csv') {
        this.exportToCSV(this.analyticsData)
      } else if (this.exportFormat === 'pdf') {
        this.exportToPDF(this.analyticsData)
      }
    }
  }
}
</script>

<style scoped>
.project-analytics {
  padding: 1.5rem;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.analytics-actions {
  display: flex;
  gap: 0.5rem;
}

.chart-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  min-height: 300px;
}

.analytics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.metric-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.trend-up { color: #059669; }
.trend-down { color: #dc2626; }

.export-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
}

.export-controls {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
</style>
