// Edge case: Level 4 of 5-level chain. Extends revisionMixin.
// Adds approval workflow with state machine (draft → pending → approved/rejected).
import revisionMixin from '@/mixins/revisionMixin'

export default {
  mixins: [revisionMixin],

  data() {
    return {
      approvalStatus: 'draft',
      approvers: [],
      approvalComments: [],
      approvalDeadline: null
    }
  },

  computed: {
    isPendingApproval() {
      return this.approvalStatus === 'pending'
    },

    isApproved() {
      return this.approvalStatus === 'approved'
    },

    isRejected() {
      return this.approvalStatus === 'rejected'
    },

    approvalProgress() {
      if (this.approvers.length === 0) return 0
      const approved = this.approvers.filter(a => a.decision === 'approved').length
      return Math.round((approved / this.approvers.length) * 100)
    }
  },

  methods: {
    submitForApproval(approverIds = []) {
      if (this.approvalStatus !== 'draft' && this.approvalStatus !== 'rejected') return false
      this.approvalStatus = 'pending'
      this.approvers = approverIds.map(id => ({ id, decision: null, decidedAt: null }))
      this.logAction('submitted_for_approval', { approverIds })
      return true
    },

    approveRevision(approverId, comment = '') {
      const approver = this.approvers.find(a => a.id === approverId)
      if (!approver) return false
      approver.decision = 'approved'
      approver.decidedAt = new Date().toISOString()
      if (comment) {
        this.approvalComments.push({ approverId, comment, type: 'approval' })
      }
      const allApproved = this.approvers.every(a => a.decision === 'approved')
      if (allApproved) this.approvalStatus = 'approved'
      this.logAction('revision_approved', { approverId })
      return true
    },

    rejectRevision(approverId, reason = '') {
      const approver = this.approvers.find(a => a.id === approverId)
      if (!approver) return false
      approver.decision = 'rejected'
      approver.decidedAt = new Date().toISOString()
      this.approvalStatus = 'rejected'
      this.approvalComments.push({ approverId, comment: reason, type: 'rejection' })
      this.logAction('revision_rejected', { approverId, reason })
      return true
    },

    resetApproval() {
      this.approvalStatus = 'draft'
      this.approvers = []
      this.approvalComments = []
    }
  }
}
