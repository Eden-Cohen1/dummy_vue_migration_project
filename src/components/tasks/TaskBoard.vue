<template>
  <div class="space-y-4">
    <!-- Board Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">Task Board</h2>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span>{{ tasks.length }} task{{ tasks.length !== 1 ? 's' : '' }}</span>
        <span v-if="hasSelection" class="text-indigo-600">
          | {{ selectionCount }} selected
        </span>
      </div>
    </div>

    <!-- Kanban Columns Container -->
    <div
      ref="dragContainer"
      class="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-12rem)]"
    >
      <KanbanColumn
        v-for="column in columns"
        :key="column.status"
        :title="column.title"
        :status="column.status"
        :tasks="getTasksByStatus(column.status)"
        @task-dropped="handleTaskDropped"
        @task-clicked="handleTaskClicked"
      />
    </div>
  </div>
</template>

<script>
import dragDropMixin from '@/mixins/dragDropMixin'
import selectionMixin from '@/mixins/selectionMixin'
import { useTasksStore } from '@/stores/tasks'
import KanbanColumn from './KanbanColumn.vue'

export default {
  name: 'TaskBoard',

  mixins: [dragDropMixin, selectionMixin],

  components: {
    KanbanColumn
  },

  props: {
    tasks: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      columns: [
        { title: 'To Do', status: 'todo' },
        { title: 'In Progress', status: 'in-progress' },
        { title: 'Review', status: 'review' },
        { title: 'Done', status: 'done' }
      ]
    }
  },

  methods: {
    getTasksByStatus(status) {
      return this.tasks.filter(task => task.status === status)
    },

    moveTask(taskId, newStatus) {
      const store = useTasksStore()

      const self = this
      store.moveTask(taskId, newStatus).then(function (updatedTask) {
        self.$emit('task-moved', updatedTask)

        if (self.$refs.dragContainer) {
          self.$refs.dragContainer.classList.remove('dragging')
        }
        self.$el.classList.remove('drag-active')
      })
    },

    handleTaskDropped(payload) {
      this.moveTask(payload.taskId, payload.newStatus)
    },

    handleTaskClicked(task) {
      this.select(task)
    }
  }
}
</script>
