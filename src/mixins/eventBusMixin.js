// Edge case: this.$on/this.$off/this.$once in matched pairs (mount/destroy cleanup).
// Vue 3 removed instance event bus — these need migration to external emitter.
export default {
  data() {
    return {
      eventHandlers: {},
      receivedEvents: [],
      isListening: false
    }
  },

  created() {
    this.registerEvents()
  },

  beforeDestroy() {
    this.cleanupEvents()
  },

  methods: {
    registerEvents() {
      // $on with various handler patterns
      this.$on('data-updated', this.handleDataUpdate)
      this.$on('user-action', this.handleUserAction)
      this.$on('error-occurred', (error) => {
        this.receivedEvents.push({ type: 'error', payload: error, timestamp: Date.now() })
      })

      // $once for one-time initialization
      this.$once('initialized', () => {
        this.isListening = true
        this.receivedEvents.push({ type: 'init', timestamp: Date.now() })
      })

      this.eventHandlers = {
        'data-updated': this.handleDataUpdate,
        'user-action': this.handleUserAction
      }
    },

    cleanupEvents() {
      // Matched $off for each $on
      this.$off('data-updated', this.handleDataUpdate)
      this.$off('user-action', this.handleUserAction)
      this.$off('error-occurred')

      this.isListening = false
    },

    handleDataUpdate(payload) {
      this.receivedEvents.push({ type: 'data-updated', payload, timestamp: Date.now() })
    },

    handleUserAction(action) {
      this.receivedEvents.push({ type: 'user-action', payload: action, timestamp: Date.now() })
    },

    emitEvent(name, payload) {
      this.$emit(name, payload)
    },

    clearEventLog() {
      this.receivedEvents = []
    }
  }
}
