// Edge case: Property names that are substrings of other properties: count, countTotal,
// countItems, activeCount. A naive regex rewriter using /this\.count/ would falsely
// match this.countTotal and this.countItems.
export default {
  data() {
    return {
      count: 0,
      countTotal: 0,
      countItems: 0,
      activeCount: 0,
      countByCategory: {},
      countHistory: []
    }
  },

  computed: {
    countDisplay() {
      return `${this.count} of ${this.countTotal}`
    },

    isCountZero() {
      return this.count === 0
    },

    countPercentage() {
      if (this.countTotal === 0) return 0
      return Math.round((this.count / this.countTotal) * 100)
    },

    activeCountDisplay() {
      return `${this.activeCount} active of ${this.countItems} items`
    }
  },

  methods: {
    incrementCount() {
      this.count++
      this.countHistory.push({ type: 'increment', value: this.count, timestamp: Date.now() })
    },

    decrementCount() {
      if (this.count > 0) this.count--
    },

    resetCount() {
      this.count = 0
      this.activeCount = 0
    },

    recalculateCountTotal(items) {
      this.countItems = items.length
      this.countTotal = items.reduce((sum, item) => sum + (item.count || 0), 0)
      this.activeCount = items.filter(item => item.active).length
    },

    updateCountByCategory(category, delta) {
      const current = this.countByCategory[category] || 0
      this.countByCategory = {
        ...this.countByCategory,
        [category]: current + delta
      }
      this.countTotal += delta
    },

    getCountForCategory(category) {
      return this.countByCategory[category] || 0
    }
  }
}
