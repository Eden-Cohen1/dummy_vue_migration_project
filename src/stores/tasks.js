import { defineStore } from 'pinia';
import { api } from '@/services/api';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    currentTask: null,
  }),

  getters: {
    taskCount(state) {
      return state.tasks.length;
    },

    tasksByStatus(state) {
      return state.tasks.reduce((acc, task) => {
        const status = task.status || 'todo';
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(task);
        return acc;
      }, {});
    },

    tasksByPriority(state) {
      return state.tasks.reduce((acc, task) => {
        const priority = task.priority || 'medium';
        if (!acc[priority]) {
          acc[priority] = [];
        }
        acc[priority].push(task);
        return acc;
      }, {});
    },
  },

  actions: {
    async fetchTasks(projectId) {
      const tasks = await api.getTasks(projectId);
      this.tasks = tasks;
    },

    async fetchTask(id) {
      const task = await api.getTask(id);
      this.currentTask = task;
    },

    async createTask(data) {
      const task = await api.createTask(data);
      this.tasks.push(task);
      return task;
    },

    async updateTask(id, data) {
      const updated = await api.updateTask(id, data);
      const index = this.tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.tasks[index] = updated;
      }
      if (this.currentTask && this.currentTask.id === id) {
        this.currentTask = updated;
      }
      return updated;
    },

    async moveTask(id, status) {
      const updated = await api.moveTask(id, status);
      const index = this.tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.tasks[index] = updated;
      }
      if (this.currentTask && this.currentTask.id === id) {
        this.currentTask = updated;
      }
      return updated;
    },

    async deleteTask(id) {
      const success = await api.deleteTask(id);
      if (success) {
        this.tasks = this.tasks.filter((t) => t.id !== id);
        if (this.currentTask && this.currentTask.id === id) {
          this.currentTask = null;
        }
      }
      return success;
    },
  },
});
