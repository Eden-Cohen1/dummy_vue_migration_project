// Edge case: Expand/collapse sections with section-level tracking.
// Tests migration of methods that toggle items in an array and
// computed properties derived from array membership checks.
export default {
  data() {
    return {
      isCollapsed: false,
      collapsedSections: [],
      animationDuration: 300
    }
  },

  computed: {
    isFullyCollapsed() {
      if (this.collapsedSections.length === 0) return this.isCollapsed
      return this.collapsedSections.length > 0 &&
        this._allSectionIds &&
        this.collapsedSections.length >= this._allSectionIds.length
    },

    collapsedCount() {
      return this.collapsedSections.length
    },

    expandedCount() {
      const total = this._allSectionIds ? this._allSectionIds.length : 0
      return total - this.collapsedSections.length
    }
  },

  methods: {
    toggleCollapse(sectionId) {
      if (!sectionId) {
        this.isCollapsed = !this.isCollapsed
        this.$emit('collapse-toggled', this.isCollapsed)
        return
      }

      const index = this.collapsedSections.indexOf(sectionId)
      if (index === -1) {
        this.collapsedSections.push(sectionId)
      } else {
        this.collapsedSections.splice(index, 1)
      }
      this.$emit('section-toggled', {
        sectionId,
        isCollapsed: index === -1
      })
    },

    expandAll() {
      this.collapsedSections = []
      this.isCollapsed = false
      this.$emit('all-expanded')
    },

    collapseAll() {
      if (this._allSectionIds) {
        this.collapsedSections = [...this._allSectionIds]
      }
      this.isCollapsed = true
      this.$emit('all-collapsed')
    },

    isExpanded(sectionId) {
      return !this.collapsedSections.includes(sectionId)
    }
  },

  created() {
    // Components using this mixin should set this._allSectionIds
    // to an array of all section identifiers for expandAll/collapseAll
    this._allSectionIds = this._allSectionIds || []
  }
}
