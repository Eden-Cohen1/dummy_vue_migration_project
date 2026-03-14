<template>
  <!-- Edge case: 4 unrelated mixins composability. Tests that the tool handles mixins
       with no overlapping members correctly. -->
  <div class="notification-center">
    <div class="center-header">
      <h2 class="center-title">
        Notifications
        <span v-if="hasUnread" class="unread-badge">{{ unreadCount }}</span>
      </h2>
      <div class="center-actions">
        <button v-if="hasUnread" class="btn-mark-all" @click="markAllRead">
          Mark All Read
        </button>
        <button v-if="notifications.length > 0" class="btn-clear-all" @click="clearAll">
          Clear All
        </button>
      </div>
    </div>

    <div class="center-toolbar">
      <div class="search-section">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Search notifications..."
        />
        <div v-if="recentSearches.length > 0" class="recent-searches">
          <span class="recent-label">Recent:</span>
          <button
            v-for="q in recentSearches"
            :key="q"
            class="recent-search-tag"
            @click="searchQuery = q"
          >
            {{ q }}
          </button>
        </div>
      </div>

      <div class="filter-section">
        <div class="filter-chips">
          <button
            v-for="type in ['all', 'success', 'warning', 'error', 'info']"
            :key="type"
            class="filter-chip"
            :class="{ active: activeFilters.type === type || (type === 'all' && !activeFilters.type) }"
            @click="type === 'all' ? removeFilter('type') : applyFilter('type', type)"
          >
            {{ type }}
          </button>
        </div>
        <span v-if="isFiltered" class="filter-summary">
          Filtered by: {{ appliedFilterSummary }}
          <button class="btn-clear-filters" @click="clearAllFilters">&times;</button>
        </span>
      </div>
    </div>

    <div class="notification-list">
      <div v-if="paginatedNotifications.length === 0" class="empty-state">
        <p v-if="isSearching">Searching...</p>
        <p v-else-if="searchQuery || isFiltered">No notifications match your criteria</p>
        <p v-else>No notifications yet</p>
      </div>

      <div
        v-for="notification in paginatedNotifications"
        :key="notification.id"
        class="notification-card"
        :class="{ unread: !notification.read, ['type-' + notification.type]: true }"
        @click="markAsRead(notification.id)"
      >
        <div class="notification-content">
          <p class="notification-message">{{ notification.message }}</p>
          <span class="notification-time">{{ notification.timeLabel }}</span>
        </div>
        <button class="btn-dismiss" @click.stop="removeNotification(notification.id)">&times;</button>
      </div>
    </div>

    <div class="pagination-bar" v-if="totalPages > 1">
      <button class="btn-page" :disabled="!hasPrevPage" @click="prevPage">Previous</button>
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="btn-page" :disabled="!hasNextPage" @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script>
import notificationMixin from '@/mixins/notificationMixin'
import filterMixin from '@/mixins/filterMixin'
import searchMixin from '@/mixins/searchMixin'
import paginationMixin from '@/mixins/paginationMixin'

export default {
  name: 'NotificationCenter',

  mixins: [notificationMixin, filterMixin, searchMixin, paginationMixin],

  data() {
    return {
      pageSize: 15
    }
  },

  computed: {
    filteredNotifications() {
      let result = this.formattedNotifications

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter((n) => n.message.toLowerCase().includes(query))
      }

      if (this.activeFilters.type) {
        result = result.filter((n) => n.type === this.activeFilters.type)
      }

      return result
    },

    paginatedNotifications() {
      this.totalItems = this.filteredNotifications.length
      const start = this.paginatedOffset
      return this.filteredNotifications.slice(start, start + this.pageSize)
    }
  },

  async created() {
    await this.fetchNotifications()
  },

  methods: {
    async fetchNotifications() {
      // userId would come from auth store in production
      await this.fetchNotifications('current-user')
    }
  }
}
</script>

<style scoped>
.notification-center {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem;
}

.center-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.unread-badge {
  background: #ef4444;
  color: #fff;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  margin-left: 0.5rem;
}

.center-toolbar {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.filter-chips {
  display: flex;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
}

.filter-chip {
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  background: #fff;
  cursor: pointer;
  text-transform: capitalize;
}

.filter-chip.active {
  background: #4f46e5;
  color: #fff;
  border-color: #4f46e5;
}

.notification-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background 0.15s;
}

.notification-card.unread {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.notification-card:hover {
  background: #f9fafb;
}

.notification-message {
  font-size: 0.875rem;
  color: #111827;
  margin: 0;
}

.notification-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
</style>
