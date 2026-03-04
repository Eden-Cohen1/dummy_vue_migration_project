<template>
  <footer
    class="bg-white border-t border-gray-200 px-6 py-4"
    :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    v-bind="$attrs"
  >
    <div class="flex items-center justify-between">
      <!-- Left: Copyright -->
      <div class="flex items-center space-x-2">
        <span class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
          &copy; {{ currentYear }} AppManager. All rights reserved.
        </span>
      </div>

      <!-- Center: Links -->
      <div class="hidden md:flex items-center space-x-6">
        <a
          href="#"
          class="text-sm transition-colors duration-150"
          :class="isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          class="text-sm transition-colors duration-150"
          :class="isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'"
        >
          Terms of Service
        </a>
        <a
          href="#"
          class="text-sm transition-colors duration-150"
          :class="isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'"
        >
          Documentation
        </a>
      </div>

      <!-- Right: Version info -->
      <div class="flex items-center space-x-3">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'"
        >
          v{{ appVersion }}
        </span>
        <span class="text-xs" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">
          {{ buildEnvironment }}
        </span>
      </div>
    </div>
  </footer>
</template>

<script>
import themeMixin from '../../mixins/themeMixin'

export default {
  name: 'AppFooter',

  mixins: [themeMixin],

  inheritAttrs: false,

  data() {
    return {
      appVersion: '1.4.2',
      buildEnvironment: 'Production'
    }
  },

  computed: {
    currentYear() {
      return new Date().getFullYear()
    },

    footerAttrs() {
      return this.$attrs
    }
  },

  mounted() {
    if (Object.keys(this.$attrs).length > 0) {
      console.log('AppFooter received forwarded attrs:', this.$attrs)
    }
  }
}
</script>
