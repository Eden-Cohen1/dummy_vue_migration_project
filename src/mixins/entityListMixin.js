// Edge case: Left branch of diamond dependency — extends crudMixin and redefines
// isLoading in data(). When combined with entityDetailMixin in a component, the
// diamond pattern means crudMixin's members should not be duplicated.
import crudMixin from '@/mixins/crudMixin'

export default {
  mixins: [crudMixin],

  data() {
    return {
      isLoading: false,
      listView: 'grid',
      sortConfig: { field: 'name', direction: 'asc' },
      selectedFilters: {}
    }
  },

  computed: {
    displayedItems() {
      let result = [...this.items]
      if (this.sortConfig.field) {
        result.sort((a, b) => {
          const val = a[this.sortConfig.field] > b[this.sortConfig.field] ? 1 : -1
          return this.sortConfig.direction === 'asc' ? val : -val
        })
      }
      return result
    },

    isGridView() {
      return this.listView === 'grid'
    }
  },

  methods: {
    refreshList(endpoint) {
      this.fetchAll(endpoint)
    },

    applyListSort(field, direction = 'asc') {
      this.sortConfig = { field, direction }
    },

    toggleView() {
      this.listView = this.listView === 'grid' ? 'table' : 'grid'
    }
  }
}
