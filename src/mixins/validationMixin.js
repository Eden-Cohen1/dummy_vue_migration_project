export default {
  data() {
    return {
      rules: {},
      errors: {},
      isValidating: false
    }
  },

  computed: {
    isValid() {
      return !Object.keys(this.errors).length
    },

    firstError() {
      const keys = Object.keys(this.errors)
      return keys.length > 0 ? this.errors[keys[0]] : null
    },

    errorCount() {
      return Object.keys(this.errors).length
    }
  },

  methods: {
    validate() {
      this.isValidating = true
      const newErrors = {}

      Object.keys(this.rules).forEach((field) => {
        const fieldRules = this.rules[field]
        const value = this.formData ? this.formData[field] : undefined

        for (const rule of fieldRules) {
          const result = rule(value)
          if (result !== true) {
            newErrors[field] = result
            break
          }
        }
      })

      this.errors = newErrors
      this.isValidating = false
      this.$emit('validation-complete', this.isValid)

      return this.isValid
    },

    validateField(field) {
      if (!this.rules[field]) return true

      const value = this.formData ? this.formData[field] : undefined
      const fieldRules = this.rules[field]

      for (const rule of fieldRules) {
        const result = rule(value)
        if (result !== true) {
          this.errors = { ...this.errors, [field]: result }
          return false
        }
      }

      const { [field]: _, ...remaining } = this.errors
      this.errors = remaining
      return true
    },

    clearErrors() {
      this.errors = {}
    },

    addRule(field, rule) {
      if (!this.rules[field]) {
        this.rules = { ...this.rules, [field]: [] }
      }
      this.rules[field].push(rule)
    }
  }
}
