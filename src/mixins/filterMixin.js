export default {
  data() {
    return {
      filters: {},
      activeFilters: {},
      filterOptions: {}
    }
  },

  computed: {
    activeFilterCount() {
      return Object.keys(this.activeFilters).length
    },

    isFiltered() {
      return this.activeFilterCount > 0
    },

    appliedFilterSummary() {
      return Object.keys(this.activeFilters).join(', ')
    }
  },

  methods: {
    applyFilter(key, value) {
      this.activeFilters = { ...this.activeFilters, [key]: value }
    },

    removeFilter(key) {
      const { [key]: _, ...remaining } = this.activeFilters
      this.activeFilters = remaining
    },

    clearAllFilters() {
      this.activeFilters = {}
    },

    getFilterOptions(key) {
      return this.filterOptions[key] || []
    }
  },

  watch: {
    activeFilters: {
      deep: true,
      handler(newFilters) {
        this.$emit('filters-changed', newFilters)
      }
    }
  }
}
