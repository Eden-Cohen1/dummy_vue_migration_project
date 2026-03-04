import { ref, computed } from 'vue'

export function useValidation() {
  const rules = ref({})
  const errors = ref({})
  const isValidating = ref(false)

  const isValid = computed(() => Object.keys(errors.value).length === 0)
  const firstError = computed(() => {
    const keys = Object.keys(errors.value)
    return keys.length > 0 ? errors.value[keys[0]] : null
  })
  const errorCount = computed(() => Object.keys(errors.value).length)

  function validate() {
    isValidating.value = true
    const newErrors = {}
    for (const [field, fieldRules] of Object.entries(rules.value)) {
      for (const rule of fieldRules) {
        const result = rule(field)
        if (result !== true) {
          newErrors[field] = result
          break
        }
      }
    }
    errors.value = newErrors
    isValidating.value = false
    return isValid.value
  }

  function validateField(field) {
    const fieldRules = rules.value[field] || []
    for (const rule of fieldRules) {
      const result = rule(field)
      if (result !== true) {
        errors.value = { ...errors.value, [field]: result }
        return false
      }
    }
    const { [field]: _, ...rest } = errors.value
    errors.value = rest
    return true
  }

  function clearErrors() {
    errors.value = {}
  }

  function addRule(field, rule) {
    if (!rules.value[field]) {
      rules.value = { ...rules.value, [field]: [] }
    }
    rules.value[field].push(rule)
  }

  return {
    rules,
    errors,
    isValidating,
    isValid,
    firstError,
    errorCount,
    validate,
    validateField,
    clearErrors,
    addRule
  }
}
