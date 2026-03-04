import { defineStore } from 'pinia';
import { api } from '@/services/api';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
  }),

  getters: {
    hasUnread(state) {
      return state.unreadCount > 0;
    },
  },

  actions: {
    async fetchNotifications(userId) {
      const notifications = await api.getNotifications(userId);
      this.notifications = notifications;
      this.unreadCount = notifications.filter((n) => !n.read).length;
    },

    addNotification(data) {
      this.notifications.unshift(data);
      if (!data.read) {
        this.unreadCount++;
      }
    },

    async markRead(id) {
      const updated = await api.markNotificationRead(id);
      if (updated) {
        const index = this.notifications.findIndex((n) => n.id === id);
        if (index !== -1) {
          const wasUnread = !this.notifications[index].read;
          this.notifications[index] = updated;
          if (wasUnread) {
            this.unreadCount = Math.max(0, this.unreadCount - 1);
          }
        }
      }
      return updated;
    },

    async markAllRead() {
      // Use the first notification's userId or fall back gracefully
      const userId = this.notifications.length > 0 ? this.notifications[0].userId : null;
      if (!userId) return;
      const updated = await api.markAllNotificationsRead(userId);
      if (updated) {
        this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
        this.unreadCount = 0;
      }
    },
  },
});
