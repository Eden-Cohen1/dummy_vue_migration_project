<template>
  <div class="user-settings" :class="themeClass">
    <h2 class="settings-title">User Settings</h2>

    <!-- Profile Section -->
    <section class="settings-section">
      <h3 class="section-heading">Profile</h3>
      <div class="form-group">
        <label for="displayName">Display Name</label>
        <input id="displayName" v-model="formData.displayName" type="text" class="form-input" />
        <span v-if="errors.displayName" class="field-error">{{ errors.displayName }}</span>
      </div>
      <div class="form-group">
        <label for="email">Email Address</label>
        <input id="email" v-model="formData.email" type="email" class="form-input" />
        <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
      </div>
      <div class="form-group">
        <label for="bio">Bio</label>
        <textarea id="bio" v-model="formData.bio" rows="3" class="form-input"></textarea>
      </div>
    </section>

    <!-- Appearance Section -->
    <section class="settings-section">
      <h3 class="section-heading">Appearance</h3>
      <div class="theme-selector">
        <button
          v-for="theme in availableThemes"
          :key="theme"
          :class="['theme-btn', { active: currentTheme === theme }]"
          @click="setTheme(theme)"
        >
          {{ theme }}
        </button>
      </div>
      <div class="form-group">
        <label class="toggle-label">
          <input type="checkbox" v-model="formData.darkMode" @change="toggleDarkMode" />
          <span>Enable dark mode</span>
        </label>
      </div>
    </section>

    <!-- Notifications Section -->
    <section class="settings-section">
      <h3 class="section-heading">Notifications</h3>
      <div class="form-group">
        <label class="toggle-label">
          <input type="checkbox" v-model="formData.emailNotifications" />
          <span>Email notifications</span>
        </label>
      </div>
      <div class="form-group">
        <label class="toggle-label">
          <input type="checkbox" v-model="formData.pushNotifications" />
          <span>Push notifications</span>
        </label>
      </div>
    </section>

    <!-- Save Button -->
    <div class="form-actions">
      <button class="btn-save" :disabled="!isDirty || !isValid" @click="handleSubmit">
        Save Changes
      </button>
      <button class="btn-cancel" @click="resetForm">Cancel</button>
    </div>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import validationMixin from '@/mixins/validationMixin'
import themeMixin from '@/mixins/themeMixin'

export default {
  name: 'UserSettings',

  mixins: [formMixin, validationMixin, themeMixin],

  data() {
    return {
      formData: {
        displayName: '',
        email: '',
        bio: '',
        darkMode: false,
        emailNotifications: true,
        pushNotifications: true
      },
      availableThemes: ['default', 'compact', 'comfortable']
    }
  },

  methods: {
    async handleSubmit() {
      if (!this.validate()) return
      this.submitForm(this.formData)
    }
  }
}
</script>

<style scoped>
.user-settings { max-width: 640px; margin: 0 auto; padding: 1.5rem; }
.settings-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; }
.settings-section { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e5e7eb; }
.section-heading { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: #374151; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; }
.form-input {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem;
}
.field-error { color: #ef4444; font-size: 0.75rem; }
.theme-selector { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.theme-btn {
  padding: 0.4rem 1rem; border: 1px solid #d1d5db; border-radius: 6px;
  background: white; cursor: pointer; text-transform: capitalize; font-size: 0.875rem;
}
.theme-btn.active { background: #3b82f6; color: white; border-color: #3b82f6; }
.toggle-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; cursor: pointer; }
.form-actions { display: flex; gap: 0.75rem; }
.btn-save {
  padding: 0.5rem 1.5rem; background: #3b82f6; color: white;
  border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem;
}
.btn-save:disabled { opacity: 0.5; cursor: default; }
.btn-cancel {
  padding: 0.5rem 1.5rem; background: white; color: #374151;
  border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 0.875rem;
}
</style>
