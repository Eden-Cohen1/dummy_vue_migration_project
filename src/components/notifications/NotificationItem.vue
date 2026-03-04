<template>
  <div
    :class="[
      'flex items-start gap-3 px-4 py-3 transition-colors duration-150 rounded-lg',
      notification.read
        ? 'bg-white hover:bg-gray-50'
        : 'bg-blue-50/60 hover:bg-blue-50'
    ]"
  >
    <!-- Notification Icon -->
    <div
      :class="iconBackgroundClass"
      class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
      </svg>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <p
          :class="[
            'text-sm leading-snug',
            notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'
          ]"
        >
          {{ notification.message || notification.title }}
        </p>
        <span
          v-if="!notification.read"
          class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"
        ></span>
      </div>

      <p
        v-if="notification.description"
        class="text-xs text-gray-500 mt-1 line-clamp-2"
      >
        {{ notification.description }}
      </p>

      <div class="flex items-center gap-4 mt-2">
        <span class="text-xs text-gray-400">
          {{ formattedTime }}
        </span>

        <span
          v-if="notification.type"
          :class="typeBadgeClass"
          class="inline-block px-1.5 py-0.5 rounded text-xs font-medium capitalize"
        >
          {{ notification.type }}
        </span>

        <!-- Action buttons -->
        <div class="flex items-center gap-1 ml-auto">
          <button
            v-if="!notification.read"
            @click.stop="markRead"
            class="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Mark read
          </button>
          <button
            @click.stop="dismiss"
            class="text-xs text-gray-400 hover:text-red-600 font-medium transition-colors ml-2"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import notificationMixin from '@/mixins/notificationMixin'
import { timeAgo } from '@/utils/helpers'

export default {
  name: 'NotificationItem',

  mixins: [notificationMixin],

  props: {
    notification: {
      type: Object,
      required: true
    }
  },

  emits: ['mark-read', 'dismiss', 'notification-added'],

  computed: {
    formattedTime() {
      return timeAgo(this.notification.createdAt)
    },

    iconPath() {
      const icons = {
        info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
        error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
        task: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
        comment: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
        mention: 'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
      }
      return icons[this.notification.type] || icons.info
    },

    iconBackgroundClass() {
      const classes = {
        info: 'bg-blue-100 text-blue-600',
        success: 'bg-green-100 text-green-600',
        warning: 'bg-yellow-100 text-yellow-600',
        error: 'bg-red-100 text-red-600',
        task: 'bg-purple-100 text-purple-600',
        comment: 'bg-indigo-100 text-indigo-600',
        mention: 'bg-pink-100 text-pink-600'
      }
      return classes[this.notification.type] || 'bg-gray-100 text-gray-600'
    },

    typeBadgeClass() {
      const classes = {
        info: 'bg-blue-50 text-blue-600',
        success: 'bg-green-50 text-green-600',
        warning: 'bg-yellow-50 text-yellow-600',
        error: 'bg-red-50 text-red-600',
        task: 'bg-purple-50 text-purple-600',
        comment: 'bg-indigo-50 text-indigo-600',
        mention: 'bg-pink-50 text-pink-600'
      }
      return classes[this.notification.type] || 'bg-gray-50 text-gray-600'
    }
  },

  methods: {
    markRead() {
      this.$emit('mark-read', this.notification.id)
    },

    dismiss() {
      this.$emit('dismiss', this.notification.id)
    }
  },

  unmounted() {
    console.log('[NotificationItem] Component unmounted for notification:', this.notification.id)
  }
}
</script>
