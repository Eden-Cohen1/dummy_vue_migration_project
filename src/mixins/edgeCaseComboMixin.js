// Edge case: Combines multiple parsing-tricky patterns in a single mixin:
// template literals, regex with braces, arrow functions, and deeply nested blocks.
// This is the ultimate stress test for a string-based parser.
export default {
  data() {
    return {
      rawData: [],
      formatRules: [],
      transformLog: []
    }
  },

  computed: {
    formattedOutput() {
      // Returns object literal (parse tricky) with template literal values
      return {
        summary: `Processed ${this.rawData.length} items with ${this.formatRules.length} rules`,
        timestamp: `${new Date().toISOString()}`,
        ruleCount: this.formatRules.length
      }
    }
  },

  methods: {
    formatAll(items) {
      // Arrow function + template literal + regex combo
      return items.map(({ id, text, metadata }) => {
        // Regex with braces inside arrow function
        const cleaned = text.replace(/\{[^}]+\}/g, '')
        // Template literal inside arrow function
        const label = `Item #${id}: ${cleaned.trim()}`

        try {
          // Nested braces: try inside map callback
          if (metadata && typeof metadata === 'object') {
            const keys = Object.keys(metadata)
            for (const key of keys) {
              if (/^\{.*\}$/.test(String(metadata[key]))) {
                this.transformLog.push(`Nested value found for ${key}`)
              }
            }
          }
        } catch (err) {
          this.transformLog.push(`Error: ${err.message}`)
        }

        return { id, label, original: text }
      })
    },

    safeProcess(input) {
      // try/catch with regex inside
      try {
        const tokens = input.match(/\{(\w+)\}/g) || []
        return tokens.map(token => {
          const key = token.replace(/[{}]/g, '')
          return { token, key, value: this[key] || null }
        })
      } catch (err) {
        return []
      }
    },

    buildQueryString(params) {
      // Arrow + template literal + nested expression
      return Object.entries(params)
        .filter(([, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
    }
  }
}
