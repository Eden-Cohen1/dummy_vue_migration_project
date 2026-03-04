<template>
  <div class="space-y-4">
    <!-- Toolbar: Search, View Toggle, Filter Summary -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <!-- Search -->
      <div class="relative flex-1 w-full sm:max-w-md">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="Search tasks..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-3">
        <!-- Filter count badge -->
        <div v-if="isFiltered" class="flex items-center text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
          <span>{{ activeFilterCount }} filter{{ activeFilterCount !== 1 ? 's' : '' }}</span>
          <button @click="clearAllFilters" class="ml-1 text-indigo-400 hover:text-indigo-600">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- View Mode Toggle -->
        <div class="flex items-center bg-gray-100 rounded-lg p-0.5">
          <button
            @click="viewMode = 'list'"
            :class="[
              'p-1.5 rounded-md transition-colors',
              viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="[
              'p-1.5 rounded-md transition-colors',
              viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Results info -->
    <div v-if="searchQuery" class="text-sm text-gray-500 px-1">
      {{ resultCount }} result{{ resultCount !== 1 ? 's' : '' }} found
      <span v-if="searchQuery">for "{{ searchQuery }}"</span>
    </div>

    <!-- Task List / Grid -->
    <div
      :class="[
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col gap-3'
      ]"
    >
      <TaskCard
        v-for="task in paginatedTasks"
        :key="task.id"
        :task="task"
        @task-clicked="handleTaskSelected"
      />
    </div>

    <!-- Empty state -->
    <div
      v-if="displayedTasks.length === 0"
      class="flex flex-col items-center justify-center py-12 text-gray-400"
    >
      <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-sm font-medium">No tasks found</p>
      <p class="text-xs mt-1">Try adjusting your search or filters</p>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3"
    >
      <div class="text-sm text-gray-500">
        Showing {{ paginatedOffset + 1 }}-{{ Math.min(paginatedOffset + pageSize, totalItems) }}
        of {{ totalItems }}
      </div>
      <div class="flex items-center gap-1">
        <button
          @click="prevPage"
          :disabled="!hasPrevPage"
          :class="[
            'px-3 py-1.5 text-sm rounded-md transition-colors',
            hasPrevPage
              ? 'text-gray-700 hover:bg-gray-100'
              : 'text-gray-300 cursor-not-allowed'
          ]"
        >
          Previous
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'w-8 h-8 text-sm rounded-md transition-colors',
            page === currentPage
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="nextPage"
          :disabled="!hasNextPage"
          :class="[
            'px-3 py-1.5 text-sm rounded-md transition-colors',
            hasNextPage
              ? 'text-gray-700 hover:bg-gray-100'
              : 'text-gray-300 cursor-not-allowed'
          ]"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import searchMixin from '@/mixins/searchMixin'
import filterMixin from '@/mixins/filterMixin'
import paginationMixin from '@/mixins/paginationMixin'
import TaskCard from './TaskCard.vue'

export default {
  name: 'TaskList',

  mixins: [searchMixin, filterMixin, paginationMixin],

  components: {
    TaskCard
  },

  props: {
    tasks: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      viewMode: 'list'
    }
  },

  computed: {
    items() {
      return this.tasks
    },

    filteredTasks() {
      let result = this.tasks

      // Apply active filters
      if (this.activeFilters.status) {
        result = result.filter(t => t.status === this.activeFilters.status)
      }
      if (this.activeFilters.priority) {
        result = result.filter(t => t.priority === this.activeFilters.priority)
      }
      if (this.activeFilters.assignee) {
        result = result.filter(t => {
          const name = t.assignee?.name || t.assignee || ''
          return name === this.activeFilters.assignee
        })
      }

      return result
    },

    displayedTasks() {
      if (this.searchQuery && this.searchResults.length > 0) {
        return this.searchResults
      }
      if (this.searchQuery && this.searchResults.length === 0) {
        return []
      }
      return this.filteredTasks
    },

    paginatedTasks() {
      const start = this.paginatedOffset
      const end = start + this.pageSize
      return this.displayedTasks.slice(start, end)
    },

    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    },

    urlFilters() {
      return this.$route.query
    }
  },

  watch: {
    displayedTasks: {
      immediate: true,
      handler(tasks) {
        this.totalItems = tasks.length
      }
    },

    urlFilters: {
      immediate: true,
      deep: true,
      handler(query) {
        if (query.status) {
          this.applyFilter('status', query.status)
        }
        if (query.priority) {
          this.applyFilter('priority', query.priority)
        }
        if (query.assignee) {
          this.applyFilter('assignee', query.assignee)
        }
      }
    }
  },

  methods: {
    handleTaskSelected(task) {
      this.$emit('task-selected', task)
    }
  }
}
</script>
