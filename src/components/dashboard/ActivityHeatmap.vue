<template>
  <div class="activity-heatmap">
    <h3 class="heatmap-title">Activity Heatmap</h3>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading activity data...</p>
    </div>

    <template v-else>
      <!-- Month Labels -->
      <div class="month-labels">
        <span v-for="month in monthLabels" :key="month" class="month-label">{{ month }}</span>
      </div>

      <!-- Heatmap Grid -->
      <div class="heatmap-container">
        <!-- Day-of-week Labels -->
        <div class="day-labels">
          <span class="day-label">Mon</span>
          <span class="day-label">Wed</span>
          <span class="day-label">Fri</span>
        </div>

        <!-- Grid Cells -->
        <div class="heatmap-grid">
          <div
            v-for="(cell, idx) in heatmapCells"
            :key="idx"
            :class="['heatmap-cell', 'level-' + cell.level]"
            :title="cell.date + ': ' + cell.count + ' activities'"
            @mouseenter="hoveredCell = cell"
            @mouseleave="hoveredCell = null"
          ></div>
        </div>
      </div>

      <!-- Tooltip -->
      <div v-if="hoveredCell" class="heatmap-tooltip">
        <strong>{{ hoveredCell.date }}</strong>: {{ hoveredCell.count }} activities
      </div>

      <!-- Legend -->
      <div class="heatmap-legend">
        <span class="legend-label">Less</span>
        <div class="legend-cell level-0"></div>
        <div class="legend-cell level-1"></div>
        <div class="legend-cell level-2"></div>
        <div class="legend-cell level-3"></div>
        <div class="legend-cell level-4"></div>
        <span class="legend-label">More</span>
      </div>
    </template>
  </div>
</template>

<script>
import chartMixin from '@/mixins/chartMixin'
import loadingMixin from '@/mixins/loadingMixin'
import pollingMixin from '@/mixins/pollingMixin'

export default {
  name: 'ActivityHeatmap',

  mixins: [chartMixin, loadingMixin, pollingMixin],

  data() {
    return {
      hoveredCell: null,
      monthLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      heatmapCells: []
    }
  },

  created() {
    this.generateHeatmapData()
  },

  methods: {
    generateHeatmapData() {
      this.startLoading('Loading heatmap...')
      const cells = []
      for (let i = 0; i < 365; i++) {
        const d = new Date()
        d.setDate(d.getDate() - (364 - i))
        const count = Math.floor(Math.random() * 12)
        cells.push({
          date: d.toISOString().slice(0, 10),
          count,
          level: count === 0 ? 0 : Math.min(4, Math.ceil(count / 3))
        })
      }
      this.heatmapCells = cells
      this.stopLoading()
    }
  }
}
</script>

<style scoped>
.activity-heatmap { padding: 1rem; background: white; border-radius: 8px; border: 1px solid #e5e7eb; }
.heatmap-title { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; }
.month-labels { display: flex; gap: 2.5rem; margin-bottom: 0.25rem; padding-left: 2rem; }
.month-label { font-size: 0.7rem; color: #9ca3af; }
.heatmap-container { display: flex; gap: 0.25rem; }
.day-labels { display: flex; flex-direction: column; justify-content: space-between; padding: 0.25rem 0; }
.day-label { font-size: 0.65rem; color: #9ca3af; }
.heatmap-grid {
  display: grid; grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column; gap: 2px;
}
.heatmap-cell { width: 11px; height: 11px; border-radius: 2px; }
.level-0 { background: #ebedf0; }
.level-1 { background: #9be9a8; }
.level-2 { background: #40c463; }
.level-3 { background: #30a14e; }
.level-4 { background: #216e39; }
.heatmap-tooltip {
  margin-top: 0.5rem; font-size: 0.8rem; color: #374151;
  padding: 0.5rem; background: #f9fafb; border-radius: 6px;
}
.heatmap-legend { display: flex; align-items: center; gap: 3px; margin-top: 0.75rem; }
.legend-label { font-size: 0.65rem; color: #9ca3af; margin: 0 0.25rem; }
.legend-cell { width: 11px; height: 11px; border-radius: 2px; }
.loading-state { text-align: center; padding: 2rem; color: #6b7280; }
.spinner {
  width: 2rem; height: 2rem; margin: 0 auto 0.5rem;
  border: 3px solid #e5e7eb; border-top-color: #3b82f6;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
