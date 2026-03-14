// Edge case: Intentionally MISSING groupedByType and formattedNotifications.
// notificationMixin has both, but this composable omits them.
// Tests multiple BLOCKED_NOT_RETURNED on the same composable.
import { ref, computed } from 'vue'

export function useNotification() {
  const notifications = ref([])
  const unreadCount = ref(0)
  const notificationSettings = ref({
    sound: true,
    desktop: false,
    email: false
  })

  const hasUnread = computed(() => unreadCount.value > 0)

  const sortedNotifications = computed(() => {
    return [...notifications.value].sort((a, b) => b.timestamp - a.timestamp)
  })

  // NOTE: groupedByType intentionally NOT implemented
  // NOTE: formattedNotifications intentionally NOT implemented

  function addNotification(notification) {
    notifications.value.push({
      ...notification,
      id: Date.now(),
      read: false,
      timestamp: Date.now()
    })
    unreadCount.value++
  }

  function markAsRead(id) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value--
    }
  }

  function markAllRead() {
    notifications.value.forEach(n => { n.read = true })
    unreadCount.value = 0
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      if (!notifications.value[index].read) unreadCount.value--
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
    unreadCount.value = 0
  }

  function fetchNotifications() {
    // Simulated fetch
    return Promise.resolve([])
  }

  return {
    notifications,
    unreadCount,
    notificationSettings,
    hasUnread,
    sortedNotifications,
    // NOTE: groupedByType intentionally NOT returned
    // NOTE: formattedNotifications intentionally NOT returned
    addNotification,
    markAsRead,
    markAllRead,
    removeNotification,
    clearAll,
    fetchNotifications
  }
}
