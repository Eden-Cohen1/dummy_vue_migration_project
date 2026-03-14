<template>
  <div class="team-overview">
    <h3 class="section-title">Team Overview</h3>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading team data...</p>
    </div>

    <!-- Team Grid -->
    <div v-else class="team-grid">
      <div v-for="member in members" :key="member.id" class="member-card">
        <!-- Avatar -->
        <div class="member-avatar">
          <img
            v-if="member.avatar"
            :src="member.avatar"
            :alt="member.name"
            class="avatar-img"
          />
          <span v-else class="avatar-initials">{{ getInitials(member.name) }}</span>
          <span :class="['status-dot', member.status]"></span>
        </div>

        <!-- Info -->
        <div class="member-info">
          <h4 class="member-name">{{ member.name }}</h4>
          <span class="member-role">{{ member.role }}</span>
          <span :class="['status-text', member.status]">
            {{ member.status === 'online' ? 'Online' : member.status === 'away' ? 'Away' : 'Offline' }}
          </span>
        </div>

        <!-- Contact Button (Permission Gated) -->
        <button
          v-if="canEdit"
          class="btn-contact"
          @click="$emit('contact', member)"
        >
          Contact
        </button>
      </div>
    </div>

    <div v-if="!isLoading && members.length === 0" class="empty-state">
      <p>No team members found.</p>
    </div>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'
import permissionMixin from '@/mixins/permissionMixin'

export default {
  name: 'TeamOverview',

  mixins: [loadingMixin, permissionMixin],

  props: {
    members: {
      type: Array,
      default: () => []
    }
  },

  emits: ['contact'],

  methods: {
    getInitials(name) {
      if (!name) return '?'
      return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    }
  }
}
</script>

<style scoped>
.team-overview { padding: 1rem; }
.section-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; }
.team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
.member-card {
  display: flex; flex-direction: column; align-items: center;
  padding: 1.25rem; background: white; border: 1px solid #e5e7eb; border-radius: 8px;
  text-align: center;
}
.member-avatar { position: relative; margin-bottom: 0.75rem; }
.avatar-img { width: 3.5rem; height: 3.5rem; border-radius: 50%; object-fit: cover; }
.avatar-initials {
  display: flex; align-items: center; justify-content: center;
  width: 3.5rem; height: 3.5rem; border-radius: 50%;
  background: #6366f1; color: white; font-weight: 600; font-size: 1rem;
}
.status-dot {
  position: absolute; bottom: 2px; right: 2px;
  width: 0.75rem; height: 0.75rem; border-radius: 50%;
  border: 2px solid white;
}
.status-dot.online { background: #22c55e; }
.status-dot.away { background: #f59e0b; }
.status-dot.offline { background: #9ca3af; }
.member-name { font-size: 0.9rem; font-weight: 600; margin: 0 0 0.2rem; }
.member-role { font-size: 0.75rem; color: #6b7280; display: block; margin-bottom: 0.2rem; }
.status-text { font-size: 0.7rem; text-transform: capitalize; }
.status-text.online { color: #22c55e; }
.status-text.away { color: #f59e0b; }
.status-text.offline { color: #9ca3af; }
.btn-contact {
  margin-top: 0.75rem; padding: 0.35rem 1rem;
  background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe;
  border-radius: 6px; cursor: pointer; font-size: 0.8rem;
}
.btn-contact:hover { background: #dbeafe; }
.loading-state { text-align: center; padding: 2rem; color: #6b7280; }
.empty-state { text-align: center; padding: 2rem; color: #9ca3af; font-size: 0.875rem; }
.spinner {
  width: 2rem; height: 2rem; margin: 0 auto 0.5rem;
  border: 3px solid #e5e7eb; border-top-color: #3b82f6;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
