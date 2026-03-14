<template>
  <!-- Edge case: 5-level mixin chain — uses only publishMixin but inherits members
       from all 5 levels: auditMixin, changeTrackingMixin, revisionMixin,
       approvalMixin, publishMixin. Tests transitive dependency resolution. -->
  <div class="content-publisher">
    <div class="status-bar">
      <span class="status-badge" :class="approvalStatus">{{ publishStatusLabel }}</span>
      <span v-if="hasRevisions">Rev {{ revisionNumber }}</span>
    </div>

    <div v-if="auditEnabled" class="audit-section">
      <p>{{ auditCount }} audit entries</p>
      <p v-if="lastAction">Last: {{ lastAction.action }}</p>
    </div>

    <div v-if="hasTrackedChanges" class="changes-section">
      <h4>Pending Changes</h4>
      <ul>
        <li v-for="field in changedFieldNames" :key="field">{{ field }}</li>
      </ul>
    </div>

    <div class="approval-section" v-if="isPendingApproval">
      <p>Approval progress: {{ approvalProgress }}%</p>
      <div class="approver-list">
        <span v-for="approver in approvers" :key="approver.id" :class="approver.decision">
          {{ approver.id }}
        </span>
      </div>
    </div>

    <div class="publish-actions">
      <button @click="submitForApproval(['reviewer1', 'reviewer2'])" :disabled="isPendingApproval">
        Submit for Review
      </button>
      <button @click="publish" :disabled="!canPublish">Publish</button>
      <button @click="unpublish" :disabled="!canUnpublish">Unpublish</button>
      <button @click="createRevision(currentData, 'Manual save')">Save Revision</button>
    </div>

    <p v-if="isPublished">Published at {{ publishedAt }}</p>
  </div>
</template>

<script>
import publishMixin from '@/mixins/publishMixin'

export default {
  name: 'ContentPublisher',
  mixins: [publishMixin],

  data() {
    return {
      currentData: { title: '', body: '' }
    }
  },

  methods: {
    updateField(field, value) {
      this.trackField(field, value)
      this.currentData[field] = value
    }
  }
}
</script>

<style scoped>
.content-publisher {
  padding: 1rem;
}
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
.status-badge.approved { background: #d4edda; }
.status-badge.rejected { background: #f8d7da; }
.status-badge.pending { background: #fff3cd; }
</style>
