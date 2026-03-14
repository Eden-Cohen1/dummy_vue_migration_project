<template>
  <!-- Edge case: Cross-mixin data dependency. validationMixin reads this.formData in validate(),
       but formData comes from formMixin. Tests whether the tool detects cross-mixin member access. -->
  <div class="report-scheduler">
    <h2 class="scheduler-title">Schedule Report</h2>

    <form ref="form" @submit.prevent="scheduleReport" class="scheduler-form">
      <div class="form-group">
        <label for="report-name">Report Name</label>
        <input
          id="report-name"
          v-model="formData.name"
          type="text"
          class="form-input"
          placeholder="Enter report name"
          @blur="validateField('name')"
        />
        <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="report-type">Report Type</label>
        <select id="report-type" v-model="formData.type" class="form-select">
          <option value="">Select type...</option>
          <option value="summary">Summary Report</option>
          <option value="detailed">Detailed Report</option>
          <option value="burndown">Burndown Chart</option>
          <option value="velocity">Velocity Report</option>
        </select>
        <span v-if="errors.type" class="field-error">{{ errors.type }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="schedule-date">Start Date</label>
          <input id="schedule-date" v-model="formData.startDate" type="date" class="form-input" />
          <span v-if="errors.startDate" class="field-error">{{ errors.startDate }}</span>
        </div>
        <div class="form-group">
          <label for="schedule-time">Time</label>
          <input id="schedule-time" v-model="formData.time" type="time" class="form-input" />
        </div>
      </div>

      <div class="form-group">
        <label for="frequency">Frequency</label>
        <select id="frequency" v-model="formData.frequency" class="form-select">
          <option value="once">One-time</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div class="form-group">
        <label>Recipients</label>
        <input
          v-model="formData.recipients"
          type="text"
          class="form-input"
          placeholder="Enter email addresses (comma-separated)"
          @blur="validateField('recipients')"
        />
        <span v-if="errors.recipients" class="field-error">{{ errors.recipients }}</span>
      </div>

      <div class="validation-summary" v-if="!isValid && errorCount > 0">
        <p>{{ errorCount }} error(s) found. Please review the form.</p>
      </div>

      <div class="notification-area" v-if="hasUnread">
        <div v-for="n in formattedNotifications.slice(0, 3)" :key="n.id" class="notification-toast">
          {{ n.message }} - {{ n.timeLabel }}
        </div>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn-primary"
          :disabled="isSubmitting || !canCreate"
          v-if="canCreate"
        >
          {{ isSubmitting ? 'Scheduling...' : 'Schedule Report' }}
        </button>
        <button type="button" class="btn-secondary" @click="resetForm" :disabled="!hasChanges">
          Reset
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import validationMixin from '@/mixins/validationMixin'
import notificationMixin from '@/mixins/notificationMixin'
import permissionMixin from '@/mixins/permissionMixin'
import { api } from '@/services/api'

export default {
  name: 'ReportScheduler',

  mixins: [formMixin, validationMixin, notificationMixin, permissionMixin],

  created() {
    this.initForm({
      name: '',
      type: '',
      startDate: '',
      time: '09:00',
      frequency: 'once',
      recipients: ''
    })

    this.addRule('name', (v) => (v && v.trim()) ? true : 'Report name is required')
    this.addRule('type', (v) => v ? true : 'Report type is required')
    this.addRule('startDate', (v) => v ? true : 'Start date is required')
    this.addRule('recipients', (v) => {
      if (!v || !v.trim()) return 'At least one recipient is required'
      const emails = v.split(',').map((e) => e.trim())
      const invalidEmail = emails.find((e) => !e.includes('@'))
      if (invalidEmail) return `Invalid email: ${invalidEmail}`
      return true
    })
  },

  methods: {
    async scheduleReport() {
      if (!this.validate()) return

      this.isSubmitting = true
      try {
        const schedule = {
          ...this.formData,
          recipients: this.formData.recipients.split(',').map((e) => e.trim())
        }
        await api.post('/reports/schedules', schedule)
        this.addNotification({
          type: 'success',
          message: `Report "${this.formData.name}" scheduled successfully`
        })
        this.$emit('report-scheduled', schedule)
        this.resetForm()
      } catch (err) {
        this.addNotification({
          type: 'error',
          message: err.message || 'Failed to schedule report'
        })
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.report-scheduler {
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem;
}

.scheduler-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field-error {
  display: block;
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.validation-summary {
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.btn-primary {
  padding: 0.5rem 1.25rem;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-secondary {
  padding: 0.5rem 1.25rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
}
</style>
