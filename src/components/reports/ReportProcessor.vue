<template>
  <div class="report-processor">
    <div class="stats">
      <span>{{ countDisplay }}</span>
      <span>{{ activeCountDisplay }}</span>
      <span>{{ countPercentage }}%</span>
    </div>
    <div v-if="hasErrors" class="error-summary">
      Errors found in processing log
    </div>
    <button @click="runProcessing">Process Data</button>
    <button @click="incrementCount">Increment</button>
    <button @click="resetCount">Reset</button>
    <div class="results">
      <div v-for="result in processedResults" :key="result.item.childId">
        {{ result.item.parentId }} → {{ result.item.childId }}
      </div>
    </div>
  </div>
</template>

<script>
import deeplyNestedMixin from '@/mixins/deeplyNestedMixin'
import counterMixin from '@/mixins/counterMixin'

export default {
  name: 'ReportProcessor',
  mixins: [deeplyNestedMixin, counterMixin],

  methods: {
    runProcessing() {
      const mockData = [
        { id: 1, children: [{ id: 10, active: true, value: 5 }, { id: 11, active: false, value: 3 }] },
        { id: 2, children: [{ id: 20, active: true, value: 8 }] }
      ]
      const results = this.processNestedData(mockData)
      this.recalculateCountTotal(results)
    }
  }
}
</script>

<style scoped>
.report-processor { padding: 1rem; }
.stats { display: flex; gap: 1rem; }
.error-summary { color: #dc3545; }
</style>
