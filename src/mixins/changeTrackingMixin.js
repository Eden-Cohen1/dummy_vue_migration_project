// Edge case: Level 2 of 5-level chain. Extends auditMixin and adds field-level
// change tracking. Calls this.logAction() from parent mixin.
import auditMixin from '@/mixins/auditMixin'

export default {
  mixins: [auditMixin],

  data() {
    return {
      trackedFields: {},
      originalSnapshot: null,
      isTrackingEnabled: true
    }
  },

  computed: {
    changedFieldNames() {
      return Object.keys(this.trackedFields).filter(
        field => this.trackedFields[field] !== this.originalSnapshot?.[field]
      )
    },

    hasTrackedChanges() {
      return this.changedFieldNames.length > 0
    }
  },

  methods: {
    takeSnapshot(data) {
      this.originalSnapshot = JSON.parse(JSON.stringify(data))
    },

    trackField(fieldName, newValue) {
      if (!this.isTrackingEnabled) return
      const oldValue = this.trackedFields[fieldName]
      this.trackedFields = { ...this.trackedFields, [fieldName]: newValue }
      this.logAction('field_changed', { fieldName, oldValue, newValue })
    },

    getFieldChanges() {
      const changes = {}
      for (const field of this.changedFieldNames) {
        changes[field] = {
          from: this.originalSnapshot?.[field],
          to: this.trackedFields[field]
        }
      }
      return changes
    },

    resetTracking() {
      this.trackedFields = {}
      this.originalSnapshot = null
    }
  }
}
