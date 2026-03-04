import sortMixin from './sortMixin'
import paginationMixin from './paginationMixin'

export default {
  mixins: [sortMixin('name'), paginationMixin],

  data() {
    return {
      rows: [],
      columns: [],
      sortField: '',
      sortDirection: 'asc',
      expandedRows: []
    }
  },

  computed: {
    sortedRows() {
      if (!this.sortField) return this.rows

      return [...this.rows].sort((a, b) => {
        const valA = a[this.sortField]
        const valB = b[this.sortField]

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1
        return 0
      })
    },

    visibleColumns() {
      return this.columns.filter((c) => !c.hidden)
    },

    hasExpandedRows() {
      return this.expandedRows.length > 0
    }
  },

  methods: {
    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortDirection = 'asc'
      }
    },

    toggleRow(id) {
      const index = this.expandedRows.indexOf(id)
      if (index === -1) {
        this.expandedRows.push(id)
      } else {
        this.expandedRows.splice(index, 1)
      }
    },

    collapseAll() {
      this.expandedRows = []
    },

    getColumnClass(col) {
      const container = this.$refs.tableContainer
      const el = this.$el.querySelector(`[data-col="${col.key}"]`)
      const classes = ['table-col']

      if (col.align) classes.push(`text-${col.align}`)
      if (col.sortable) classes.push('sortable')
      if (container && el) classes.push('rendered')

      return classes.join(' ')
    }
  }
}
