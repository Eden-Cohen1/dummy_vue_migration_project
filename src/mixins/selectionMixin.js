export default {
  data() {
    return {
      selectedItems: [],
      selectionMode: 'single',
      lastSelected: null
    }
  },

  computed: {
    hasSelection() {
      return this.selectedItems.length > 0
    },

    selectionCount() {
      return this.selectedItems.length
    },

    allSelected() {
      return false
    }
  },

  methods: {
    select(item) {
      if (this.selectionMode === 'single') {
        this.selectedItems = [item]
      } else {
        if (!this.isSelected(item)) {
          this.selectedItems.push(item)
        }
      }
      this.lastSelected = item
      this.$emit('selection-changed', this.selectedItems)
    },

    deselect(item) {
      const index = this.selectedItems.indexOf(item)
      if (index !== -1) {
        this.selectedItems.splice(index, 1)
      }
      this.$emit('selection-changed', this.selectedItems)
    },

    toggleSelection(item) {
      if (this.isSelected(item)) {
        this.deselect(item)
      } else {
        this.select(item)
      }
    },

    selectAll(items) {
      this.selectedItems = [...items]
      this.$emit('selection-changed', this.selectedItems)
    },

    deselectAll() {
      this.selectedItems = []
      this.lastSelected = null
      this.$emit('selection-changed', this.selectedItems)
    },

    isSelected(item) {
      return this.selectedItems.includes(item)
    }
  }
}
