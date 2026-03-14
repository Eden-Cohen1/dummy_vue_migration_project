// Edge case: Object diff comparison with deep key traversal.
// Tests migration of methods that recursively compare nested objects
// and computed properties that summarize complex diff results.
export default {
  data() {
    return {
      originalValue: null,
      currentValue: null,
      diffResult: {}
    }
  },

  computed: {
    hasDifferences() {
      return Object.keys(this.diffResult).length > 0
    },

    diffSummary() {
      const keys = Object.keys(this.diffResult)
      if (keys.length === 0) return 'No changes'
      const added = keys.filter(k => this.diffResult[k].type === 'added')
      const removed = keys.filter(k => this.diffResult[k].type === 'removed')
      const changed = keys.filter(k => this.diffResult[k].type === 'changed')
      const parts = []
      if (added.length) parts.push(`${added.length} added`)
      if (removed.length) parts.push(`${removed.length} removed`)
      if (changed.length) parts.push(`${changed.length} changed`)
      return parts.join(', ')
    },

    changeCount() {
      return Object.keys(this.diffResult).length
    }
  },

  methods: {
    computeDiff(a, b) {
      const diff = {}
      const allKeys = new Set([
        ...Object.keys(a || {}),
        ...Object.keys(b || {})
      ])

      allKeys.forEach(key => {
        const inA = a && key in a
        const inB = b && key in b

        if (!inA && inB) {
          diff[key] = { type: 'added', value: b[key] }
        } else if (inA && !inB) {
          diff[key] = { type: 'removed', value: a[key] }
        } else if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
          diff[key] = { type: 'changed', from: a[key], to: b[key] }
        }
      })

      this.diffResult = diff
      return diff
    },

    applyDiff(target, diff) {
      const result = { ...target }
      Object.keys(diff).forEach(key => {
        if (diff[key].type === 'removed') {
          delete result[key]
        } else if (diff[key].type === 'added' || diff[key].type === 'changed') {
          result[key] = diff[key].type === 'added' ? diff[key].value : diff[key].to
        }
      })
      return result
    },

    revertDiff() {
      if (this.originalValue !== null) {
        this.currentValue = JSON.parse(JSON.stringify(this.originalValue))
        this.diffResult = {}
      }
    }
  }
}
