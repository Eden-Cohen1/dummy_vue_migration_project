// Edge case: Arrow functions, destructured parameters, and default parameter values
// that reference this.xxx. Tests that the parser handles these JS patterns correctly.
export default {
  data() {
    return {
      items: [],
      defaultThreshold: 10,
      processor: null,
      batchSize: 25
    }
  },

  computed: {
    activeItems() {
      // Arrow function with destructuring in callback
      return this.items.filter(({ active, deleted }) => active && !deleted)
    },

    itemNames() {
      return this.items.map(({ name }) => name)
    }
  },

  methods: {
    processItems(threshold = this.defaultThreshold) {
      // Default parameter references this.xxx
      return this.items
        .filter(item => item.score >= threshold)
        .map(({ id, name, score }) => ({ id, name, normalizedScore: score / 100 }))
    },

    transformBatch(items, batchSize = this.batchSize) {
      // Another default param from this
      const batches = []
      for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize))
      }
      return batches
    },

    chainedOperations() {
      // Chained arrow functions
      return this.items
        .filter(x => x.active)
        .map(x => x.name)
        .reduce((acc, name) => {
          acc[name] = (acc[name] || 0) + 1
          return acc
        }, {})
    },

    sortByField(field, direction = 'asc') {
      // Arrow with comparison and ternary
      const modifier = direction === 'asc' ? 1 : -1
      return [...this.items].sort((a, b) => {
        return a[field] > b[field] ? modifier : -modifier
      })
    },

    findItem(predicate = (item) => item.id === this.defaultThreshold) {
      // Default param is an arrow function referencing this
      return this.items.find(predicate)
    },

    async processAsync() {
      // Arrow in Promise chain
      const results = await Promise.all(
        this.items.map(async ({ id, url }) => {
          const response = await fetch(url)
          return { id, data: await response.json() }
        })
      )
      return results
    }
  }
}
