<template>
  <div class="relative" ref="bellContainer">
    <!-- Bell Button -->
    <button
      @click="toggleDropdown"
      class="relative p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Notifications"
    >
      <!-- Bell Icon -->
      <svg
        class="w-6 h-6"
        :class="{ 'animate-swing': hasUnread }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      <!-- Unread Badge -->
      <span
        v-if="hasUnread"
        class="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Panel -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showDropdown"
        ref="dropdownPanel"
        class="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
      >
        <!-- Dropdown Header -->
        <div class="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-800">Notifications</h3>
            <div class="flex items-center gap-2">
              <button
                v-if="hasUnread"
                @click="handleMarkAllRead"
                class="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Mark all read
              </button>
            </div>
          </div>
        </div>

        <!-- Notification Items -->
        <div ref="dropdownList" class="max-h-80 overflow-y-auto divide-y divide-gray-50">
          <div
            v-for="notification in recentNotifications"
            :key="notification.id"
            :class="[
              'px-4 py-3 cursor-pointer transition-colors duration-100',
              notification.read ? 'hover:bg-gray-50' : 'bg-blue-50/40 hover:bg-blue-50'
            ]"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start gap-3">
              <!-- Icon -->
              <div
                :class="getIconClass(notification.type)"
                class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(notification.type)" />
                </svg>
              </div>

              <div class="flex-1 min-w-0">
                <p
                  :class="[
                    'text-xs leading-relaxed',
                    notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'
                  ]"
                >
                  {{ notification.message || notification.title }}
                </p>
                <span class="text-[10px] text-gray-400 mt-1 block">
                  {{ formatTimeAgo(notification.createdAt) }}
                </span>
              </div>

              <span
                v-if="!notification.read"
                class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1"
              ></span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="sortedNotifications.length === 0" class="px-4 py-8 text-center">
            <svg class="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p class="text-xs text-gray-400">No notifications yet</p>
          </div>
        </div>

        <!-- Dropdown Footer -->
        <div class="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
          <button
            @click="viewAll"
            class="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            View all notifications
          </button>
        </div>
      </div>
    </transition>

    <!-- Backdrop for closing dropdown -->
    <div
      v-if="showDropdown"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script>
import notificationMixin from '@/mixins/notificationMixin'
import { timeAgo } from '@/utils/helpers'

export default {
  name: 'NotificationBell',

  mixins: [notificationMixin],

  emits: ['notification-added', 'notification-clicked', 'view-all'],

  data() {
    return {
      showDropdown: false
    }
  },

  computed: {
    recentNotifications() {
      return this.sortedNotifications.slice(0, 8)
    }
  },

  methods: {
    formatTimeAgo(date) {
      return timeAgo(date)
    },

    toggleDropdown() {
      this.showDropdown = !this.showDropdown
      if (this.showDropdown) {
        this.$nextTick(() => {
          this.positionDropdown()
        })
      }
    },

    closeDropdown() {
      this.showDropdown = false
    },

    positionDropdown() {
      if (this.$refs.dropdownPanel && this.$refs.bellContainer) {
        const rect = this.$refs.bellContainer.getBoundingClientRect()
        const panel = this.$refs.dropdownPanel

        // Check if dropdown would overflow right edge
        if (rect.right - panel.offsetWidth < 0) {
          panel.style.right = 'auto'
          panel.style.left = '0'
        }
      }
    },

    handleNotificationClick(notification) {
      if (!notification.read) {
        this.markAsRead(notification.id)
      }
      this.$emit('notification-clicked', notification)
      this.closeDropdown()
    },

    handleMarkAllRead() {
      this.markAllRead()
    },

    viewAll() {
      this.$emit('view-all')
      this.closeDropdown()
    },

    getIconClass(type) {
      const classes = {
        info: 'bg-blue-100 text-blue-600',
        success: 'bg-green-100 text-green-600',
        warning: 'bg-yellow-100 text-yellow-600',
        error: 'bg-red-100 text-red-600',
        task: 'bg-purple-100 text-purple-600',
        comment: 'bg-indigo-100 text-indigo-600',
        mention: 'bg-pink-100 text-pink-600'
      }
      return classes[type] || 'bg-gray-100 text-gray-600'
    },

    getIconPath(type) {
      const icons = {
        info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
        error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
        task: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
        comment: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
        mention: 'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
      }
      return icons[type] || icons.info
    }
  },

  beforeCreate() {
    console.log('[NotificationBell] Initializing notification bell component')
  },

  mounted() {
    // Programmatic watcher on unreadCount
    this.$watch('unreadCount', function (newCount, oldCount) {
      if (newCount > oldCount) {
        // New notification arrived - could trigger animation or sound
        console.log('[NotificationBell] New notification! Unread count:', newCount)
      }
    })

    // Load initial notifications
    this.notifications = [
      { id: 1, type: 'task', message: 'New task assigned to you', createdAt: new Date(Date.now() - 300000), read: false },
      { id: 2, type: 'comment', message: 'Alice commented on your task', createdAt: new Date(Date.now() - 3600000), read: false },
      { id: 3, type: 'success', message: 'Sprint 4 completed', createdAt: new Date(Date.now() - 86400000), read: true }
    ]
    this.unreadCount = this.notifications.filter(n => !n.read).length
  }
}
</script>

<style scoped>
@keyframes swing {
  0%, 100% { transform: rotate(0deg); }
  15% { transform: rotate(12deg); }
  30% { transform: rotate(-10deg); }
  45% { transform: rotate(6deg); }
  60% { transform: rotate(-4deg); }
  75% { transform: rotate(2deg); }
}

.animate-swing {
  animation: swing 1s ease-in-out;
  transform-origin: top center;
}
</style>
