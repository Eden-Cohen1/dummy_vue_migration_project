<template>
  <div class="flex h-screen bg-gray-100" :class="themeClass">
    <AppSidebar v-if="isSidebarOpen" @navigate="handleNav" />
    <div class="flex-1 flex flex-col overflow-hidden">
      <AppHeader @toggle-sidebar="toggleSidebar" />
      <main class="flex-1 overflow-y-auto p-6">
        <AppBreadcrumb />
        <div v-if="childError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span class="text-red-700 text-sm font-medium">Something went wrong: {{ childError.message }}</span>
          </div>
        </div>
        <router-view />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script>
import keyboardShortcutMixin from '../../mixins/keyboardShortcutMixin'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppFooter from './AppFooter.vue'
import AppBreadcrumb from './AppBreadcrumb.vue'

export default {
  name: 'AppLayout',

  mixins: [keyboardShortcutMixin],

  components: {
    AppHeader,
    AppSidebar,
    AppFooter,
    AppBreadcrumb
  },

  data() {
    return {
      isSidebarOpen: true,
      childError: null,
      themeClass: ''
    }
  },

  computed: {
    hasSlotContent() {
      return !!(this.$slots.default && this.$slots.default().length > 0)
    }
  },

  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },

    handleNav(route) {
      this.$router.push(route)
    },

    inspectSlots() {
      if (this.$slots.default) {
        const slotContent = this.$slots.default()
        return slotContent.length
      }
      return 0
    }
  },

  mounted() {
    this.registerShortcut('b', (event) => {
      if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        this.toggleSidebar()
      }
    })

    this.registerShortcut('Escape', () => {
      if (this.isSidebarOpen) {
        this.isSidebarOpen = false
      }
    })

    const slotCount = this.inspectSlots()
    if (slotCount > 0) {
      console.log(`AppLayout rendered with ${slotCount} slot items`)
    }
  },

  errorCaptured(err, vm, info) {
    this.childError = {
      message: err.message,
      component: vm?.$options?.name || 'Unknown',
      info: info
    }
    console.error(`Error captured in AppLayout from ${info}:`, err)
    return false
  }
}
</script>
