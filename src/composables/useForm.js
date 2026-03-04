import { ref, computed } from 'vue'

export function useForm() {
  const formData = ref({})
  const originalData = ref({})
  const isDirty = ref(false)
  const isSubmitting = ref(false)
  const formErrors = ref({})

  const hasChanges = computed(() => {
    return JSON.stringify(formData.value) !== JSON.stringify(originalData.value)
  })

  const isFormValid = computed(() => Object.keys(formErrors.value).length === 0)

  function initForm(data) {
    formData.value = { ...data }
    originalData.value = { ...data }
    isDirty.value = false
    formErrors.value = {}
  }

  function resetForm() {
    formData.value = { ...originalData.value }
    isDirty.value = false
    formErrors.value = {}
  }

  async function submitForm() {
    if (!isFormValid.value) return false
    isSubmitting.value = true
    try {
      // Submit logic placeholder
      isDirty.value = false
      return true
    } finally {
      isSubmitting.value = false
    }
  }

  // NOTE: setFieldError and dirtyFields are NOT defined in this composable

  return {
    formData,
    originalData,
    isDirty,
    isSubmitting,
    formErrors,
    hasChanges,
    isFormValid,
    initForm,
    resetForm,
    submitForm
  }
}
