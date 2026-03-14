<!-- ReportComparison.vue
  Mixins used:
  - diffMixin: Provides computeDiff, diffResult, hasDifferences, diffSummary for comparing reports
  - loadingMixin: Provides isLoading, startLoading/stopLoading for fetching report data
  This component enables side-by-side comparison of two reports, highlighting
  differences with color-coded indicators and providing merge/accept controls.
-->
<template>
  <div class="report-comparison">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Report Comparison</h3>
      <div class="flex items-center space-x-3">
        <span v-if="hasDifferences" class="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
          {{ diffSummary }}
        </span>
        <button
          @click="runComparison"
          class="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Compare
        </button>
      </div>
    </div>

    <!-- Report selectors -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Left Report</label>
        <select v-model="leftReportId" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="">Select report...</option>
          <option v-for="r in reports" :key="r.id" :value="r.id">{{ r.name }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Right Report</label>
        <select v-model="rightReportId" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="">Select report...</option>
          <option v-for="r in reports" :key="r.id" :value="r.id">{{ r.name }}</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <svg class="animate-spin h-6 w-6 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      <span class="text-sm text-gray-500">{{ loadingMessage }}</span>
    </div>

    <!-- Diff results -->
    <div v-else-if="hasDifferences" class="space-y-2">
      <div
        v-for="(diff, key) in diffResult"
        :key="key"
        :class="[
          'grid grid-cols-2 gap-4 p-3 rounded-lg border',
          diffRowClass(diff.type)
        ]"
      >
        <div class="text-sm">
          <span class="text-xs font-medium text-gray-500 block mb-0.5">{{ key }}</span>
          <span class="text-gray-900">{{ diff.type === 'added' ? '—' : (diff.value || diff.from) }}</span>
        </div>
        <div class="text-sm flex items-start justify-between">
          <div>
            <span class="text-xs font-medium text-gray-500 block mb-0.5">{{ key }}</span>
            <span class="text-gray-900">{{ diff.type === 'removed' ? '—' : (diff.value || diff.to) }}</span>
          </div>
          <div class="flex items-center space-x-1 flex-shrink-0 ml-2">
            <span :class="['text-xs px-1.5 py-0.5 rounded', changeIndicatorClass(diff.type)]">{{ diff.type }}</span>
          </div>
        </div>
      </div>

      <!-- Merge controls -->
      <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          @click="acceptAll"
          class="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
        >
          Accept All
        </button>
        <button
          @click="revertDiff"
          class="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Discard
        </button>
      </div>
    </div>

    <!-- No differences -->
    <div v-else-if="leftReportId && rightReportId && !isLoading" class="text-center py-10">
      <p class="text-sm text-gray-400">Reports are identical or not yet compared</p>
    </div>
  </div>
</template>

<script>
import diffMixin from '@/mixins/diffMixin'
import loadingMixin from '@/mixins/loadingMixin'

export default {
  name: 'ReportComparison',

  mixins: [diffMixin, loadingMixin],

  data() {
    return {
      reports: [],
      leftReportId: '',
      rightReportId: ''
    }
  },

  methods: {
    async runComparison() {
      if (!this.leftReportId || !this.rightReportId) return
      this.startLoading('Comparing reports...')
      const left = this.reports.find(r => r.id === this.leftReportId)
      const right = this.reports.find(r => r.id === this.rightReportId)
      this.computeDiff(left?.data || {}, right?.data || {})
      this.stopLoading()
    },

    acceptAll() {
      this.$emit('merge-accepted', this.diffResult)
    },

    diffRowClass(type) {
      const map = { added: 'bg-green-50 border-green-200', removed: 'bg-red-50 border-red-200', changed: 'bg-yellow-50 border-yellow-200' }
      return map[type] || 'bg-white border-gray-200'
    },

    changeIndicatorClass(type) {
      const map = { added: 'bg-green-100 text-green-700', removed: 'bg-red-100 text-red-700', changed: 'bg-yellow-100 text-yellow-700' }
      return map[type] || 'bg-gray-100 text-gray-600'
    }
  }
}
</script>

<style scoped>
.report-comparison {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
