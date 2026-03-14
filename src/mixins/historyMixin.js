// Edge case: Browser/navigation history management with stack-based tracking.
// Tests migration of this.$router usage and methods that maintain a bounded
// history stack with forward/back navigation state.
export default {
  data() {
    return {
      historyStack: [],
      currentHistoryIndex: -1,
      maxHistoryLength: 100
    }
  },

  computed: {
    canGoBack() {
      return this.currentHistoryIndex > 0
    },

    canGoForward() {
      return this.currentHistoryIndex < this.historyStack.length - 1
    },

    currentEntry() {
      if (this.currentHistoryIndex < 0 || this.currentHistoryIndex >= this.historyStack.length) {
        return null
      }
      return this.historyStack[this.currentHistoryIndex]
    },

    historyLength() {
      return this.historyStack.length
    }
  },

  methods: {
    pushHistory(entry) {
      // Discard any forward history beyond current index
      if (this.currentHistoryIndex < this.historyStack.length - 1) {
        this.historyStack = this.historyStack.slice(0, this.currentHistoryIndex + 1)
      }

      const historyEntry = {
        ...entry,
        timestamp: Date.now(),
        id: `hist_${Date.now()}`
      }

      this.historyStack.push(historyEntry)

      // Enforce max length
      if (this.historyStack.length > this.maxHistoryLength) {
        this.historyStack = this.historyStack.slice(-this.maxHistoryLength)
      }

      this.currentHistoryIndex = this.historyStack.length - 1
    },

    goBack() {
      if (!this.canGoBack) return
      this.currentHistoryIndex--
      const entry = this.historyStack[this.currentHistoryIndex]
      if (entry && entry.route && this.$router) {
        this.$router.push(entry.route)
      }
      this.$emit('history-navigate', entry)
    },

    goForward() {
      if (!this.canGoForward) return
      this.currentHistoryIndex++
      const entry = this.historyStack[this.currentHistoryIndex]
      if (entry && entry.route && this.$router) {
        this.$router.push(entry.route)
      }
      this.$emit('history-navigate', entry)
    },

    clearHistory() {
      this.historyStack = []
      this.currentHistoryIndex = -1
    },

    getHistoryEntry(index) {
      if (index < 0 || index >= this.historyStack.length) return null
      return this.historyStack[index]
    }
  }
}
