<template>
  <div>
    <!-- Controls Bar -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <!-- Filter Controls -->
      <div class="flex items-center space-x-3">
        <!-- Status Filter -->
        <div class="relative">
          <select
            v-model="selectedStatus"
            class="block w-48 pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <!-- Active Filter Count -->
        <span
          v-if="isFiltered"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {{ activeFilterCount }} filter{{ activeFilterCount > 1 ? 's' : '' }}
        </span>

        <!-- Clear Filters -->
        <button
          v-if="isFiltered"
          class="text-sm text-gray-500 hover:text-gray-700 underline"
          @click="clearFilters"
        >
          Clear
        </button>
      </div>

      <!-- Sort Controls -->
      <div class="flex items-center space-x-3">
        <span class="text-sm text-gray-500">Sort by:</span>
        <button
          class="px-3 py-1.5 text-sm rounded-lg border transition-colors"
          :class="sortKey === 'created_at' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
          @click="toggleSort('created_at')"
        >
          Date {{ sortKey === 'created_at' ? sortIndicator : '' }}
        </button>
        <button
          class="px-3 py-1.5 text-sm rounded-lg border transition-colors"
          :class="sortKey === 'name' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
          @click="toggleSort('name')"
        >
          Name {{ sortKey === 'name' ? sortIndicator : '' }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="paginatedProjects.length === 0"
      class="text-center py-12 bg-white rounded-lg shadow"
    >
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
      <p class="text-gray-500 text-sm">No projects found.</p>
    </div>

    <!-- Project Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <ProjectCard
        v-for="project in paginatedProjects"
        :key="project.id"
        :project="project"
        @project-selected="$emit('project-selected', $event)"
      />
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="mt-6 flex items-center justify-center space-x-2"
    >
      <button
        class="px-4 py-2 text-sm rounded-lg border transition-colors"
        :class="hasPrevPage ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'"
        :disabled="!hasPrevPage"
        @click="prevPage"
      >
        Previous
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        class="px-3 py-2 text-sm rounded-lg border transition-colors"
        :class="page === currentPage ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button
        class="px-4 py-2 text-sm rounded-lg border transition-colors"
        :class="hasNextPage ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'"
        :disabled="!hasNextPage"
        @click="nextPage"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import sortMixin from '@/mixins/sortMixin'
import filterMixin from '@/mixins/filterMixin'
import paginationMixin from '@/mixins/paginationMixin'
import ProjectCard from './ProjectCard.vue'

export default {
  name: 'ProjectList',

  components: {
    ProjectCard
  },

  mixins: [sortMixin('created_at'), filterMixin, paginationMixin],

  props: {
    projects: {
      type: Array,
      default: () => []
    }
  },

  emits: ['project-selected'],

  computed: {
    // Computed getter/setter: selectedStatus with get/set pattern
    selectedStatus: {
      get() {
        return this.activeFilters.status || ''
      },
      set(value) {
        if (value) {
          this.applyFilter('status', value)
        } else {
          this.removeFilter('status')
        }
      }
    },

    filteredProjects() {
      let result = [...this.projects]

      // Apply status filter
      if (this.activeFilters.status) {
        result = result.filter((p) => p.status === this.activeFilters.status)
      }

      // Apply sorting
      result.sort((a, b) => {
        const aVal = a[this.sortKey] || ''
        const bVal = b[this.sortKey] || ''
        const comparison = String(aVal).localeCompare(String(bVal))
        return this.sortOrder === 'asc' ? comparison : -comparison
      })

      return result
    },

    paginatedProjects() {
      this.totalItems = this.filteredProjects.length
      const start = this.paginatedOffset
      const end = start + this.pageSize
      return this.filteredProjects.slice(start, end)
    },

    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },

  created() {
    this.pageSize = 9

    // Use this.$route.query to read URL filter params
    if (this.$route && this.$route.query) {
      const query = this.$route.query
      if (query.status) {
        this.applyFilter('status', query.status)
      }
      if (query.sort) {
        this.sortKey = query.sort
      }
      if (query.order) {
        this.sortOrder = query.order
      }
    }
  },

  methods: {
    clearFilters() {
      this.clearAllFilters()
      this.clearSort()
      this.currentPage = 1
    }
  }
}
</script>
