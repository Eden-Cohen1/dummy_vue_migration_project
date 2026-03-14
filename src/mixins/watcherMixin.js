// Edge case: this.$watch with ALL variants — string path, deep option, immediate option,
// handler as method name string, array of handlers, and returns unwatch function.
export default {
  data() {
    return {
      watchedValue: null,
      unwatchFns: [],
      watchLog: [],
      nested: {
        deep: {
          value: ''
        }
      }
    }
  },

  created() {
    this.setupWatchers()
  },

  beforeUnmount() {
    this.teardownWatchers()
  },

  methods: {
    setupWatchers() {
      // String path watcher
      const unwatch1 = this.$watch('watchedValue', function (newVal, oldVal) {
        this.watchLog.push({ field: 'watchedValue', newVal, oldVal })
      })
      this.unwatchFns.push(unwatch1)

      // Deep watcher with string path
      const unwatch2 = this.$watch('nested.deep.value', {
        handler(newVal) {
          this.watchLog.push({ field: 'nested.deep.value', newVal })
        },
        deep: true,
        immediate: true
      })
      this.unwatchFns.push(unwatch2)

      // Handler as method name string
      const unwatch3 = this.$watch('watchedValue', 'onWatchedValueChange')
      this.unwatchFns.push(unwatch3)

      // Watcher with function expression
      const unwatch4 = this.$watch(
        function () { return this.watchedValue + this.nested.deep.value },
        function (newVal) {
          this.watchLog.push({ field: 'computed_expression', newVal })
        }
      )
      this.unwatchFns.push(unwatch4)
    },

    teardownWatchers() {
      this.unwatchFns.forEach(unwatch => unwatch())
      this.unwatchFns = []
    },

    onWatchedValueChange(newVal, oldVal) {
      this.watchLog.push({ field: 'watchedValue_handler', newVal, oldVal })
    },

    clearWatchLog() {
      this.watchLog = []
    }
  }
}
