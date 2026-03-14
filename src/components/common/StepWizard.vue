<template>
  <div class="step-wizard">
    <!-- Step Indicators -->
    <div class="step-indicators">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="['step-indicator', { active: index === currentStep, completed: index < currentStep }]"
      >
        <div class="step-circle">
          <span v-if="index < currentStep" class="step-check">&#10003;</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span class="step-label">{{ step.title }}</span>
      </div>
      <div class="step-progress-bar">
        <div class="step-progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="step-content">
      <h3 class="step-title">{{ steps[currentStep].title }}</h3>
      <p v-if="steps[currentStep].description" class="step-description">
        {{ steps[currentStep].description }}
      </p>

      <slot :name="'step-' + currentStep" :step="steps[currentStep]">
        <div class="step-placeholder">Step {{ currentStep + 1 }} content</div>
      </slot>

      <!-- Validation Errors -->
      <div v-if="stepErrors.length > 0" class="step-errors">
        <p v-for="(err, idx) in stepErrors" :key="idx" class="step-error">{{ err }}</p>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="step-actions">
      <button
        class="btn-prev"
        :disabled="currentStep === 0"
        @click="previousStep"
      >
        Previous
      </button>

      <button
        v-if="currentStep < steps.length - 1"
        class="btn-next"
        @click="nextStep"
      >
        Next
      </button>

      <button
        v-else
        class="btn-complete"
        :disabled="!isValid"
        @click="completeWizard"
      >
        Complete
      </button>
    </div>
  </div>
</template>

<script>
import stepperMixin from '@/mixins/stepperMixin'
import formMixin from '@/mixins/formMixin'
import validationMixin from '@/mixins/validationMixin'

export default {
  name: 'StepWizard',

  mixins: [stepperMixin, formMixin, validationMixin],

  props: {
    steps: {
      type: Array,
      default: () => [
        { title: 'Step 1', description: 'First step' },
        { title: 'Step 2', description: 'Second step' },
        { title: 'Step 3', description: 'Final step' }
      ]
    }
  },

  emits: ['complete', 'step-change'],

  data() {
    return {
      currentStep: 0,
      stepErrors: []
    }
  },

  computed: {
    progressPercent() {
      return (this.currentStep / (this.steps.length - 1)) * 100
    }
  },

  methods: {
    nextStep() {
      this.stepErrors = []
      if (!this.validateStep()) return
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++
        this.$emit('step-change', this.currentStep)
      }
    },

    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--
        this.$emit('step-change', this.currentStep)
      }
    },

    validateStep() {
      // Stub: uses validationMixin
      return this.validate ? this.validate() : true
    },

    completeWizard() {
      if (!this.validateStep()) return
      this.$emit('complete', this.formData)
    }
  }
}
</script>

<style scoped>
.step-wizard { max-width: 640px; margin: 0 auto; padding: 1.5rem; }
.step-indicators { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; position: relative; }
.step-indicator { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; z-index: 1; }
.step-circle {
  width: 2rem; height: 2rem; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 600;
  background: #e5e7eb; color: #6b7280;
}
.step-indicator.active .step-circle { background: #3b82f6; color: white; }
.step-indicator.completed .step-circle { background: #22c55e; color: white; }
.step-label { font-size: 0.75rem; color: #6b7280; }
.step-progress-bar {
  position: absolute; top: 1rem; left: 1rem; right: 1rem;
  height: 3px; background: #e5e7eb; z-index: 0;
}
.step-progress-fill { height: 100%; background: #3b82f6; transition: width 0.3s; }
.step-content { min-height: 200px; margin-bottom: 1.5rem; }
.step-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
.step-description { font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem; }
.step-placeholder { padding: 2rem; background: #f9fafb; border-radius: 8px; text-align: center; color: #9ca3af; }
.step-errors { margin-top: 0.75rem; }
.step-error { color: #ef4444; font-size: 0.8rem; margin: 0.25rem 0; }
.step-actions { display: flex; justify-content: space-between; }
.btn-prev, .btn-next, .btn-complete {
  padding: 0.5rem 1.25rem; border-radius: 6px; font-size: 0.875rem; cursor: pointer;
}
.btn-prev { background: white; border: 1px solid #d1d5db; color: #374151; }
.btn-prev:disabled { opacity: 0.4; cursor: default; }
.btn-next { background: #3b82f6; color: white; border: none; }
.btn-complete { background: #22c55e; color: white; border: none; }
.btn-complete:disabled { opacity: 0.5; cursor: default; }
</style>
