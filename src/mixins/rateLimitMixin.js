// Edge case: Rate limiting with sliding window and throttle wrapper for API calls
export default {
  data() {
    return {
      requestCount: 0,
      requestLimit: 100,
      windowStart: Date.now(),
      windowDuration: 60000,
      requestLog: [],
      throttleTimers: {}
    }
  },

  computed: {
    isRateLimited() {
      this._cleanExpiredRequests()
      return this.requestCount >= this.requestLimit
    },

    remainingRequests() {
      this._cleanExpiredRequests()
      return Math.max(0, this.requestLimit - this.requestCount)
    },

    rateLimitResetTime() {
      if (this.requestLog.length === 0) return 0
      const oldest = this.requestLog[0]
      return Math.max(0, oldest + this.windowDuration - Date.now())
    }
  },

  methods: {
    checkRateLimit() {
      this._cleanExpiredRequests()

      if (this.requestCount >= this.requestLimit) {
        this.$emit('rate-limited', {
          limit: this.requestLimit,
          remaining: 0,
          resetIn: this.rateLimitResetTime
        })
        return false
      }

      this.requestCount += 1
      this.requestLog.push(Date.now())
      return true
    },

    resetRateLimit() {
      this.requestCount = 0
      this.requestLog = []
      this.windowStart = Date.now()
    },

    throttleRequest(fn, key, delay) {
      const throttleKey = key || 'default'
      delay = delay || 1000

      if (this.throttleTimers[throttleKey]) {
        return Promise.resolve(null)
      }

      if (!this.checkRateLimit()) {
        return Promise.reject(new Error('Rate limit exceeded'))
      }

      this.throttleTimers[throttleKey] = true

      setTimeout(() => {
        delete this.throttleTimers[throttleKey]
      }, delay)

      return Promise.resolve().then(() => fn())
    },

    _cleanExpiredRequests() {
      const now = Date.now()
      const cutoff = now - this.windowDuration

      this.requestLog = this.requestLog.filter((timestamp) => timestamp > cutoff)
      this.requestCount = this.requestLog.length
    }
  },

  beforeUnmount() {
    Object.keys(this.throttleTimers).forEach((key) => {
      delete this.throttleTimers[key]
    })
  }
}
