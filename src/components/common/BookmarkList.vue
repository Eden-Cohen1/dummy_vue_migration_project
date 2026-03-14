<template>
  <div class="bookmark-list">
    <div class="bookmark-header">
      <h3 class="bookmark-title">Bookmarks</h3>
      <div class="sort-controls">
        <label class="sort-label">Sort by</label>
        <select v-model="sortField" class="sort-select" @change="sortBookmarks">
          <option value="date">Date Added</option>
          <option value="title">Title</option>
          <option value="url">URL</option>
        </select>
        <button class="sort-dir-btn" @click="toggleSortDirection">
          {{ sortDirection === 'asc' ? '&#9650;' : '&#9660;' }}
        </button>
      </div>
    </div>

    <!-- Bookmark Cards -->
    <div v-if="paginatedItems.length > 0" class="bookmark-grid">
      <div v-for="bookmark in paginatedItems" :key="bookmark.id" class="bookmark-card">
        <div class="bookmark-info">
          <h4 class="bookmark-name">{{ bookmark.title }}</h4>
          <a :href="bookmark.url" class="bookmark-url" target="_blank" rel="noopener">
            {{ bookmark.url }}
          </a>
          <span class="bookmark-date">Added {{ bookmark.dateAdded }}</span>
        </div>
        <button class="btn-remove" title="Remove bookmark" @click="removeBookmark(bookmark.id)">
          &times;
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p class="empty-title">No bookmarks yet</p>
      <p class="empty-subtitle">Save your favorite pages here for quick access.</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination-bar">
      <button :disabled="currentPage <= 1" @click="prevPage">Prev</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage >= totalPages" @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script>
import bookmarkMixin from '@/mixins/bookmarkMixin'
import paginationMixin from '@/mixins/paginationMixin'

export default {
  name: 'BookmarkList',

  mixins: [bookmarkMixin, paginationMixin],

  data() {
    return {
      sortField: 'date',
      sortDirection: 'desc'
    }
  },

  methods: {
    toggleSortDirection() {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      this.sortBookmarks()
    },

    sortBookmarks() {
      // Stub: relies on bookmarkMixin data
    },

    removeBookmark(id) {
      if (this.deleteBookmark) {
        this.deleteBookmark(id)
      }
    }
  }
}
</script>

<style scoped>
.bookmark-list { max-width: 720px; margin: 0 auto; }
.bookmark-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.bookmark-title { font-size: 1.125rem; font-weight: 600; }
.sort-controls { display: flex; align-items: center; gap: 0.5rem; }
.sort-label { font-size: 0.75rem; color: #6b7280; }
.sort-select { padding: 0.3rem 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.8rem; }
.sort-dir-btn { background: none; border: 1px solid #d1d5db; border-radius: 4px; cursor: pointer; padding: 0.2rem 0.4rem; }
.bookmark-grid { display: flex; flex-direction: column; gap: 0.5rem; }
.bookmark-card {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 0.75rem 1rem; background: white; border: 1px solid #e5e7eb; border-radius: 8px;
}
.bookmark-name { font-size: 0.9rem; font-weight: 600; margin: 0 0 0.25rem; }
.bookmark-url { font-size: 0.8rem; color: #3b82f6; text-decoration: none; display: block; margin-bottom: 0.2rem; }
.bookmark-url:hover { text-decoration: underline; }
.bookmark-date { font-size: 0.7rem; color: #9ca3af; }
.btn-remove {
  background: none; border: none; font-size: 1.25rem; color: #9ca3af;
  cursor: pointer; padding: 0 0.25rem; line-height: 1;
}
.btn-remove:hover { color: #ef4444; }
.empty-state { text-align: center; padding: 3rem 1rem; color: #6b7280; }
.empty-title { font-weight: 600; }
.empty-subtitle { font-size: 0.875rem; }
.pagination-bar {
  display: flex; justify-content: center; align-items: center;
  gap: 1rem; margin-top: 1rem; padding: 0.5rem;
}
.pagination-bar button {
  padding: 0.35rem 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;
  background: white; cursor: pointer; font-size: 0.8rem;
}
.pagination-bar button:disabled { opacity: 0.4; cursor: default; }
</style>
