<template>
  <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
    <!-- List Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-semibold text-gray-800">Notifications</h2>
          <span
            v-if="hasUnread"
            class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700"
          >
            {{ unreadCount }} unread
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="hasUnread"
            @click="handleMarkAllRead"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Mark all read
          </button>
          <button
            v-if="notifications.length > 0"
            @click="handleClearAll"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear all
          </button>
        </div>
      </div>

      <!-- Filter tabs -->
      <div class="flex items-center gap-1 mt-3">
        <button
          @click="activeTab = 'all'"
          :class="[
            'px-3 py-1 rounded-md text-xs font-medium transition-colors',
            activeTab === 'all' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          All ({{ notifications.length }})
        </button>
        <button
          @click="activeTab = 'unread'"
          :class="[
            'px-3 py-1 rounded-md text-xs font-medium transition-colors',
            activeTab === 'unread' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          Unread ({{ unreadCount }})
        </button>
        <button
          v-for="type in notificationTypes"
          :key="type"
          @click="activeTab = type"
          :class="[
            'px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize',
            activeTab === type ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <!-- Notification Items -->
    <div ref="notificationListContainer" class="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
      <div
        v-for="notification in filteredNotifications"
        :key="notification.id"
        :class="[
          'px-6 py-4 transition-colors duration-150 cursor-pointer',
          notification.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/50 hover:bg-blue-50'
        ]"
        @click="handleNotificationClick(notification)"
      >
        <div class="flex items-start gap-3">
          <!-- Type icon -->
          <div
            :class="getTypeIconClass(notification.type)"
            class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getTypeIcon(notification.type)" />
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <p :class="[notification.read ? 'text-gray-700' : 'text-gray-900 font-medium', 'text-sm']">
                {{ notification.message || notification.title }}
              </p>
              <span v-if="!notification.read" class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></span>
            </div>
            <p v-if="notification.description" class="text-xs text-gray-500 mt-1 line-clamp-2">
              {{ notification.description }}
            </p>
            <div class="flex items-center gap-3 mt-2">
              <span class="text-xs text-gray-400">
                {{ formatTimeAgo(notification.createdAt) }}
              </span>
              <span v-if="notification.type" class="text-xs text-gray-400 capitalize">
                {{ notification.type }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <button
              v-if="!notification.read"
              @click.stop="handleMarkRead(notification)"
              class="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              title="Mark as read"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              @click.stop="handleRemove(notification)"
              class="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
              title="Remove"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredNotifications.length === 0" class="px-6 py-16 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <h3 class="text-sm font-medium text-gray-600 mb-1">No notifications</h3>
        <p class="text-xs text-gray-400">
          {{ activeTab === 'unread' ? 'You\'re all caught up!' : 'Nothing to show here yet.' }}
        </p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
      <span class="text-xs text-gray-500">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <div class="flex items-center gap-2">
        <button
          @click="prevPage"
          :disabled="!hasPrevPage"
          class="px-3 py-1 text-xs border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="!hasNextPage"
          class="px-3 py-1 text-xs border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import notificationMixin from '@/mixins/notificationMixin'
import paginationMixin from '@/mixins/paginationMixin'
import { timeAgo } from '@/utils/helpers'

export default {
  name: 'NotificationList',

  mixins: [notificationMixin, paginationMixin],

  emits: ['notification-added', 'notification-clicked'],

  data() {
    return {
      activeTab: 'all'
    }
  },

  computed: {
    notificationTypes() {
      const types = new Set(this.notifications.map(n => n.type).filter(Boolean))
      return Array.from(types)
    },

    filteredNotifications() {
      let items = this.sortedNotifications

      if (this.activeTab === 'unread') {
        items = items.filter(n => !n.read)
      } else if (this.activeTab !== 'all') {
        items = items.filter(n => n.type === this.activeTab)
      }

      // Apply pagination
      const start = this.paginatedOffset
      const end = start + this.pageSize
      this.totalItems = items.length
      return items.slice(start, end)
    }
  },

  methods: {
    formatTimeAgo(date) {
      return timeAgo(date)
    },

    handleMarkRead(notification) {
      this.markAsRead(notification.id)
    },

    handleMarkAllRead() {
      this.markAllRead()
    },

    handleRemove(notification) {
      this.removeNotification(notification.id)
    },

    handleClearAll() {
      this.clearAll()
    },

    handleNotificationClick(notification) {
      if (!notification.read) {
        this.markAsRead(notification.id)
      }
      this.$emit('notification-clicked', notification)
    },

    getTypeIconClass(type) {
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

    getTypeIcon(type) {
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
    },

    scrollToTop() {
      if (this.$refs.notificationListContainer) {
        this.$refs.notificationListContainer.scrollTop = 0
      }
    }
  },

  created() {
    // Load initial notifications from store/mock data
    this.notifications = [
      { id: 1, type: 'task', message: 'New task assigned to you', description: 'Review the landing page design mockups', createdAt: new Date(Date.now() - 300000), read: false },
      { id: 2, type: 'comment', message: 'Alice commented on your task', description: 'Looks great! Just a few minor tweaks needed.', createdAt: new Date(Date.now() - 3600000), read: false },
      { id: 3, type: 'success', message: 'Sprint 4 completed successfully', createdAt: new Date(Date.now() - 86400000), read: true },
      { id: 4, type: 'warning', message: 'Task deadline approaching', description: 'API Integration task is due tomorrow', createdAt: new Date(Date.now() - 172800000), read: true },
      { id: 5, type: 'mention', message: 'Bob mentioned you in a comment', createdAt: new Date(Date.now() - 259200000), read: true }
    ]
    this.unreadCount = this.notifications.filter(n => !n.read).length
    this.totalItems = this.notifications.length
  },

  updated() {
    // Scroll to top when notifications update
    this.$nextTick(() => {
      this.scrollToTop()
    })
  }
}
</script>
