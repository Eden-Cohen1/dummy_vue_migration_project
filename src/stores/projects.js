import { defineStore } from 'pinia';
import { api } from '@/services/api';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null,
  }),

  getters: {
    projectCount(state) {
      return state.projects.length;
    },

    activeProjects(state) {
      return state.projects.filter((p) => p.status === 'active');
    },
  },

  actions: {
    async fetchProjects() {
      const projects = await api.getProjects();
      this.projects = projects;
    },

    async fetchProject(id) {
      const project = await api.getProject(id);
      this.currentProject = project;
    },

    async createProject(data) {
      const project = await api.createProject(data);
      this.projects.push(project);
      return project;
    },

    async updateProject(id, data) {
      const updated = await api.updateProject(id, data);
      const index = this.projects.findIndex((p) => p.id === id);
      if (index !== -1) {
        this.projects[index] = updated;
      }
      if (this.currentProject && this.currentProject.id === id) {
        this.currentProject = updated;
      }
      return updated;
    },

    async deleteProject(id) {
      const success = await api.deleteProject(id);
      if (success) {
        this.projects = this.projects.filter((p) => p.id !== id);
        if (this.currentProject && this.currentProject.id === id) {
          this.currentProject = null;
        }
      }
      return success;
    },
  },
});
