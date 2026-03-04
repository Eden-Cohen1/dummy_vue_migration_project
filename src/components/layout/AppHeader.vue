<template>
  <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-3" v-bind="$attrs">
    <div class="flex items-center justify-between">
      <!-- Left: Menu toggle and logo -->
      <div class="flex items-center space-x-4">
        <button
          @click="$emit('toggle-sidebar')"
          class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-1"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">A</span>
          </div>
          <span class="text-xl font-semibold text-gray-800">{{ appName }}</span>
        </div>
      </div>

      <!-- Center: Search bar -->
      <div class="flex-1 max-w-lg mx-8">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
          />
        </div>
      </div>

      <!-- Right: Theme, Notifications, User -->
      <div class="flex items-center space-x-4">
        <!-- Theme Switcher -->
        <ThemeSwitcher />

        <!-- Notification Bell -->
        <div class="relative">
          <button
            @click="toggleNotificationPanel"
            class="relative text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-1"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span
              v-if="hasUnread"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>

          <!-- Notification Dropdown -->
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-800">Notifications</h3>
              <button
                v-if="notifications.length > 0"
                @click="markAllRead"
                class="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Mark all read
              </button>
            </div>
            <div class="max-h-64 overflow-y-auto">
              <div
                v-for="notification in sortedNotifications"
                :key="notification.id"
                class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                :class="{ 'bg-indigo-50': !notification.read }"
                @click="markAsRead(notification.id)"
              >
                <p class="text-sm text-gray-800">{{ notification.message }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ notification.createdAt }}</p>
              </div>
              <div v-if="notifications.length === 0" class="px-4 py-6 text-center text-sm text-gray-500">
                No notifications
              </div>
            </div>
          </div>
        </div>

        <!-- User Avatar Dropdown -->
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
          >
            <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">{{ userInitials }}</span>
            </div>
            <span class="text-sm font-medium text-gray-700 hidden md:block">{{ userName }}</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- User Menu Dropdown -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1"
          >
            <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </a>
            <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </a>
            <div class="border-t border-gray-100 my-1"></div>
            <a href="#" class="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" @click.prevent="handleLogout">
              <svg class="w-4 h-4 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import themeMixin from '../../mixins/themeMixin'
import notificationMixin from '../../mixins/notificationMixin'
import ThemeSwitcher from './ThemeSwitcher.vue'

export default {
  name: 'AppHeader',

  mixins: [themeMixin, notificationMixin],

  components: {
    ThemeSwitcher
  },

  inheritAttrs: false,

  emits: ['toggle-sidebar'],

  data() {
    return {
      appName: 'AppManager',
      showUserMenu: false,
      showNotifications: false,
      searchQuery: '',
      userName: 'John Doe',
      userInitials: 'JD'
    }
  },

  methods: {
    toggleNotificationPanel() {
      this.showNotifications = !this.showNotifications
      if (this.showNotifications) {
        this.showUserMenu = false
      }
    },

    handleLogout() {
      this.showUserMenu = false
      this.$router.push('/login')
    },

    handleClickOutside(event) {
      const header = this.$el
      if (header && !header.contains(event.target)) {
        this.showUserMenu = false
        this.showNotifications = false
      }
    }
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)

    // Access $attrs for attribute forwarding awareness
    if (Object.keys(this.$attrs).length > 0) {
      console.log('AppHeader received forwarded attrs:', Object.keys(this.$attrs))
    }
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>
