// Edge case: this.$watch with array of handlers (Vue 2 feature) and handler
// as a string method name. Tests edge cases of $watch API.
export default {
  data() {
    return {
      watchTarget: '',
      changeLog: [],
      notificationQueue: []
    }
  },

  created() {
    // Array of handlers — undocumented but valid Vue 2 feature
    this.$watch('watchTarget', [
      'handleChange',
      'logChange',
      'notifyChange'
    ])
  },

  methods: {
    handleChange(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.changeLog.push({
          type: 'change',
          from: oldVal,
          to: newVal,
          timestamp: Date.now()
        })
      }
    },

    logChange(newVal) {
      console.log(`[WatchArray] watchTarget changed to: ${newVal}`)
    },

    notifyChange(newVal) {
      this.notificationQueue.push({
        message: `Value updated to "${newVal}"`,
        read: false
      })
    },

    clearLog() {
      this.changeLog = []
    },

    clearNotifications() {
      this.notificationQueue = []
    }
  }
}
