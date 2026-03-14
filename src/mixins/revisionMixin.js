// Edge case: Level 3 of 5-level chain. Extends changeTrackingMixin.
// Adds revision numbering and rollback capability.
import changeTrackingMixin from '@/mixins/changeTrackingMixin'

export default {
  mixins: [changeTrackingMixin],

  data() {
    return {
      revisionNumber: 0,
      revisions: [],
      maxRevisions: 50
    }
  },

  computed: {
    currentRevision() {
      return this.revisions.length > 0
        ? this.revisions[this.revisions.length - 1]
        : null
    },

    hasRevisions() {
      return this.revisions.length > 0
    },

    revisionCount() {
      return this.revisions.length
    }
  },

  methods: {
    createRevision(data, message = '') {
      this.revisionNumber++
      const revision = {
        number: this.revisionNumber,
        data: JSON.parse(JSON.stringify(data)),
        message,
        changes: this.getFieldChanges(),
        createdAt: new Date().toISOString()
      }
      this.revisions.push(revision)
      if (this.revisions.length > this.maxRevisions) {
        this.revisions.shift()
      }
      this.logAction('revision_created', { number: this.revisionNumber, message })
      this.resetTracking()
      return revision
    },

    rollbackToRevision(revisionNumber) {
      const revision = this.revisions.find(r => r.number === revisionNumber)
      if (!revision) return null
      this.logAction('revision_rollback', { from: this.revisionNumber, to: revisionNumber })
      return JSON.parse(JSON.stringify(revision.data))
    },

    getRevisionDiff(fromNumber, toNumber) {
      const from = this.revisions.find(r => r.number === fromNumber)
      const to = this.revisions.find(r => r.number === toNumber)
      if (!from || !to) return null
      return { from: from.data, to: to.data }
    }
  }
}
