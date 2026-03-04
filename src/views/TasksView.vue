<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Tasks</h1>
        <p class="mt-1 text-sm text-gray-500">{{ taskCount }} total tasks across all projects.</p>
      </div>
      <div class="flex items-center space-x-3">
        <!-- View Mode Toggle -->
        <div class="inline-flex rounded-md shadow-sm">
          <button
            class="rounded-l-md px-4 py-2 text-sm font-medium"
            :class="
              viewMode === 'board'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            "
            @click="viewMode = 'board'"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V4zM2 14a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
          </button>
          <button
            class="rounded-r-md px-4 py-2 text-sm font-medium"
            :class="
              viewMode === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            "
            @click="viewMode = 'list'"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Create Task Button -->
        <button
          class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="showCreateModal = true"
        >
          <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          New Task
        </button>
      </div>
    </div>

    <!-- Filters Panel -->
    <div class="mb-6">
      <TaskFilters @filter="applyFilters" />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>

    <!-- Task Views -->
    <div v-else>
      <TaskBoard v-if="viewMode === 'board'" :tasks="tasks" />
      <TaskList v-else :tasks="tasks" @delete="deleteTask" />
    </div>

    <!-- Create Task Modal -->
    <BaseModal :show="showCreateModal" title="Create New Task" @close="showCreateModal = false">
      <TaskForm @submit="handleCreateTask" @cancel="showCreateModal = false" />
    </BaseModal>
  </div>
</template>

<script>
import TaskList from '@/components/tasks/TaskList.vue'
import TaskBoard from '@/components/tasks/TaskBoard.vue'
import TaskFilters from '@/components/tasks/TaskFilters.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { mapState, mapActions } from 'pinia'
import { useTasksStore } from '@/stores/tasks'
import loadingMixin from '@/mixins/loadingMixin'
import filterMixin from '@/mixins/filterMixin'

export default {
  name: 'TasksView',

  components: {
    TaskList,
    TaskBoard,
    TaskFilters,
    TaskForm,
    BaseModal
  },

  mixins: [loadingMixin, filterMixin],

  data() {
    return {
      viewMode: 'board',
      showCreateModal: false
    }
  },

  computed: {
    ...mapState(useTasksStore, ['tasks', 'taskCount'])
  },

  created() {
    this.loadTasks()
  },

  methods: {
    ...mapActions(useTasksStore, ['fetchTasks', 'createTask', 'deleteTask']),

    async loadTasks() {
      this.startLoading()
      try {
        await this.fetchTasks()
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        this.stopLoading()
      }
    },

    async handleCreateTask(data) {
      try {
        await this.createTask(data)
        this.showCreateModal = false
      } catch (error) {
        console.error('Failed to create task:', error)
      }
    },

    applyFilters(filters) {
      this.setFilters(filters)
    }
  }
}
</script>
