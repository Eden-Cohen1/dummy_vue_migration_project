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
    }
  },

  methods: {
    addNotification(n) {
      this.notifications.unshift(n)
      this.unreadCount++
      this.$emit('notification-added')
      this.$nextTick(() => {
        // DOM updated after notification added
      })
    },

    markAsRead(id) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification && !notification.read) {
        notification.read = true
        this.unreadCount--
      }
    },

    markAllRead() {
      this.notifications.forEach(n => {
        n.read = true
      })
      this.unreadCount = 0
    },

    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    },

    clearAll() {
      this.notifications = []
      this.unreadCount = 0
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
