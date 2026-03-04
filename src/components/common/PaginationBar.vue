<template>
  <nav class="flex items-center justify-between bg-white px-4 py-3 border rounded-lg shadow-sm">
    <!-- Results info -->
    <div class="text-sm text-gray-600">
      Showing
      <span class="font-medium">{{ rangeStart }}</span>
      to
      <span class="font-medium">{{ rangeEnd }}</span>
      of
      <span class="font-medium">{{ total }}</span>
      results
    </div>

    <!-- Navigation controls -->
    <div class="flex items-center gap-1">
      <!-- Previous button -->
      <button
        @click="goPrev"
        :disabled="!hasPrevPage"
        class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>

      <!-- Page numbers -->
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :class="[
          'relative inline-flex items-center px-4 py-2 text-sm font-medium border',
          page === currentPage
            ? 'bg-blue-600 text-white border-blue-600 z-10'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        ]"
      >
        {{ page }}
      </button>

      <!-- Ellipsis if needed -->
      <span
        v-if="totalPages > 7 && currentPage < totalPages - 2"
        class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300"
      >
        ...
      </span>

      <!-- Next button -->
      <button
        @click="goNext"
        :disabled="!hasNextPage"
        class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Page size selector -->
    <div class="flex items-center gap-2">
      <label class="text-sm text-gray-600">Per page:</label>
      <select
        :value="pageSize"
        @change="onPageSizeChange($event)"
        class="border border-gray-300 rounded-md text-sm px-2 py-1.5 focus:ring-blue-500 focus:border-blue-500"
      >
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
    </div>
  </nav>
</template>

<script>
import paginationMixin from '@/mixins/paginationMixin'

export default {
  name: 'PaginationBar',

  mixins: [paginationMixin],

  props: {
    total: {
      type: Number,
      default: 0
    }
  },

  emits: ['page-changed'],

  computed: {
    rangeStart() {
      if (this.total === 0) return 0
      return this.paginatedOffset + 1
    },

    rangeEnd() {
      const end = this.paginatedOffset + this.pageSize
      return end > this.total ? this.total : end
    },

    visiblePages() {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(this.totalPages, start + maxVisible - 1)

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },

  watch: {
    total: {
      immediate: true,
      handler(newTotal) {
        this.totalItems = newTotal
      }
    },

    currentPage(newPage) {
      this.$emit('page-changed', {
        page: newPage,
        pageSize: this.pageSize,
        offset: this.paginatedOffset
      })
    }
  },

  methods: {
    goPrev() {
      this.prevPage()
      this.$emit('page-changed', {
        page: this.currentPage,
        pageSize: this.pageSize,
        offset: this.paginatedOffset
      })
    },

    goNext() {
      this.nextPage()
      this.$emit('page-changed', {
        page: this.currentPage,
        pageSize: this.pageSize,
        offset: this.paginatedOffset
      })
    },

    onPageSizeChange(event) {
      this.changePageSize(Number(event.target.value))
      this.$emit('page-changed', {
        page: this.currentPage,
        pageSize: this.pageSize,
        offset: this.paginatedOffset
      })
    }
  }
}
</script>
