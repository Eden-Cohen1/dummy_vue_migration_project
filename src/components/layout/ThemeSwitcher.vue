<template>
  <div class="relative inline-flex items-center">
    <button
      @click="handleToggle"
      class="relative inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      :class="isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
      :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
      :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <!-- Sun Icon (shown in dark mode) -->
      <svg
        v-if="isDarkMode"
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          clip-rule="evenodd"
        />
      </svg>

      <!-- Moon Icon (shown in light mode) -->
      <svg
        v-else
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    </button>

    <!-- Theme Label -->
    <span
      class="ml-2 text-xs font-medium hidden lg:inline-block"
      :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'"
    >
      {{ isDarkMode ? 'Dark' : 'Light' }}
    </span>
  </div>
</template>

<script>
import themeMixin from '../../mixins/themeMixin'

export default {
  name: 'ThemeSwitcher',

  mixins: [themeMixin],

  emits: ['theme-changed'],

  methods: {
    handleToggle() {
      this.toggleDarkMode()

      // Apply direct style manipulation via this.$el
      if (this.$el && this.$el.style) {
        this.$el.style.transition = 'all 0.3s ease'
      }

      this.$emit('theme-changed', this.currentTheme)

      // Apply theme to document root via $el reference
      this.applyTheme()
    }
  },

  mounted() {
    // Initialize element styles on mount
    if (this.$el && this.$el.style) {
      this.$el.style.transition = 'all 0.3s ease'
    }

    // Apply saved theme on load
    this.applyTheme()
  }
}
</script>
