import { defineStore } from 'pinia';
import { api } from '@/services/api';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
  }),

  getters: {
    userCount(state) {
      return state.users.length;
    },
  },

  actions: {
    async fetchUsers() {
      const users = await api.getUsers();
      this.users = users;
    },

    async updateUser(id, data) {
      const updated = await api.updateUser(id, data);
      const index = this.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        this.users[index] = updated;
      }
      return updated;
    },

    async getUserById(id) {
      const user = await api.getUser(id);
      return user;
    },
  },
});
