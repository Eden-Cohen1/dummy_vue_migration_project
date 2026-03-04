<template>
  <div
    draggable="true"
    @dragstart="handleDragStart"
    @click="handleClick"
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
  >
    <!-- Header: Title and Status Badge -->
    <div class="flex items-start justify-between mb-3">
      <h3 class="text-sm font-semibold text-gray-900 truncate flex-1 mr-2">
        {{ task.title }}
      </h3>
      <span
        :class="[
          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
          statusBadgeClass
        ]"
      >
        {{ task.status }}
      </span>
    </div>

    <!-- Priority Indicator -->
    <div class="flex items-center mb-3">
      <span
        :class="['inline-block w-2 h-2 rounded-full mr-2', priorityDotClass]"
      ></span>
      <span :class="['text-xs font-medium', priorityColorClass]">
        {{ task.priority }}
      </span>
    </div>

    <!-- Footer: Assignee Avatar and Due Date -->
    <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
      <!-- Assignee Avatar -->
      <div class="flex items-center" v-if="task.assignee">
        <div
          class="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-medium mr-2"
        >
          {{ assigneeInitials }}
        </div>
        <span class="text-xs text-gray-600 truncate max-w-[100px]">
          {{ task.assignee.name || task.assignee }}
        </span>
      </div>
      <div v-else class="flex items-center">
        <div
          class="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs mr-2"
        >
          ?
        </div>
        <span class="text-xs text-gray-400">Unassigned</span>
      </div>

      <!-- Due Date -->
      <div class="flex items-center text-xs text-gray-500" v-if="task.dueDate">
        <svg class="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span :class="{ 'text-red-500 font-medium': isOverdue }">
          {{ formattedDueDate }}
        </span>
      </div>
    </div>

    <!-- Delete button (visible if canDelete) -->
    <div class="mt-2 flex justify-end" v-if="canDelete">
      <button
        @click.stop="handleDelete"
        class="text-xs text-red-400 hover:text-red-600 transition-colors"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import permissionMixin from '@/mixins/permissionMixin'
import { getPriorityColor, getStatusColor, formatDate } from '@/utils/helpers'

export default {
  name: 'TaskCard',

  mixins: [permissionMixin],

  props: {
    task: {
      type: Object,
      required: true
    }
  },

  computed: {
    canDelete() {
      return this.task && this.task.priority !== 'critical'
    },

    priorityColorClass() {
      return getPriorityColor(this.task.priority)
    },

    priorityDotClass() {
      const dotColors = {
        low: 'bg-green-500',
        medium: 'bg-yellow-500',
        high: 'bg-orange-500',
        critical: 'bg-red-500'
      }
      return dotColors[this.task.priority] || 'bg-gray-500'
    },

    statusBadgeClass() {
      const badgeClasses = {
        'todo': 'bg-gray-100 text-gray-700',
        'in-progress': 'bg-blue-100 text-blue-700',
        'review': 'bg-yellow-100 text-yellow-700',
        'done': 'bg-green-100 text-green-700'
      }
      return badgeClasses[this.task.status] || 'bg-gray-100 text-gray-700'
    },

    statusColorClass() {
      return getStatusColor(this.task.status)
    },

    formattedDueDate() {
      return formatDate(this.task.dueDate)
    },

    isOverdue() {
      if (!this.task.dueDate) return false
      return new Date(this.task.dueDate) < new Date() && this.task.status !== 'done'
    },

    assigneeInitials() {
      const name = this.task.assignee?.name || this.task.assignee || ''
      if (!name) return '?'
      return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    }
  },

  methods: {
    handleClick() {
      this.$emit('task-clicked', this.task)
      this.$router.push({ name: 'task-detail', params: { id: this.task.id } })
    },

    handleDragStart(event) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', JSON.stringify(this.task))
    },

    handleDelete() {
      this.$emit('task-deleted', this.task)
    }
  }
}
</script>
