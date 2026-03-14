<template>
  <div class="notification-preferences">
    <h2 class="prefs-title">Notification Preferences</h2>

    <!-- Delivery Channels -->
    <section class="prefs-section">
      <h3 class="section-heading">Delivery Channels</h3>
      <div class="toggle-row">
        <label class="toggle-label">
          <input type="checkbox" v-model="formData.emailEnabled" />
          <span>Email Notifications</span>
        </label>
        <span class="toggle-desc">Receive notifications via email</span>
      </div>
      <div class="toggle-row">
        <label class="toggle-label">
          <input type="checkbox" v-model="formData.pushEnabled" />
          <span>Push Notifications</span>
        </label>
        <span class="toggle-desc">Browser push notifications</span>
      </div>
      <div class="toggle-row">
        <label class="toggle-label">
          <input type="checkbox" v-model="formData.inAppEnabled" />
          <span>In-App Notifications</span>
        </label>
        <span class="toggle-desc">Show notifications within the app</span>
      </div>
    </section>

    <!-- Quiet Hours -->
    <section class="prefs-section">
      <h3 class="section-heading">Quiet Hours</h3>
      <div class="toggle-row">
        <label class="toggle-label">
          <input type="checkbox" v-model="formData.quietHoursEnabled" />
          <span>Enable Quiet Hours</span>
        </label>
      </div>
      <div v-if="formData.quietHoursEnabled" class="quiet-hours-range">
        <div class="form-group">
          <label>From</label>
          <input type="time" v-model="formData.quietStart" class="form-input" />
        </div>
        <div class="form-group">
          <label>To</label>
          <input type="time" v-model="formData.quietEnd" class="form-input" />
        </div>
      </div>
    </section>

    <!-- Per-Category Preferences -->
    <section class="prefs-section">
      <h3 class="section-heading">Categories</h3>
      <div v-for="cat in categories" :key="cat.key" class="category-row">
        <span class="category-name">{{ cat.label }}</span>
        <select v-model="formData.categoryPrefs[cat.key]" class="category-select">
          <option value="all">All</option>
          <option value="important">Important Only</option>
          <option value="none">None</option>
        </select>
      </div>
    </section>

    <!-- Save Button -->
    <div class="form-actions">
      <button class="btn-save" @click="savePreferences">Save Preferences</button>
    </div>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import notificationMixin from '@/mixins/notificationMixin'

export default {
  name: 'NotificationPreferences',

  mixins: [formMixin, notificationMixin],

  data() {
    return {
      formData: {
        emailEnabled: true,
        pushEnabled: false,
        inAppEnabled: true,
        quietHoursEnabled: false,
        quietStart: '22:00',
        quietEnd: '08:00',
        categoryPrefs: {
          tasks: 'all',
          projects: 'all',
          mentions: 'all',
          system: 'important'
        }
      },
      categories: [
        { key: 'tasks', label: 'Task Updates' },
        { key: 'projects', label: 'Project Activity' },
        { key: 'mentions', label: 'Mentions' },
        { key: 'system', label: 'System Alerts' }
      ]
    }
  },

  methods: {
    savePreferences() {
      this.submitForm(this.formData)
      this.showNotification?.('Preferences saved!', 'success')
    }
  }
}
</script>

<style scoped>
.notification-preferences { max-width: 600px; margin: 0 auto; padding: 1.5rem; }
.prefs-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; }
.prefs-section { margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid #e5e7eb; }
.section-heading { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.75rem; color: #374151; }
.toggle-row { margin-bottom: 0.75rem; }
.toggle-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; cursor: pointer; font-weight: 500; }
.toggle-desc { font-size: 0.75rem; color: #9ca3af; margin-left: 1.5rem; }
.quiet-hours-range { display: flex; gap: 1rem; margin-top: 0.5rem; margin-left: 1.5rem; }
.form-group label { display: block; font-size: 0.75rem; color: #6b7280; margin-bottom: 0.2rem; }
.form-input { padding: 0.35rem 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.8rem; }
.category-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6;
}
.category-name { font-size: 0.875rem; color: #374151; }
.category-select { padding: 0.3rem 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.8rem; }
.form-actions { margin-top: 1rem; }
.btn-save {
  padding: 0.5rem 1.5rem; background: #3b82f6; color: white;
  border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem;
}
</style>
