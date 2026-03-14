<template>
  <div class="app-search" ref="searchWrapper">
    <!-- Search Trigger -->
    <div class="search-trigger" @click="openSearch">
      <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span class="search-placeholder">Search...</span>
      <kbd class="shortcut-hint">Cmd+K</kbd>
    </div>

    <!-- Search Modal -->
    <div v-if="isSearchOpen" class="search-overlay" @click.self="closeSearch">
      <div class="search-modal">
        <!-- Search Input -->
        <div class="search-input-wrapper">
          <svg class="search-icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Search pages, tasks, projects..."
            class="search-input"
            @keydown.escape="closeSearch"
            @keydown.down.prevent="navigateDown"
            @keydown.up.prevent="navigateUp"
            @keydown.enter.prevent="selectHighlighted"
          />
        </div>

        <!-- Results -->
        <div v-if="searchQuery && searchResults.length > 0" class="search-results">
          <div v-for="(category, catIdx) in groupedResults" :key="catIdx" class="result-category">
            <h4 class="category-label">{{ category.name }}</h4>
            <ul class="result-list">
              <li
                v-for="(result, rIdx) in category.items"
                :key="result.id"
                :class="['result-item', { highlighted: isHighlighted(catIdx, rIdx) }]"
                @click="selectResult(result)"
                @mouseenter="setHighlight(catIdx, rIdx)"
              >
                <span class="result-title">{{ result.title }}</span>
                <span class="result-meta">{{ result.meta }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="searchQuery" class="no-results">
          <p>No results for "{{ searchQuery }}"</p>
        </div>

        <!-- Footer -->
        <div class="search-footer">
          <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span>
          <span><kbd>Enter</kbd> Select</span>
          <span><kbd>Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchMixin from '@/mixins/searchMixin'
import keyboardShortcutMixin from '@/mixins/keyboardShortcutMixin'

export default {
  name: 'AppSearch',

  mixins: [searchMixin, keyboardShortcutMixin],

  data() {
    return {
      isSearchOpen: false,
      highlightCat: 0,
      highlightIdx: 0
    }
  },

  computed: {
    groupedResults() {
      if (!this.searchResults || this.searchResults.length === 0) return []
      const groups = {}
      this.searchResults.forEach(r => {
        const cat = r.category || 'General'
        if (!groups[cat]) groups[cat] = { name: cat, items: [] }
        groups[cat].items.push(r)
      })
      return Object.values(groups)
    }
  },

  methods: {
    openSearch() {
      this.isSearchOpen = true
      this.$nextTick(() => { this.$refs.searchInput?.focus() })
    },

    closeSearch() {
      this.isSearchOpen = false
      this.searchQuery = ''
    },

    isHighlighted(catIdx, rIdx) {
      return this.highlightCat === catIdx && this.highlightIdx === rIdx
    },

    setHighlight(catIdx, rIdx) {
      this.highlightCat = catIdx
      this.highlightIdx = rIdx
    },

    navigateDown() { this.highlightIdx++ },
    navigateUp() { if (this.highlightIdx > 0) this.highlightIdx-- },

    selectHighlighted() {
      const cat = this.groupedResults[this.highlightCat]
      if (cat && cat.items[this.highlightIdx]) {
        this.selectResult(cat.items[this.highlightIdx])
      }
    },

    selectResult(result) {
      this.$emit('result-selected', result)
      this.closeSearch()
    }
  },

  mounted() {
    this.registerShortcut?.('mod+k', () => this.openSearch())
  }
}
</script>

<style scoped>
.search-trigger {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.4rem 0.75rem; background: #f3f4f6; border: 1px solid #e5e7eb;
  border-radius: 8px; cursor: pointer; font-size: 0.8rem; color: #9ca3af;
}
.search-trigger:hover { border-color: #d1d5db; }
.shortcut-hint {
  font-size: 0.65rem; padding: 1px 4px; background: #e5e7eb;
  border-radius: 3px; font-family: monospace;
}
.search-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; justify-content: center; padding-top: 15vh; z-index: 50;
}
.search-modal {
  background: white; border-radius: 12px; width: 100%; max-width: 560px;
  max-height: 480px; display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.search-input-wrapper {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb;
}
.search-input {
  flex: 1; border: none; outline: none; font-size: 1rem;
}
.search-results { flex: 1; overflow-y: auto; padding: 0.5rem 0; }
.category-label { font-size: 0.7rem; color: #9ca3af; padding: 0.25rem 1rem; text-transform: uppercase; }
.result-list { list-style: none; padding: 0; margin: 0; }
.result-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;
}
.result-item.highlighted { background: #eff6ff; }
.result-title { color: #374151; }
.result-meta { font-size: 0.75rem; color: #9ca3af; }
.no-results { padding: 2rem; text-align: center; color: #9ca3af; font-size: 0.875rem; }
.search-footer {
  display: flex; gap: 1rem; padding: 0.5rem 1rem; border-top: 1px solid #e5e7eb;
  font-size: 0.7rem; color: #9ca3af;
}
.search-footer kbd {
  padding: 1px 4px; background: #f3f4f6; border: 1px solid #e5e7eb;
  border-radius: 3px; font-family: monospace;
}
</style>
