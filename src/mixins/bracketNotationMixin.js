// Edge case: Bracket notation property access. The migration tool must detect
// this['dynamicKey'], this[varName], and this[`computed_${key}`] as property access,
// not just dot notation this.xxx.
export default {
  data() {
    return {
      config: {
        apiUrl: '/api',
        timeout: 5000,
        retries: 3
      },
      dynamicFields: ['name', 'email', 'role'],
      fieldValues: {},
      selectedField: 'name'
    }
  },

  computed: {
    resolvedFields() {
      return this.dynamicFields.map(field => ({
        name: field,
        value: this[field] || this.fieldValues[field] || null
      }))
    },

    currentFieldValue() {
      // Bracket notation with data property
      return this[this.selectedField]
    }
  },

  methods: {
    getField(fieldName) {
      // Simple bracket notation
      return this[fieldName]
    },

    setField(fieldName, value) {
      // Bracket notation assignment
      this[fieldName] = value
    },

    getConfigValue(key) {
      // Bracket on nested property
      return this['config'][key]
    },

    getDynamicConfig(prefix, key) {
      // Template literal in bracket notation
      return this[`${prefix}_${key}`]
    },

    batchGetFields(fieldNames) {
      const result = {}
      for (const name of fieldNames) {
        // Bracket notation in loop
        result[name] = this[name]
      }
      return result
    },

    copyFieldValues(source, target) {
      // Multiple bracket notations in one expression
      this[target] = this[source]
    },

    hasField(fieldName) {
      return this[fieldName] !== undefined
    }
  }
}
