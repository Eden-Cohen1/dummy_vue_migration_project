<template>
  <div ref="dragContainer" class="flex space-x-4 overflow-x-auto pb-4">
    <!-- Kanban Columns -->
    <div
      v-for="(column, colIndex) in columns"
      :key="column.status"
      class="flex-shrink-0 w-80 bg-gray-50 rounded-lg"
    >
      <!-- Column Header -->
      <div class="px-4 py-3 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-700">
            {{ column.title }}
          </h3>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
            {{ getColumnProjects(column.status).length }}
          </span>
        </div>
      </div>

      <!-- Column Body / Drop Zone -->
      <div
        class="p-3 space-y-3 min-h-[200px] transition-colors"
        :class="{ 'bg-blue-50': isDragging && dragOverIndex === colIndex }"
        @dragover="onDragOver($event, colIndex)"
        @drop="handleDrop($event, column.status)"
        @dragleave="dragOverIndex = -1"
      >
        <!-- Empty Column State -->
        <div
          v-if="getColumnProjects(column.status).length === 0"
          class="text-center py-8 text-gray-400"
        >
          <svg class="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <p class="text-xs">No projects</p>
        </div>

        <!-- Project Cards -->
        <div
          v-for="project in getColumnProjects(column.status)"
          :key="project.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-grab active:cursor-grabbing hover:shadow transition-shadow"
          draggable="true"
          @dragstart="onDragStart($event, project)"
          @dragend="onDragEnd"
        >
          <!-- Card Header -->
          <div class="flex items-start justify-between mb-2">
            <h4 class="text-sm font-medium text-gray-900 truncate mr-2">
              {{ project.name }}
            </h4>
            <input
              type="checkbox"
              class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              :checked="isSelected(project)"
              @change="toggleSelection(project)"
              @click.stop
            />
          </div>

          <!-- Description -->
          <p
            v-if="project.description"
            class="text-xs text-gray-500 mb-3 line-clamp-2"
          >
            {{ project.description }}
          </p>

          <!-- Card Footer -->
          <div class="flex items-center justify-between text-xs text-gray-400">
            <!-- Members -->
            <div class="flex items-center">
              <svg class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ project.members ? project.members.length : 0 }}</span>
            </div>

            <!-- Status indicator dot -->
            <span
              class="inline-block h-2 w-2 rounded-full"
              :class="getStatusDotClass(column.status)"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dragDropMixin from '@/mixins/dragDropMixin'
import selectionMixin from '@/mixins/selectionMixin'

export default {
  name: 'ProjectBoard',

  mixins: [dragDropMixin, selectionMixin],

  props: {
    projects: {
      type: Array,
      default: () => []
    }
  },

  emits: ['project-moved', 'item-reordered', 'selection-changed'],

  data() {
    return {
      columns: [
        { title: 'Active', status: 'active' },
        { title: 'On Hold', status: 'on-hold' },
        { title: 'Completed', status: 'completed' }
      ]
    }
  },

  mounted() {
    // Use this.$refs.dragContainer and this.$el.classList
    if (this.$refs.dragContainer) {
      this.$refs.dragContainer.classList.add('kanban-board')
    }
    this.$el.classList.add('project-board-root')
  },

  methods: {
    getColumnProjects(status) {
      return this.projects.filter((p) => p.status === status)
    },

    handleDrop(event, newStatus) {
      if (!this.dragItem) return

      event.preventDefault()
      const project = this.dragItem

      this.$emit('project-moved', {
        project,
        newStatus
      })

      this.onDrop(event)
    },

    getStatusDotClass(status) {
      const classes = {
        active: 'bg-green-400',
        'on-hold': 'bg-yellow-400',
        completed: 'bg-blue-400'
      }
      return classes[status] || 'bg-gray-400'
    }
  }
}
</script>
