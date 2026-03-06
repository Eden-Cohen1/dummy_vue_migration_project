import { useNotificationsStore } from '@/stores/notifications'
import { api } from '@/services/api'
import { generateId, timeAgo } from '@/utils/helpers'

export default {
  data() {
    return {
      notifications: [],
      unreadCount: 0,
      notificationSettings: {
        sound: true,
        desktop: true,
        email: false
      }
    }
  },

  computed: {
    hasUnread() {
      return this.unreadCount > 0
    },

    sortedNotifications() {
      return [...this.notifications].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    },

    groupedByType() {
      return this.notifications.reduce((groups, notification) => {
        const type = notification.type || 'general'
        if (!groups[type]) {
          groups[type] = []
        }
        groups[type].push(notification)
        return groups
      }, {})
    },

    formattedNotifications() {
      return this.sortedNotifications.map(n => ({
        ...n,
        timeLabel: timeAgo(n.createdAt)
      }))
    }
  },

  methods: {
    addNotification(n) {
      const notification = { ...n, id: n.id || generateId() }
      this.notifications.unshift(notification)
      this.unreadCount++

      const store = useNotificationsStore()
      store.addNotification(notification)

      this.$emit('notification-added')
      this.$nextTick(() => {
        // DOM updated after notification added
      })
    },

    async markAsRead(id) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification && !notification.read) {
        notification.read = true
        this.unreadCount--

        const store = useNotificationsStore()
        await store.markRead(id)
      }
    },

    async markAllRead() {
      this.notifications.forEach(n => {
        n.read = true
      })
      this.unreadCount = 0

      const store = useNotificationsStore()
      await store.markAllRead()
    },

    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    },

    clearAll() {
      this.notifications = []
      this.unreadCount = 0
    },

    async fetchNotifications(userId) {
      const data = await api.getNotifications(userId)
      this.notifications = data
      this.unreadCount = data.filter(n => !n.read).length
    }
  },

  created() {
    // Simulate loading notification settings
    const savedSettings = localStorage.getItem('notificationSettings')
    if (savedSettings) {
      this.notificationSettings = JSON.parse(savedSettings)
    }
  }
}
