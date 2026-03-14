<!-- ProjectArchive.vue
  Mixins used:
  - loadingMixin: Provides isLoading, startLoading/stopLoading for fetching archived projects
  - paginationMixin: Provides currentPage, totalPages, goToPage, nextPage, prevPage for pagination
  - searchMixin: Provides searchQuery, searchResults, handleSearch for filtering archived projects
  This component manages archived projects with search, paginated card display,
  and restore functionality.
-->
<template>
  <div class="project-archive">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Archived Projects</h3>

    <!-- Search bar -->
    <div class="mb-4">
      <div class="relative">
        <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search archived projects..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <svg class="animate-spin h-6 w-6 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      <span class="text-sm text-gray-500">{{ loadingMessage }}</span>
    </div>

    <template v-else>
      <!-- Archived project cards -->
      <div class="space-y-3">
        <div
          v-for="project in displayedProjects"
          :key="project.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div class="min-w-0">
            <h4 class="text-sm font-medium text-gray-900 truncate">{{ project.name }}</h4>
            <p class="text-xs text-gray-500 mt-0.5">
              Archived {{ project.archivedAt }} &middot; {{ project.taskCount }} tasks
            </p>
          </div>
          <button
            @click="restoreProject(project.id)"
            class="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            Restore
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="displayedProjects.length === 0" class="text-center py-10">
        <p class="text-sm text-gray-400">No archived projects found</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center space-x-3 mt-6">
        <button
          @click="prevPage"
          :disabled="currentPage <= 1"
          class="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="text-sm text-gray-500">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          class="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'
import paginationMixin from '@/mixins/paginationMixin'
import searchMixin from '@/mixins/searchMixin'

export default {
  name: 'ProjectArchive',

  mixins: [loadingMixin, paginationMixin, searchMixin],

  data() {
    return {
      archivedProjects: []
    }
  },

  computed: {
    filteredProjects() {
      if (!this.searchQuery) return this.archivedProjects
      const q = this.searchQuery.toLowerCase()
      return this.archivedProjects.filter(p => p.name.toLowerCase().includes(q))
    },

    displayedProjects() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredProjects.slice(start, start + this.pageSize)
    }
  },

  methods: {
    restoreProject(projectId) {
      this.archivedProjects = this.archivedProjects.filter(p => p.id !== projectId)
      this.$emit('project-restored', projectId)
    },

    async loadArchive() {
      this.startLoading('Loading archived projects...')
      // Simulated fetch
      this.stopLoading()
    }
  },

  mounted() {
    this.loadArchive()
  }
}
</script>

<style scoped>
.project-archive {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
