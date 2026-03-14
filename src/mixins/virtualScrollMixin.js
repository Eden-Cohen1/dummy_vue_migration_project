// Edge case: Virtual scrolling for large lists with calculated visible range.
// Tests migration of performance-sensitive computed properties that derive
// visible slices from scroll position and methods handling scroll events.
export default {
  data() {
    return {
      visibleRange: { start: 0, end: 50 },
      itemHeight: 40,
      containerHeight: 600,
      scrollTop: 0,
      totalItems: 0
    }
  },

  computed: {
    visibleItems() {
      const items = this.allItems || []
      return items.slice(this.visibleRange.start, this.visibleRange.end)
    },

    totalHeight() {
      return this.itemHeight * this.totalItems
    },

    offsetY() {
      return this.visibleRange.start * this.itemHeight
    },

    bufferSize() {
      return Math.ceil(this.containerHeight / this.itemHeight)
    }
  },

  methods: {
    updateVisibleRange() {
      const buffer = Math.floor(this.bufferSize / 2)
      const startIndex = Math.floor(this.scrollTop / this.itemHeight)
      const visibleCount = Math.ceil(this.containerHeight / this.itemHeight)

      const start = Math.max(0, startIndex - buffer)
      const end = Math.min(this.totalItems, startIndex + visibleCount + buffer)

      this.visibleRange = { start, end }
    },

    scrollToIndex(index) {
      if (index < 0 || index >= this.totalItems) return

      const targetScroll = index * this.itemHeight
      this.scrollTop = targetScroll

      if (this.$refs.scrollContainer) {
        this.$refs.scrollContainer.scrollTop = targetScroll
      }

      this.updateVisibleRange()
    },

    recalculate() {
      const items = this.allItems || []
      this.totalItems = items.length

      if (this.$refs.scrollContainer) {
        this.containerHeight = this.$refs.scrollContainer.clientHeight || 600
      }

      this.updateVisibleRange()
    },

    handleVirtualScroll(event) {
      this.scrollTop = event.target.scrollTop
      this.updateVisibleRange()
    }
  },

  mounted() {
    this.recalculate()
  },

  updated() {
    const items = this.allItems || []
    if (items.length !== this.totalItems) {
      this.recalculate()
    }
  }
}
