// Edge case: User activity logging with API integration and bounded log size.
// Tests migration of mixins that import default exports from service modules
// and use async methods with store access for user context.
import api from '@/services/api'

export default {
  data() {
    return {
      activities: [],
      isLoggingActivity: true,
      maxActivities: 200
    }
  },

  computed: {
    recentActivities() {
      return this.activities.slice(-10).reverse()
    },

    activityCount() {
      return this.activities.length
    },

    activityTypes() {
      const types = this.activities.map(a => a.type)
      return [...new Set(types)]
    }
  },

  methods: {
    logActivity(type, details) {
      if (!this.isLoggingActivity) return

      const activity = {
        id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: type,
        details: details || {},
        timestamp: Date.now(),
        user: this.$store ? this.$store.getters.currentUser : null
      }

      this.activities.push(activity)

      // Enforce max length by trimming oldest entries
      if (this.activities.length > this.maxActivities) {
        this.activities = this.activities.slice(-this.maxActivities)
      }

      // Fire-and-forget API call to persist activity
      api.post('/activities', activity).catch(err => {
        console.warn('[activityLogMixin] Failed to persist activity:', err)
      })

      this.$emit('activity-logged', activity)
      return activity
    },

    getActivities(filter) {
      if (!filter) return this.activities

      return this.activities.filter(activity => {
        if (filter.type && activity.type !== filter.type) return false
        if (filter.after && activity.timestamp < filter.after) return false
        if (filter.before && activity.timestamp > filter.before) return false
        return true
      })
    },

    clearActivityLog() {
      this.activities = []
      this.$emit('activity-log-cleared')
    },

    getRecentActivities(count) {
      const n = count || 10
      return this.activities.slice(-n).reverse()
    }
  }
}
