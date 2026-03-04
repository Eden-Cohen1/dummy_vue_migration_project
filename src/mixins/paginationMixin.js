export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalItems: 0
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize)
    },

    hasPrevPage() {
      return this.currentPage > 1
    },

    hasNextPage() {
      return this.currentPage < this.totalPages
    },

    paginatedOffset() {
      return (this.currentPage - 1) * this.pageSize
    }
  },

  methods: {
    nextPage() {
      if (this.hasNextPage) {
        this.currentPage++
      }
    },

    prevPage() {
      if (this.hasPrevPage) {
        this.currentPage--
      }
    },

    goToPage(n) {
      if (n >= 1 && n <= this.totalPages) {
        this.currentPage = n
      }
    },

    changePageSize(size) {
      this.pageSize = size
      this.currentPage = 1
    }
  }
}
