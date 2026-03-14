<!-- ProjectBudget.vue
  Mixins used:
  - chartMixin: Provides renderChart, destroyChart for rendering the budget pie chart
  - exportMixin: Provides exportToCSV, exportFormat, isExporting for exporting budget data
  - loadingMixin: Provides isLoading, startLoading/stopLoading for fetching budget data
  This component displays budget tracking for a project with summary cards,
  a pie chart breakdown, an expense table, and export functionality.
-->
<template>
  <div class="project-budget">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Budget Overview</h3>
      <button
        @click="handleExport"
        :disabled="isExporting"
        class="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
      >
        {{ isExporting ? 'Exporting...' : 'Export' }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-16">
      <svg class="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>

    <template v-else>
      <!-- Summary cards -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-blue-50 rounded-lg p-4">
          <p class="text-xs text-blue-600 font-medium">Total Budget</p>
          <p class="text-xl font-bold text-blue-900">${{ formatCurrency(budget.total) }}</p>
        </div>
        <div class="bg-orange-50 rounded-lg p-4">
          <p class="text-xs text-orange-600 font-medium">Spent</p>
          <p class="text-xl font-bold text-orange-900">${{ formatCurrency(budget.spent) }}</p>
        </div>
        <div class="bg-green-50 rounded-lg p-4">
          <p class="text-xs text-green-600 font-medium">Remaining</p>
          <p class="text-xl font-bold text-green-900">${{ formatCurrency(budget.remaining) }}</p>
        </div>
      </div>

      <!-- Budget utilization bar -->
      <div class="mb-6">
        <div class="flex justify-between text-xs text-gray-500 mb-1">
          <span>Utilization</span>
          <span>{{ utilizationPercent }}%</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all"
            :class="utilizationPercent > 90 ? 'bg-red-500' : utilizationPercent > 70 ? 'bg-yellow-500' : 'bg-green-500'"
            :style="{ width: utilizationPercent + '%' }"
          ></div>
        </div>
      </div>

      <!-- Chart -->
      <div class="mb-6">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Spending by Category</h4>
        <div ref="chartContainer" class="h-64 bg-gray-50 rounded-lg border border-gray-200"></div>
      </div>

      <!-- Expense table -->
      <div>
        <h4 class="text-sm font-medium text-gray-700 mb-2">Recent Expenses</h4>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 text-left text-xs text-gray-500">
              <th class="pb-2 font-medium">Description</th>
              <th class="pb-2 font-medium">Category</th>
              <th class="pb-2 font-medium text-right">Amount</th>
              <th class="pb-2 font-medium text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in expenses" :key="expense.id" class="border-b border-gray-100">
              <td class="py-2 text-gray-900">{{ expense.description }}</td>
              <td class="py-2 text-gray-500">{{ expense.category }}</td>
              <td class="py-2 text-gray-900 text-right">${{ formatCurrency(expense.amount) }}</td>
              <td class="py-2 text-gray-500 text-right">{{ expense.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script>
import chartMixin from '@/mixins/chartMixin'
import exportMixin from '@/mixins/exportMixin'
import loadingMixin from '@/mixins/loadingMixin'

export default {
  name: 'ProjectBudget',

  mixins: [chartMixin, exportMixin, loadingMixin],

  props: {
    projectId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      budget: { total: 50000, spent: 32400, remaining: 17600 },
      expenses: []
    }
  },

  computed: {
    utilizationPercent() {
      if (!this.budget.total) return 0
      return Math.round((this.budget.spent / this.budget.total) * 100)
    }
  },

  mounted() {
    this.renderChart(this.$refs.chartContainer, {
      type: 'pie',
      data: { labels: ['Development', 'Design', 'Marketing'], values: [18000, 8400, 6000] }
    })
  },

  beforeDestroy() {
    this.destroyChart()
  },

  methods: {
    formatCurrency(amount) {
      return (amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
    },

    handleExport() {
      this.exportToCSV(this.expenses)
    }
  }
}
</script>

<style scoped>
.project-budget {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
