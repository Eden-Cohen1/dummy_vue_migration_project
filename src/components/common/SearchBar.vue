<template>
  <div class="relative w-full max-w-md">
    <!-- Search input -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        @focus="showResults = true"
        @keydown.escape="clearAndClose"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Loading indicator -->
    <div v-if="isSearching" class="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg p-3 z-40">
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <svg class="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        Searching...
      </div>
    </div>

    <!-- Search results dropdown -->
    <div
      v-else-if="showResults && searchQuery && hasResults"
      class="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto z-40"
    >
      <div class="p-2 text-xs text-gray-400 border-b">
        {{ resultCount }} result(s) found
      </div>
      <ul>
        <li
          v-for="(result, index) in searchResults"
          :key="index"
          class="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
          @click="selectResult(result)"
        >
          <slot name="result" :item="result">
            {{ typeof result === 'object' ? result.name || result.label || JSON.stringify(result) : result }}
          </slot>
        </li>
      </ul>
    </div>

    <!-- No results -->
    <div
      v-else-if="showResults && searchQuery && !hasResults && !isSearching"
      class="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg p-4 z-40"
    >
      <p class="text-sm text-gray-500 text-center">No results found for "{{ searchQuery }}"</p>
    </div>

    <!-- Recent searches -->
    <div
      v-if="showResults && !searchQuery && recentSearches.length > 0"
      class="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-40"
    >
      <div class="p-2 text-xs text-gray-400 border-b">Recent searches</div>
      <ul>
        <li
          v-for="(recent, index) in recentSearches"
          :key="index"
          class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
          @click="searchQuery = recent"
        >
          <svg class="h-3 w-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ recent }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import searchMixin from '@/mixins/searchMixin'

export default {
  name: 'SearchBar',

  mixins: [searchMixin],

  props: {
    placeholder: {
      type: String,
      default: 'Search...'
    },
    items: {
      type: Array,
      default: () => []
    }
  },

  emits: ['search-results'],

  data() {
    return {
      showResults: false
    }
  },

  watch: {
    searchResults(newResults) {
      this.$emit('search-results', newResults)
    }
  },

  methods: {
    focusInput() {
      this.$refs.searchInput.focus()
    },

    selectResult(result) {
      this.showResults = false
      this.$emit('search-results', [result])
    },

    clearAndClose() {
      this.clearSearch()
      this.showResults = false
    }
  },

  mounted() {
    document.addEventListener('click', this._handleOutsideClick = (e) => {
      if (!this.$el.contains(e.target)) {
        this.showResults = false
      }
    })
  },

  beforeUnmount() {
    document.removeEventListener('click', this._handleOutsideClick)
  }
}
</script>
