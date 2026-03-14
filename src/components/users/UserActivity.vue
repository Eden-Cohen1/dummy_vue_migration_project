<template>
  <div class="user-activity">
    <!-- Filter Bar -->
    <div class="filter-bar">
      <select v-model="activeFilter" class="filter-select" @change="applyFilters">
        <option value="all">All Activity</option>
        <option value="comments">Comments</option>
        <option value="updates">Updates</option>
        <option value="mentions">Mentions</option>
      </select>
      <input
        v-model="filterText"
        type="text"
        placeholder="Filter activity..."
        class="filter-input"
        @input="applyFilters"
      />
      <span class="result-count">{{ filteredItems.length }} activities</span>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading activity feed...</p>
    </div>

    <!-- Activity Stream -->
    <ul v-else-if="filteredItems.length > 0" class="activity-stream">
      <li v-for="item in paginatedItems" :key="item.id" class="activity-item">
        <div class="activity-icon" :class="'icon-' + item.type">
          <span v-if="item.type === 'comment'">💬</span>
          <span v-else-if="item.type === 'update'">📝</span>
          <span v-else-if="item.type === 'mention'">@</span>
          <span v-else>📌</span>
        </div>
        <div class="activity-content">
          <p class="activity-text">
            <strong>{{ item.user }}</strong> {{ item.description }}
          </p>
          <span class="activity-time">{{ item.timestamp }}</span>
        </div>
      </li>
    </ul>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p class="empty-title">No activity found</p>
      <p class="empty-subtitle">There is no activity matching your filters.</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination-bar">
      <button :disabled="currentPage <= 1" @click="prevPage">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage >= totalPages" @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'
import paginationMixin from '@/mixins/paginationMixin'
import filterMixin from '@/mixins/filterMixin'

export default {
  name: 'UserActivity',

  mixins: [loadingMixin, paginationMixin, filterMixin],

  props: {
    userId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      activities: [],
      activeFilter: 'all'
    }
  },

  created() {
    this.loadActivities()
  },

  methods: {
    async loadActivities() {
      this.startLoading('Loading activity...')
      try {
        // Simulated fetch
        this.activities = []
        this.stopLoading()
      } catch (err) {
        this.setError(err.message || 'Failed to load activities')
      }
    }
  }
}
</script>

<style scoped>
.user-activity {
  max-width: 720px;
  margin: 0 auto;
}
.filter-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.filter-select, .filter-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}
.filter-input { flex: 1; }
.result-count { font-size: 0.75rem; color: #6b7280; }
.activity-stream { list-style: none; padding: 0; }
.activity-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}
.activity-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #eff6ff;
  font-size: 0.875rem;
}
.activity-text { margin: 0; font-size: 0.875rem; }
.activity-time { font-size: 0.75rem; color: #9ca3af; }
.empty-state { text-align: center; padding: 3rem 1rem; color: #6b7280; }
.empty-title { font-size: 1rem; font-weight: 600; }
.empty-subtitle { font-size: 0.875rem; }
.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.75rem;
}
.pagination-bar button {
  padding: 0.4rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}
.pagination-bar button:disabled { opacity: 0.4; cursor: default; }
.loading-state { text-align: center; padding: 2rem; color: #6b7280; }
.spinner {
  width: 2rem; height: 2rem; margin: 0 auto 0.5rem;
  border: 3px solid #e5e7eb; border-top-color: #3b82f6;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
