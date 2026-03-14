// Edge case: Level 5 (top) of 5-level chain. Extends approvalMixin.
// canPublish computed depends on isApproved from level 4. A component using
// only publishMixin gets all 5 levels of transitive members.
import approvalMixin from '@/mixins/approvalMixin'

export default {
  mixins: [approvalMixin],

  data() {
    return {
      isPublished: false,
      publishedAt: null,
      publishTarget: 'production',
      scheduledPublishDate: null
    }
  },

  computed: {
    canPublish() {
      return this.isApproved && !this.isPublished
    },

    canUnpublish() {
      return this.isPublished
    },

    publishStatusLabel() {
      if (this.isPublished) return 'Published'
      if (this.isPendingApproval) return 'Pending Approval'
      if (this.isRejected) return 'Rejected'
      return 'Draft'
    }
  },

  methods: {
    publish() {
      if (!this.canPublish) return false
      this.isPublished = true
      this.publishedAt = new Date().toISOString()
      this.createRevision({ publishedAt: this.publishedAt }, 'Published')
      this.logAction('published', { target: this.publishTarget })
      this.$emit('content-published', { publishedAt: this.publishedAt })
      return true
    },

    unpublish() {
      if (!this.canUnpublish) return false
      this.isPublished = false
      this.publishedAt = null
      this.logAction('unpublished')
      this.$emit('content-unpublished')
      return true
    },

    schedulePublish(date) {
      this.scheduledPublishDate = date
      this.logAction('publish_scheduled', { date })
    }
  }
}
