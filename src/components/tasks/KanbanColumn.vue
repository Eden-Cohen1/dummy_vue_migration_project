<template>
  <div
    :class="[
      'flex flex-col w-72 min-w-[18rem] bg-gray-50 rounded-xl border-2 transition-colors duration-200 flex-shrink-0',
      isDropTarget ? 'border-indigo-400 bg-indigo-50' : 'border-transparent'
    ]"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
  >
    <!-- Column Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <div class="flex items-center gap-2">
        <span :class="['w-2.5 h-2.5 rounded-full', statusDotClass]"></span>
        <h3 class="text-sm font-semibold text-gray-700">{{ title }}</h3>
      </div>
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-medium text-gray-600">
        {{ tasks.length }}
      </span>
    </div>

    <!-- Task Cards -->
    <div class="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-16rem)]">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @task-clicked="handleTaskClicked"
      />

      <!-- Drop zone placeholder (empty state) -->
      <div
        v-if="tasks.length === 0"
        :class="[
          'flex items-center justify-center py-8 rounded-lg border-2 border-dashed transition-colors duration-200',
          isDropTarget ? 'border-indigo-300 bg-indigo-50 text-indigo-400' : 'border-gray-300 text-gray-400'
        ]"
      >
        <p class="text-sm">
          {{ isDropTarget ? 'Drop here' : 'No tasks' }}
        </p>
      </div>
    </div>

    <!-- Selection indicator -->
    <div v-if="hasSelection" class="px-4 py-2 border-t border-gray-200 bg-white rounded-b-xl">
      <p class="text-xs text-indigo-600">
        {{ selectionCount }} selected in this column
      </p>
    </div>
  </div>
</template>

<script>
import dragDropMixin from '@/mixins/dragDropMixin'
import selectionMixin from '@/mixins/selectionMixin'
import TaskCard from './TaskCard.vue'

export default {
  name: 'KanbanColumn',

  mixins: [dragDropMixin, selectionMixin],

  components: {
    TaskCard
  },

  props: {
    title: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    tasks: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      isDropTarget: false
    }
  },

  computed: {
    statusDotClass() {
      const dots = {
        'todo': 'bg-gray-400',
        'in-progress': 'bg-blue-500',
        'review': 'bg-yellow-500',
        'done': 'bg-green-500'
      }
      return dots[this.status] || 'bg-gray-400'
    }
  },

  methods: {
    handleDragOver(event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
      this.isDropTarget = true
    },

    handleDrop(event) {
      event.preventDefault()
      this.isDropTarget = false

      try {
        const taskData = JSON.parse(event.dataTransfer.getData('text/plain'))
        this.$emit('task-dropped', {
          taskId: taskData.id,
          newStatus: this.status,
          task: taskData
        })
      } catch (e) {
        // Invalid drag data
      }
    },

    handleDragEnter(event) {
      event.preventDefault()
      this.isDropTarget = true
    },

    handleDragLeave(event) {
      const rect = this.$el.getBoundingClientRect()
      const x = event.clientX
      const y = event.clientY

      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        this.isDropTarget = false
      }
    },

    handleTaskClicked(task) {
      this.toggleSelection(task)
      this.$emit('task-clicked', task)
    }
  }
}
</script>
