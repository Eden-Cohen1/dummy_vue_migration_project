// Edge case: Deeply nested braces (3+ levels of if/for/try nesting). A string-based
// parser must correctly track brace depth to find method boundaries.
export default {
  data() {
    return {
      nestedData: [],
      processLog: [],
      maxDepth: 5,
      errorThreshold: 0.1
    }
  },

  computed: {
    processedResults() {
      return this.processLog.filter(entry => entry.status === 'success')
    },

    hasErrors() {
      return this.processLog.some(entry => entry.status === 'error')
    }
  },

  methods: {
    processNestedData(items) {
      const results = []
      // Level 1: for loop
      for (let i = 0; i < items.length; i++) {
        // Level 2: if check
        if (items[i] && items[i].children) {
          // Level 3: try/catch
          try {
            // Level 4: for loop inside try
            for (let j = 0; j < items[i].children.length; j++) {
              // Level 5: if inside for inside try inside if inside for
              if (items[i].children[j].active) {
                const processed = {
                  parentId: items[i].id,
                  childId: items[i].children[j].id,
                  value: items[i].children[j].value * this.maxDepth
                }
                results.push(processed)
                this.processLog.push({ status: 'success', item: processed })
              }
            }
          } catch (err) {
            this.processLog.push({ status: 'error', message: err.message })
            // Level 4: if inside catch
            if (this.processLog.filter(e => e.status === 'error').length > items.length * this.errorThreshold) {
              throw new Error('Too many errors during processing')
            }
          }
        }
      }
      this.nestedData = results
      return results
    },

    transformRecursive(node, depth = 0) {
      if (depth > this.maxDepth) {
        return null
      }

      const result = { id: node.id, depth }

      if (node.children && node.children.length > 0) {
        result.children = []
        for (const child of node.children) {
          if (child.visible !== false) {
            const transformed = this.transformRecursive(child, depth + 1)
            if (transformed) {
              result.children.push(transformed)
            }
          }
        }
      }

      return result
    },

    validateStructure(data) {
      // Another deeply nested method
      for (const group of data) {
        if (group.type === 'complex') {
          for (const item of group.items) {
            try {
              if (item.rules) {
                for (const rule of item.rules) {
                  if (!rule.validate(item.value)) {
                    return { valid: false, field: item.name, rule: rule.name }
                  }
                }
              }
            } catch (e) {
              return { valid: false, field: item.name, error: e.message }
            }
          }
        }
      }
      return { valid: true }
    }
  }
}
