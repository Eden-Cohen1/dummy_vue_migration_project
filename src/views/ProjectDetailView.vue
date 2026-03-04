<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>

    <template v-else-if="project">
      <!-- Project Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ project.name }}</h1>
            <p class="mt-1 text-sm text-gray-500">{{ project.description }}</p>
          </div>
          <span
            class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
            :class="{
              'bg-green-100 text-green-800': project.status === 'active',
              'bg-yellow-100 text-yellow-800': project.status === 'pending',
              'bg-gray-100 text-gray-800': project.status === 'completed',
              'bg-red-100 text-red-800': project.status === 'archived'
            }"
          >
            {{ project.status }}
          </span>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
            :class="
              activeTab === tab.key
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            "
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div>
        <TaskBoard
          v-if="activeTab === 'board'"
          :tasks="tasks"
          :project-id="project.id"
        />

        <ProjectTimeline
          v-else-if="activeTab === 'timeline'"
          :project="project"
          :tasks="tasks"
        />

        <ProjectMembers
          v-else-if="activeTab === 'members'"
          :project="project"
        />

        <ProjectSettings
          v-else-if="activeTab === 'settings'"
          :project="project"
        />
      </div>
    </template>

    <!-- Project Not Found -->
    <div v-else class="py-20 text-center">
      <h2 class="text-2xl font-semibold text-gray-900">Project not found</h2>
      <p class="mt-2 text-gray-500">The project you are looking for does not exist.</p>
    </div>
  </div>
</template>

<script>
import ProjectBoard from '@/components/projects/ProjectBoard.vue'
import ProjectMembers from '@/components/projects/ProjectMembers.vue'
import ProjectSettings from '@/components/projects/ProjectSettings.vue'
import ProjectTimeline from '@/components/projects/ProjectTimeline.vue'
import TaskBoard from '@/components/tasks/TaskBoard.vue'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import loadingMixin from '@/mixins/loadingMixin'
import permissionMixin from '@/mixins/permissionMixin'

export default {
  name: 'ProjectDetailView',

  components: {
    ProjectBoard,
    ProjectMembers,
    ProjectSettings,
    ProjectTimeline,
    TaskBoard
  },

  mixins: [loadingMixin, permissionMixin],

  data() {
    return {
      project: null,
      tasks: [],
      activeTab: 'board',
      tabs: [
        { key: 'board', label: 'Board' },
        { key: 'timeline', label: 'Timeline' },
        { key: 'members', label: 'Members' },
        { key: 'settings', label: 'Settings' }
      ]
    }
  },

  watch: {
    '$route.params.id': {
      handler(id) {
        this.loadProject(id)
      },
      immediate: true
    }
  },

  methods: {
    async loadProject(id) {
      if (!id) return
      this.startLoading()
      try {
        const projectStore = useProjectsStore()
        const taskStore = useTasksStore()
        await projectStore.fetchProjectById(id)
        await taskStore.fetchTasksByProject(id)
        this.project = projectStore.currentProject
        this.tasks = taskStore.tasks
      } catch (error) {
        console.error('Failed to load project:', error)
        this.project = null
      } finally {
        this.stopLoading()
      }
    }
  }
}
</script>
