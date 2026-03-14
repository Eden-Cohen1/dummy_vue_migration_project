// Edge case: Periodic data refresh with timer lifecycle management.
// Tests migration of lifecycle hooks (mounted/beforeDestroy -> onMounted/onBeforeUnmount)
// and cleanup of setInterval references during component teardown.
export default {
  data() {
    return {
      pollInterval: 30000,
      pollTimer: null,
      isPollActive: false,
      lastPollAt: null
    }
  },

  computed: {
    isPolling() {
      return this.isPollActive && this.pollTimer !== null
    },

    timeSinceLastPoll() {
      if (!this.lastPollAt) return null
      const elapsed = Date.now() - this.lastPollAt
      if (elapsed < 1000) return 'just now'
      if (elapsed < 60000) return `${Math.floor(elapsed / 1000)}s ago`
      if (elapsed < 3600000) return `${Math.floor(elapsed / 60000)}m ago`
      return `${Math.floor(elapsed / 3600000)}h ago`
    }
  },

  methods: {
    startPolling(fn) {
      if (this.pollTimer) {
        this.stopPolling()
      }

      this._pollCallback = fn || this._pollCallback
      this.isPollActive = true
      this.poll()

      this.pollTimer = setInterval(() => {
        this.poll()
      }, this.pollInterval)
    },

    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
        this.pollTimer = null
      }
      this.isPollActive = false
    },

    poll() {
      if (typeof this._pollCallback === 'function') {
        this.lastPollAt = Date.now()
        try {
          const result = this._pollCallback()
          if (result && typeof result.then === 'function') {
            result.catch(err => {
              console.warn('[pollingMixin] Poll callback error:', err)
            })
          }
        } catch (err) {
          console.warn('[pollingMixin] Poll callback error:', err)
        }
      }
    }
  },

  mounted() {
    // Subclass can override to auto-start polling
  },

  beforeDestroy() {
    this.stopPolling()
  }
}
