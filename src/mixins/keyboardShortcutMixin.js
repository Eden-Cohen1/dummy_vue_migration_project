export default {
  data() {
    return {
      shortcuts: {},
      isShortcutsEnabled: true
    }
  },

  methods: {
    registerShortcut(key, handler) {
      this.shortcuts[key] = handler
    },

    unregisterShortcut(key) {
      delete this.shortcuts[key]
    },

    handleKeyDown(event) {
      if (!this.isShortcutsEnabled) return

      const handler = this.shortcuts[event.key]
      if (handler) {
        handler(event)
        this.$emit('shortcut-triggered', event.key)
      }
    }
  },

  mounted() {
    document.addEventListener('keydown', this.handleKeyDown)
    // Reference to component element for focus management
    if (this.$el) {
      this.$el.setAttribute('data-shortcuts-enabled', 'true')
    }
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }
}
