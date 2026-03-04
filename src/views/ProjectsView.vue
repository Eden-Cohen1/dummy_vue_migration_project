<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Projects</h1>
        <p class="mt-1 text-sm text-gray-500">Manage and track all your projects in one place.</p>
      </div>
      <button
        class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="openCreateModal"
      >
        <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
        </svg>
        New Project
      </button>
    </div>

    <!-- Search Bar -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search projects..."
        class="block w-full rounded-md border-0 py-2 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>

    <!-- Project List -->
    <ProjectList v-else :projects="filteredProjects" />

    <!-- Create Project Modal -->
    <BaseModal :show="showCreateModal" title="Create New Project" @close="showCreateModal = false">
      <ProjectForm @submit="createProject" @cancel="showCreateModal = false" />
    </BaseModal>
  </div>
</template>

<script>
import ProjectList from '@/components/projects/ProjectList.vue'
import ProjectForm from '@/components/projects/ProjectForm.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { useProjectsStore } from '@/stores/projects'
import loadingMixin from '@/mixins/loadingMixin'
import searchMixin from '@/mixins/searchMixin'

export default {
  name: 'ProjectsView',

  components: {
    ProjectList,
    ProjectForm,
    BaseModal
  },

  mixins: [loadingMixin, searchMixin],

  data() {
    return {
      showCreateModal: false,
      projects: []
    }
  },

  computed: {
    filteredProjects() {
      if (!this.searchQuery) {
        return this.projects
      }
      const query = this.searchQuery.toLowerCase()
      return this.projects.filter(
        (project) =>
          project.name?.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query)
      )
    }
  },

  created() {
    this.fetchProjects()
  },

  methods: {
    async fetchProjects() {
      this.startLoading()
      try {
        const projectStore = useProjectsStore()
        await projectStore.fetchProjects()
        this.projects = projectStore.projects
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        this.stopLoading()
      }
    },

    async createProject(data) {
      try {
        const projectStore = useProjectsStore()
        await projectStore.createProject(data)
        this.projects = projectStore.projects
        this.showCreateModal = false
      } catch (error) {
        console.error('Failed to create project:', error)
      }
    },

    openCreateModal() {
      this.showCreateModal = true
    }
  }
}
</script>
