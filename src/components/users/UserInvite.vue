<template>
  <div class="user-invite">
    <h2 class="invite-title">Invite Team Members</h2>

    <!-- Email Input -->
    <div class="form-group">
      <label for="inviteEmail">Email Addresses</label>
      <div class="email-input-row">
        <input
          id="inviteEmail"
          v-model="emailInput"
          type="email"
          placeholder="colleague@company.com"
          class="form-input"
          @keydown.enter.prevent="addEmail"
        />
        <button class="btn-add" @click="addEmail">Add</button>
      </div>
      <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
    </div>

    <!-- Added Emails List -->
    <ul v-if="emailList.length > 0" class="email-list">
      <li v-for="(email, index) in emailList" :key="index" class="email-chip">
        <span>{{ email }}</span>
        <button class="chip-remove" @click="removeEmail(index)">&times;</button>
      </li>
    </ul>

    <!-- Role Selector -->
    <div class="form-group">
      <label for="role">Role</label>
      <select id="role" v-model="formData.role" class="form-input">
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <!-- Permission Preview -->
    <div class="permission-preview">
      <h4 class="preview-heading">Permission Preview</h4>
      <ul class="permission-list">
        <li v-for="perm in rolePermissions" :key="perm" class="permission-item">
          <span class="check-icon">&#10003;</span> {{ perm }}
        </li>
      </ul>
    </div>

    <!-- Send Button -->
    <div class="form-actions">
      <button
        class="btn-send"
        :disabled="emailList.length === 0 || !isValid"
        @click="sendInvitations"
      >
        Send {{ emailList.length }} Invitation{{ emailList.length !== 1 ? 's' : '' }}
      </button>
    </div>

    <!-- Success Notification -->
    <div v-if="showSuccess" class="success-notification">
      Invitations sent successfully!
    </div>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import validationMixin from '@/mixins/validationMixin'
import notificationMixin from '@/mixins/notificationMixin'

export default {
  name: 'UserInvite',

  mixins: [formMixin, validationMixin, notificationMixin],

  data() {
    return {
      emailInput: '',
      emailList: [],
      showSuccess: false,
      formData: {
        role: 'viewer'
      }
    }
  },

  computed: {
    rolePermissions() {
      const perms = {
        viewer: ['View projects', 'View tasks', 'Add comments'],
        editor: ['View projects', 'View tasks', 'Add comments', 'Edit tasks', 'Create tasks'],
        admin: ['View projects', 'View tasks', 'Add comments', 'Edit tasks', 'Create tasks', 'Manage members', 'Delete projects']
      }
      return perms[this.formData.role] || []
    }
  },

  methods: {
    addEmail() {
      const email = this.emailInput.trim()
      if (email && !this.emailList.includes(email)) {
        this.emailList.push(email)
        this.emailInput = ''
      }
    },

    removeEmail(index) {
      this.emailList.splice(index, 1)
    },

    async sendInvitations() {
      if (!this.validate()) return
      this.showSuccess = true
      this.showNotification('Invitations sent successfully!', 'success')
      this.emailList = []
      setTimeout(() => { this.showSuccess = false }, 3000)
    }
  }
}
</script>

<style scoped>
.user-invite { max-width: 560px; margin: 0 auto; padding: 1.5rem; }
.invite-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; }
.email-input-row { display: flex; gap: 0.5rem; }
.form-input {
  flex: 1; padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem;
}
.btn-add {
  padding: 0.5rem 1rem; background: #6366f1; color: white;
  border: none; border-radius: 6px; cursor: pointer;
}
.field-error { color: #ef4444; font-size: 0.75rem; }
.email-list { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
.email-chip {
  display: flex; align-items: center; gap: 0.25rem;
  background: #eff6ff; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.8rem;
}
.chip-remove { background: none; border: none; cursor: pointer; font-size: 1rem; color: #6b7280; }
.permission-preview { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; }
.preview-heading { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; }
.permission-list { list-style: none; padding: 0; }
.permission-item { font-size: 0.8rem; padding: 0.2rem 0; color: #374151; }
.check-icon { color: #22c55e; }
.btn-send {
  padding: 0.6rem 1.5rem; background: #3b82f6; color: white;
  border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem;
}
.btn-send:disabled { opacity: 0.5; cursor: default; }
.success-notification {
  margin-top: 1rem; padding: 0.75rem; background: #dcfce7;
  color: #166534; border-radius: 6px; font-size: 0.875rem; text-align: center;
}
</style>
