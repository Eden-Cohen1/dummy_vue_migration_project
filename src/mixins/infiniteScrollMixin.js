// Edge case: Lifecycle hooks mounted/beforeUnmount with DOM event listeners
export default {
  data() {
    return {
      scrollThreshold: 200,
      isLoadingMore: false,
      hasMoreItems: true,
      scrollContainer: null,
      currentPage: 1,
      itemsPerPage: 20
    }
  },

  computed: {
    canLoadMore() {
      return this.hasMoreItems && !this.isLoadingMore
    }
  },

  methods: {
    loadMore() {
      if (!this.canLoadMore) {
        return Promise.resolve()
      }

      this.isLoadingMore = true
      this.currentPage += 1

      return this.$nextTick().then(() => {
        this.$emit('load-more', {
          page: this.currentPage,
          perPage: this.itemsPerPage
        })

        setTimeout(() => {
          this.isLoadingMore = false
        }, 300)
      })
    },

    handleScroll(event) {
      const target = event.target || this.scrollContainer
      if (!target) return

      const scrollTop = target.scrollTop
      const scrollHeight = target.scrollHeight
      const clientHeight = target.clientHeight
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight

      if (distanceFromBottom <= this.scrollThreshold && this.canLoadMore) {
        this.loadMore()
      }
    },

    resetScroll() {
      this.currentPage = 1
      this.hasMoreItems = true
      this.isLoadingMore = false

      if (this.scrollContainer) {
        this.scrollContainer.scrollTop = 0
      }
    }
  },

  mounted() {
    this.scrollContainer = this.$refs.scrollContainer || this.$el
    if (this.scrollContainer) {
      this.scrollContainer.addEventListener('scroll', this.handleScroll, { passive: true })
    }
  },

  beforeUnmount() {
    if (this.scrollContainer) {
      this.scrollContainer.removeEventListener('scroll', this.handleScroll)
      this.scrollContainer = null
    }
  }
}
