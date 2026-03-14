// Edge case: Level 1 (bottom) of a 5-level mixin chain: auditMixin → changeTrackingMixin
// → revisionMixin → approvalMixin → publishMixin. Members defined here should bubble
// up through all levels as transitive dependencies.
export default {
  data() {
    return {
      auditTrail: [],
      auditEnabled: true
    }
  },

  computed: {
    lastAction() {
      return this.auditTrail.length > 0
        ? this.auditTrail[this.auditTrail.length - 1]
        : null
    },

    auditCount() {
      return this.auditTrail.length
    }
  },

  methods: {
    logAction(action, details = {}) {
      if (!this.auditEnabled) return
      this.auditTrail.push({
        action,
        details,
        timestamp: new Date().toISOString(),
        user: this.$store?.state?.auth?.currentUser || 'system'
      })
    },

    clearAuditTrail() {
      this.auditTrail = []
    },

    getAuditEntriesFor(action) {
      return this.auditTrail.filter(entry => entry.action === action)
    }
  }
}
