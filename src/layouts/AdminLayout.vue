<template>
  <!-- Edge case: Layout component outside standard component directories.
       Uses authMixin + permissionMixin + themeMixin. Tests mixin detection
       in non-standard file locations. -->
  <div class="admin-layout" :class="themeClass">
    <header class="admin-header">
      <h1>Admin Panel</h1>
      <div class="user-section" v-if="isAuthenticated">
        <span>{{ userDisplayName }}</span>
        <span v-if="isAdmin" class="admin-badge">Admin</span>
        <button @click="logout">Logout</button>
      </div>
    </header>

    <nav class="admin-nav" v-if="canEdit">
      <a href="/admin/users">Users</a>
      <a href="/admin/settings">Settings</a>
      <a v-if="canDelete" href="/admin/danger-zone">Danger Zone</a>
    </nav>

    <main class="admin-content">
      <slot></slot>
    </main>

    <footer class="admin-footer">
      <p>Theme: {{ currentTheme }} | {{ isDarkMode ? 'Dark' : 'Light' }} mode</p>
      <button @click="toggleDarkMode">Toggle Theme</button>
    </footer>
  </div>
</template>

<script>
import authMixin from '@/mixins/authMixin'
import permissionMixin from '@/mixins/permissionMixin'
import themeMixin from '@/mixins/themeMixin'

export default {
  name: 'AdminLayout',
  mixins: [authMixin, permissionMixin, themeMixin],

  created() {
    if (!this.isAuthenticated) {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #2c3e50;
  color: white;
}
.admin-badge {
  background: #e74c3c;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}
.admin-nav {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 2rem;
  background: #34495e;
}
.admin-nav a {
  color: #ecf0f1;
  text-decoration: none;
}
.admin-content {
  flex: 1;
  padding: 2rem;
}
.admin-footer {
  padding: 1rem 2rem;
  background: #ecf0f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
