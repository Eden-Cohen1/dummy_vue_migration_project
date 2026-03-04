<template>
  <aside class="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
    <!-- Logo Section -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">A</span>
        </div>
        <span class="text-lg font-semibold text-gray-800">Navigation</span>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1 px-3">
        <li v-for="item in filteredNavItems" :key="item.path">
          <router-link
            :to="item.path"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
            :class="isActive(item.path) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
            @click="onNavigate(item)"
          >
            <svg class="w-5 h-5 flex-shrink-0" :class="isActive(item.path) ? 'text-indigo-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
            </svg>
            <span>{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="ml-auto bg-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded-full"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </li>
      </ul>

      <!-- Slot for additional navigation content -->
      <div v-if="hasDefaultSlot" class="mt-4 px-3 border-t border-gray-200 pt-4">
        <slot></slot>
      </div>
    </nav>

    <!-- Bottom Section -->
    <div class="border-t border-gray-200 px-4 py-3">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-700 truncate">{{ permissionLevel }}</p>
          <p class="text-xs text-gray-500 truncate">Role access</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import permissionMixin from '../../mixins/permissionMixin'

export default {
  name: 'AppSidebar',

  mixins: [permissionMixin],

  emits: ['navigate'],

  data() {
    return {
      navItems: [
        {
          label: 'Dashboard',
          icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
          path: '/dashboard',
          requiredPermission: 'read',
          badge: null
        },
        {
          label: 'Projects',
          icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
          path: '/projects',
          requiredPermission: 'read',
          badge: '3'
        },
        {
          label: 'Tasks',
          icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
          path: '/tasks',
          requiredPermission: 'read',
          badge: '12'
        },
        {
          label: 'Team',
          icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
          path: '/team',
          requiredPermission: 'read',
          badge: null
        },
        {
          label: 'Reports',
          icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
          path: '/reports',
          requiredPermission: 'read',
          badge: null
        },
        {
          label: 'Settings',
          icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
          path: '/settings',
          requiredPermission: 'update',
          badge: null
        },
        {
          label: 'Admin',
          icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
          path: '/admin',
          requiredPermission: 'delete',
          badge: null
        }
      ]
    }
  },

  computed: {
    filteredNavItems() {
      return this.navItems.filter(item => {
        if (!item.requiredPermission) return true
        return this.checkPermission(item.requiredPermission)
      })
    },

    hasDefaultSlot() {
      return !!(this.$slots.default)
    },

    currentPath() {
      return this.$route.path
    }
  },

  methods: {
    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(path + '/')
    },

    onNavigate(item) {
      this.$emit('navigate', item.path)

      // Anti-pattern: using $parent.$emit for testing purposes
      if (this.$parent) {
        this.$parent.$emit('sidebar-toggled', { navigatedTo: item.path })
      }
    },

    navigateTo(path) {
      this.$router.push(path)
    }
  }
}
</script>
