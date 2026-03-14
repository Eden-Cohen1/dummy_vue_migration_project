<!-- TaskRecurrence.vue
  Mixins used:
  - formMixin: Provides form data management, isDirty tracking, resetForm, handleSubmit
  - validationMixin: Provides validate, errors object, clearErrors for field-level validation
  This component allows configuring recurring task schedules with options for
  daily, weekly, or monthly recurrence patterns, including day and time selection.
-->
<template>
  <div class="task-recurrence">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Recurrence Settings</h3>

    <form @submit.prevent="handleSave">
      <!-- Recurrence type -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Repeat</label>
        <select
          v-model="formData.recurrenceType"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="none">No Recurrence</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <p v-if="errors.recurrenceType" class="mt-1 text-xs text-red-500">{{ errors.recurrenceType }}</p>
      </div>

      <!-- Weekly day picker -->
      <div v-if="formData.recurrenceType === 'weekly'" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Repeat on</label>
        <div class="flex space-x-2">
          <button
            v-for="day in weekDays"
            :key="day.value"
            type="button"
            @click="toggleDay(day.value)"
            :class="[
              'w-9 h-9 rounded-full text-xs font-medium transition-colors',
              formData.selectedDays.includes(day.value)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ day.label }}
          </button>
        </div>
        <p v-if="errors.selectedDays" class="mt-1 text-xs text-red-500">{{ errors.selectedDays }}</p>
      </div>

      <!-- Monthly day picker -->
      <div v-if="formData.recurrenceType === 'monthly'" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Day of month</label>
        <input
          v-model.number="formData.dayOfMonth"
          type="number"
          min="1"
          max="31"
          class="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <p v-if="errors.dayOfMonth" class="mt-1 text-xs text-red-500">{{ errors.dayOfMonth }}</p>
      </div>

      <!-- Time input -->
      <div v-if="formData.recurrenceType !== 'none'" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
        <input
          v-model="formData.time"
          type="time"
          class="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <p v-if="errors.time" class="mt-1 text-xs text-red-500">{{ errors.time }}</p>
      </div>

      <!-- Validation summary -->
      <div v-if="Object.keys(errors).length > 0" class="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
        <p class="text-sm text-red-600">Please fix the errors above before saving.</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-3">
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import validationMixin from '@/mixins/validationMixin'

export default {
  name: 'TaskRecurrence',

  mixins: [formMixin, validationMixin],

  props: {
    taskId: {
      type: [String, Number],
      required: true
    },
    initialConfig: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      formData: {
        recurrenceType: this.initialConfig.recurrenceType || 'none',
        selectedDays: this.initialConfig.selectedDays || [],
        dayOfMonth: this.initialConfig.dayOfMonth || 1,
        time: this.initialConfig.time || '09:00'
      },
      weekDays: [
        { label: 'Su', value: 0 },
        { label: 'Mo', value: 1 },
        { label: 'Tu', value: 2 },
        { label: 'We', value: 3 },
        { label: 'Th', value: 4 },
        { label: 'Fr', value: 5 },
        { label: 'Sa', value: 6 }
      ]
    }
  },

  methods: {
    toggleDay(day) {
      const idx = this.formData.selectedDays.indexOf(day)
      if (idx === -1) {
        this.formData.selectedDays.push(day)
      } else {
        this.formData.selectedDays.splice(idx, 1)
      }
    },

    handleSave() {
      this.clearErrors()
      if (this.formData.recurrenceType === 'weekly' && this.formData.selectedDays.length === 0) {
        this.errors.selectedDays = 'Select at least one day'
        return
      }
      this.$emit('save', { ...this.formData })
    },

    handleCancel() {
      this.resetForm()
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.task-recurrence {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
