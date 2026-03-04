import { defineStore } from 'pinia';
import { api } from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  actions: {
    async login(credentials) {
      // Fetch mock users from the api and authenticate with the first one
      const users = await api.getUsers();
      const user = users[0];
      this.user = user;
      this.isAuthenticated = true;
      this.token = 'mock-jwt-token';
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    checkSession() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          this.user = JSON.parse(storedUser);
        }
      }
    },
  },
});
