<template>
  <!-- Edge case: Same import (api from @/services/api) used in component AND inside
       loadingMixin (via notificationMixin). Tests import deduplication during migration. -->
  <div class="task-summary-card">
    <div v-if="isLoading" class="card-loading">
      <div class="spinner"></div>
      <span>{{ loadingMessage }}</span>
    </div>

    <div v-else-if="hasError" class="card-error">
      <p class="error-text">{{ error }}</p>
      <button v-if="canRetry" @click="retry(() => fetchSummary())" class="btn-retry">
        Retry
      </button>
    </div>

    <div v-else class="card-content">
      <div class="card-header">
        <h3 class="card-title">{{ summary.title || 'Task Summary' }}</h3>
        <span class="status-badge" :class="'status-' + summary.status">
          {{ summary.status }}
        </span>
      </div>

      <div class="card-stats">
        <div class="stat-row">
          <span class="stat-label">Subtasks</span>
          <span class="stat-value">{{ summary.completedSubtasks }} / {{ summary.totalSubtasks }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Comments</span>
          <span class="stat-value">{{ summary.commentCount }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Attachments</span>
          <span class="stat-value">{{ summary.attachmentCount }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Time Logged</span>
          <span class="stat-value">{{ summary.timeLogged }}h</span>
        </div>
      </div>

      <div class="card-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <span class="progress-label">{{ progressPercent }}% complete</span>
      </div>
    </div>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'
import { api } from '@/services/api'

export default {
  name: 'TaskSummaryCard',

  mixins: [loadingMixin],

  props: {
    taskId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      summary: {
        title: '',
        status: 'todo',
        completedSubtasks: 0,
        totalSubtasks: 0,
        commentCount: 0,
        attachmentCount: 0,
        timeLogged: 0
      }
    }
  },

  computed: {
    progressPercent() {
      if (this.summary.totalSubtasks === 0) return 0
      return Math.round((this.summary.completedSubtasks / this.summary.totalSubtasks) * 100)
    }
  },

  async created() {
    await this.fetchSummary()
  },

  methods: {
    async fetchSummary() {
      this.startLoading('Loading task summary...')
      try {
        const data = await api.get(`/tasks/${this.taskId}/summary`)
        this.summary = data
      } catch (err) {
        this.setError(err.message || 'Failed to load task summary')
      } finally {
        this.stopLoading()
      }
    },

    async refreshSummary() {
      await this.fetchSummary()
    }
  }
}
</script>

<style scoped>
.task-summary-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  min-height: 200px;
}

.card-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 180px;
  color: #6b7280;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
}

.status-todo { background: #f3f4f6; color: #4b5563; }
.status-in-progress { background: #dbeafe; color: #1d4ed8; }
.status-done { background: #d1fae5; color: #059669; }

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 0.375rem 0;
  font-size: 0.875rem;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 1rem;
}

.progress-fill {
  height: 100%;
  background: #4f46e5;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  display: block;
}
</style>
