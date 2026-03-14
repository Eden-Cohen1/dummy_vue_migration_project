// Edge case: const self = this / const that = this / const vm = this alias patterns
// in callbacks, setTimeout, Promise.then. Migration tool must follow the alias.
export default {
  data() {
    return {
      timerValue: 0,
      callbackResult: null,
      intervalId: null,
      fetchStatus: 'idle'
    }
  },

  methods: {
    delayedAction(delay = 1000) {
      // Classic self = this pattern
      const self = this
      setTimeout(function () {
        self.timerValue = Date.now()
        self.callbackResult = 'delayed-complete'
      }, delay)
    },

    promiseAction(url) {
      // that = this in promise chain
      const that = this
      that.fetchStatus = 'loading'
      return fetch(url || '/api/data')
        .then(function (response) {
          return response.json()
        })
        .then(function (data) {
          that.callbackResult = data
          that.fetchStatus = 'success'
        })
        .catch(function (err) {
          that.fetchStatus = 'error'
          that.callbackResult = err.message
        })
    },

    nestedCallback() {
      // vm = this with deeply nested callbacks
      const vm = this
      const outer = function (callback) {
        setTimeout(function () {
          callback()
        }, 100)
      }

      outer(function () {
        vm.timerValue++
        const inner = function (cb) {
          setTimeout(function () {
            cb()
          }, 50)
        }
        inner(function () {
          vm.callbackResult = 'nested-complete'
          vm.fetchStatus = 'idle'
        })
      })
    },

    startInterval() {
      const self = this
      self.intervalId = setInterval(function () {
        self.timerValue++
        if (self.timerValue >= 10) {
          clearInterval(self.intervalId)
          self.intervalId = null
        }
      }, 1000)
    },

    eventListenerPattern() {
      // self = this in event listener
      const self = this
      const handler = function (event) {
        self.callbackResult = event.type
        document.removeEventListener('click', handler)
      }
      document.addEventListener('click', handler)
    }
  },

  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }
}
