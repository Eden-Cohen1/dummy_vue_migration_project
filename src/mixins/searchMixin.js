export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      isSearching: false,
      searchHistory: []
    }
  },

  computed: {
    hasResults() {
      return this.searchResults.length > 0
    },

    resultCount() {
      return this.searchResults.length
    },

    recentSearches() {
      return this.searchHistory.slice(-5).reverse()
    }
  },

  methods: {
    search() {
      this.isSearching = true

      try {
        this.$refs.searchInput.focus()
      } catch (e) {
        // searchInput ref may not be available
      }

      if (!this.searchQuery.trim()) {
        this.searchResults = []
        this.isSearching = false
        return
      }

      this.addToHistory(this.searchQuery)

      const query = this.searchQuery.toLowerCase()
      this.searchResults = (this.items || []).filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(query)
      })

      this.isSearching = false
    },

    clearSearch() {
      this.searchQuery = ''
      this.searchResults = []
    },

    addToHistory(query) {
      if (query && !this.searchHistory.includes(query)) {
        this.searchHistory.push(query)
      }
    }
  },

  watch: {
    searchQuery(newVal) {
      if (this._searchTimeout) {
        clearTimeout(this._searchTimeout)
      }
      this._searchTimeout = setTimeout(() => {
        this.search()
      }, 300)
    }
  }
}
