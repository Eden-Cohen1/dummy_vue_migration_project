// Edge case: Multi-step wizard flow with step validation and progress tracking.
// Tests migration of computed properties that depend on array indices and
// methods that mutate step state with boundary checks.
export default {
  data() {
    return {
      currentStep: 0,
      steps: [],
      stepData: {},
      isStepValid: true
    }
  },

  computed: {
    isFirstStep() {
      return this.currentStep === 0
    },

    isLastStep() {
      return this.currentStep === this.steps.length - 1
    },

    progress() {
      if (this.steps.length === 0) return 0
      return Math.round(((this.currentStep + 1) / this.steps.length) * 100)
    },

    canProceed() {
      return this.isStepValid && !this.isLastStep
    },

    stepCount() {
      return this.steps.length
    }
  },

  methods: {
    nextStep() {
      if (!this.validateStep()) return
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++
        this.$emit('step-changed', this.currentStep)
      }
    },

    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
        this.$emit('step-changed', this.currentStep)
      }
    },

    goToStep(index) {
      if (index >= 0 && index < this.steps.length) {
        this.currentStep = index
        this.$emit('step-changed', this.currentStep)
      }
    },

    validateStep() {
      const step = this.steps[this.currentStep]
      if (!step || !step.validator) {
        this.isStepValid = true
        return true
      }
      const data = this.stepData[step.key] || {}
      this.isStepValid = step.validator(data)
      return this.isStepValid
    },

    completeWizard() {
      if (!this.validateStep()) return
      this.$emit('wizard-complete', { ...this.stepData })
      this.currentStep = 0
      this.stepData = {}
    }
  }
}
