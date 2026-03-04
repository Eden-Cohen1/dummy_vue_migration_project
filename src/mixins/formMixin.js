export default {
  data() {
    return {
      formData: {},
      originalData: {},
      isDirty: false,
      isSubmitting: false,
      formErrors: {}
    }
  },

  computed: {
    hasChanges() {
      return JSON.stringify(this.formData) !== JSON.stringify(this.originalData)
    },

    isFormValid() {
      return Object.keys(this.formErrors).length === 0
    },

    dirtyFields() {
      return Object.keys(this.formData).filter((key) => {
        return JSON.stringify(this.formData[key]) !== JSON.stringify(this.originalData[key])
      })
    }
  },

  methods: {
    initForm(data) {
      this.formData = JSON.parse(JSON.stringify(data))
      this.originalData = JSON.parse(JSON.stringify(data))
      this.isDirty = false
      this.formErrors = {}
    },

    resetForm() {
      this.formData = JSON.parse(JSON.stringify(this.originalData))
      this.isDirty = false
      this.formErrors = {}
    },

    submitForm() {
      this.isSubmitting = true

      if (this.$refs.form) {
        this.$refs.form.reportValidity()
      }

      this.$nextTick(() => {
        this.$emit('form-submitted', this.formData)
        this.isSubmitting = false
      })
    },

    setFieldError(field, msg) {
      this.formErrors = { ...this.formErrors, [field]: msg }
    }
  },

  beforeMount() {
    this.initForm(this.formData)
  }
}
