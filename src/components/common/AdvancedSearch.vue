<template>
  <!-- Edge case: Both searchMixin and filterMixin emit events (search-changed, filters-changed).
       Tests event migration across multiple mixins. -->
  <div class="advanced-search">
    <div class="search-section">
      <div class="search-bar">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Search across all fields..."
          @keydown.enter="search"
          @keydown.escape="clearSearch"
        />
        <button class="btn-search" @click="search" :disabled="isSearching">
          {{ isSearching ? 'Searching...' : 'Search' }}
        </button>
        <button v-if="searchQuery" class="btn-clear-search" @click="clearSearch">
          Clear
        </button>
      </div>

      <div v-if="recentSearches.length > 0" class="recent-searches">
        <span class="recent-heading">Recent:</span>
        <button
          v-for="q in recentSearches"
          :key="q"
          class="recent-tag"
          @click="searchQuery = q"
        >
          {{ q }}
        </button>
      </div>
    </div>

    <div class="filter-panel">
      <h3 class="filter-heading">
        Filters
        <span v-if="isFiltered" class="active-filter-count">{{ activeFilterCount }}</span>
      </h3>

      <div class="filter-groups">
        <div class="filter-group">
          <label>Status</label>
          <select @change="applyFilter('status', $event.target.value)">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Priority</label>
          <select @change="applyFilter('priority', $event.target.value)">
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Type</label>
          <select @change="applyFilter('type', $event.target.value)">
            <option value="">All Types</option>
            <option value="task">Task</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
          </select>
        </div>
      </div>

      <div v-if="isFiltered" class="applied-filters">
        <span class="applied-label">Active: {{ appliedFilterSummary }}</span>
        <button class="btn-clear-filters" @click="clearAllFilters">Clear All Filters</button>
      </div>
    </div>

    <div class="results-section">
      <div class="results-header" v-if="hasResults">
        <span class="results-count">{{ resultCount }} result(s) found</span>
      </div>

      <div v-if="isSearching" class="searching-state">
        <div class="spinner"></div>
        <p>Searching...</p>
      </div>

      <div v-else-if="searchResults.length > 0" class="results-list">
        <div v-for="result in paginatedResults" :key="result.id" class="result-item">
          <h4 class="result-title">{{ result.title || result.name }}</h4>
          <p class="result-description">{{ result.description }}</p>
          <div class="result-meta">
            <span v-if="result.status" class="meta-tag">{{ result.status }}</span>
            <span v-if="result.priority" class="meta-tag">{{ result.priority }}</span>
          </div>
        </div>
      </div>

      <div v-else-if="searchQuery && !isSearching" class="no-results">
        <p>No results found for "{{ searchQuery }}"</p>
      </div>
    </div>

    <div class="pagination-controls" v-if="totalPages > 1">
      <button :disabled="!hasPrevPage" @click="prevPage" class="btn-page">Previous</button>
      <div class="page-numbers">
        <button
          v-for="page in Math.min(totalPages, 5)"
          :key="page"
          class="btn-page-num"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
      <button :disabled="!hasNextPage" @click="nextPage" class="btn-page">Next</button>
    </div>
  </div>
</template>

<script>
import searchMixin from '@/mixins/searchMixin'
import filterMixin from '@/mixins/filterMixin'
import paginationMixin from '@/mixins/paginationMixin'

export default {
  name: 'AdvancedSearch',

  mixins: [searchMixin, filterMixin, paginationMixin],

  props: {
    items: {
      type: Array,
      default: () => []
    },
    searchableFields: {
      type: Array,
      default: () => ['title', 'name', 'description']
    }
  },

  data() {
    return {
      pageSize: 20
    }
  },

  computed: {
    filteredResults() {
      let results = this.searchResults.length > 0 ? this.searchResults : this.items

      if (this.activeFilters.status) {
        results = results.filter((item) => item.status === this.activeFilters.status)
      }
      if (this.activeFilters.priority) {
        results = results.filter((item) => item.priority === this.activeFilters.priority)
      }
      if (this.activeFilters.type) {
        results = results.filter((item) => item.type === this.activeFilters.type)
      }

      return results
    },

    paginatedResults() {
      this.totalItems = this.filteredResults.length
      const start = this.paginatedOffset
      return this.filteredResults.slice(start, start + this.pageSize)
    }
  },

  watch: {
    items() {
      if (this.searchQuery) {
        this.search()
      }
    }
  }
}
</script>

<style scoped>
.advanced-search {
  padding: 1.5rem;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.btn-search {
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.recent-searches {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.recent-tag {
  padding: 0.125rem 0.375rem;
  background: #f3f4f6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
}

.filter-panel {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.filter-groups {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 0.75rem;
}

.filter-group select {
  width: 100%;
  padding: 0.375rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.active-filter-count {
  background: #4f46e5;
  color: #fff;
  font-size: 0.6875rem;
  padding: 0.0625rem 0.375rem;
  border-radius: 9999px;
  margin-left: 0.25rem;
}

.result-item {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.result-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem;
}

.result-description {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
}

.result-meta {
  display: flex;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.meta-tag {
  font-size: 0.6875rem;
  padding: 0.0625rem 0.375rem;
  background: #f3f4f6;
  border-radius: 4px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.btn-page-num {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.btn-page-num.active {
  background: #4f46e5;
  color: #fff;
  border-color: #4f46e5;
}
</style>
