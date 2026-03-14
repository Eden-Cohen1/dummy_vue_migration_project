<template>
  <!-- Edge case: 5 mixins heavy collision. loadingMixin.error overlaps validationMixin.errors,
       exportMixin.isExporting conflicts conceptually with loadingMixin.isLoading. -->
  <div class="user-import">
    <h2 class="import-title">Import Users</h2>

    <div class="import-steps">
      <div class="step" :class="{ active: currentStep === 1 }">
        <span class="step-number">1</span>
        <span class="step-label">Upload</span>
      </div>
      <div class="step" :class="{ active: currentStep === 2 }">
        <span class="step-number">2</span>
        <span class="step-label">Validate</span>
      </div>
      <div class="step" :class="{ active: currentStep === 3 }">
        <span class="step-number">3</span>
        <span class="step-label">Import</span>
      </div>
    </div>

    <div v-if="isLoading" class="loading-section">
      <div class="spinner"></div>
      <p>{{ loadingMessage }}</p>
    </div>

    <div v-else>
      <div v-if="currentStep === 1" class="upload-section">
        <div class="file-drop-zone" @dragover.prevent @drop.prevent="handleFileDrop">
          <input
            ref="fileInput"
            type="file"
            accept=".csv,.xlsx"
            class="file-input"
            @change="handleFileSelect"
          />
          <p class="drop-text">Drag and drop a CSV file or click to browse</p>
          <p class="drop-hint">Supports CSV and XLSX formats</p>
        </div>
        <div v-if="selectedFile" class="file-info">
          <span class="file-name">{{ selectedFile.name }}</span>
          <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
          <button @click="clearFile" class="btn-remove-file">&times;</button>
        </div>
      </div>

      <div v-if="currentStep === 2" class="validation-section">
        <div v-if="isValidating" class="validating-state">
          <div class="spinner"></div>
          <p>Validating user data...</p>
        </div>
        <div v-else>
          <div class="validation-summary">
            <div class="validation-stat valid">
              <span class="stat-count">{{ validRowCount }}</span>
              <span class="stat-label">Valid</span>
            </div>
            <div class="validation-stat invalid">
              <span class="stat-count">{{ errorCount }}</span>
              <span class="stat-label">Errors</span>
            </div>
          </div>
          <div v-if="!isValid" class="error-list">
            <div v-for="(msg, field) in errors" :key="field" class="error-row">
              <span class="error-field">{{ field }}</span>
              <span class="error-message">{{ msg }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentStep === 3" class="import-section">
        <div v-if="isExporting" class="progress-section">
          <p>Importing users... {{ exportProgress }}%</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: exportProgress + '%' }"></div>
          </div>
        </div>
        <div v-else class="import-complete">
          <p class="success-text">Import complete!</p>
          <p>{{ importedCount }} users imported successfully</p>
        </div>
      </div>

      <div v-if="hasError" class="global-error">
        <p>{{ error }}</p>
        <button v-if="canRetry" @click="retry(() => processImport())" class="btn-retry">Retry</button>
      </div>

      <div class="notification-area" v-if="hasUnread">
        <div v-for="n in formattedNotifications.slice(0, 5)" :key="n.id" class="notification-item">
          <span :class="'notification-' + n.type">{{ n.message }}</span>
        </div>
      </div>
    </div>

    <div class="import-actions">
      <button
        v-if="currentStep > 1"
        class="btn-secondary"
        @click="currentStep--"
        :disabled="isLoading || isExporting"
      >
        Back
      </button>
      <button
        v-if="currentStep < 3 && canCreate"
        class="btn-primary"
        @click="nextStep"
        :disabled="isLoading || !canProceed"
      >
        {{ currentStep === 2 ? 'Start Import' : 'Next' }}
      </button>
    </div>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'
import validationMixin from '@/mixins/validationMixin'
import notificationMixin from '@/mixins/notificationMixin'
import exportMixin from '@/mixins/exportMixin'
import permissionMixin from '@/mixins/permissionMixin'
import { api } from '@/services/api'

export default {
  name: 'UserImport',

  mixins: [loadingMixin, validationMixin, notificationMixin, exportMixin, permissionMixin],

  data() {
    return {
      currentStep: 1,
      selectedFile: null,
      parsedRows: [],
      validRowCount: 0,
      importedCount: 0
    }
  },

  computed: {
    canProceed() {
      if (this.currentStep === 1) return !!this.selectedFile
      if (this.currentStep === 2) return this.isValid && this.validRowCount > 0
      return false
    }
  },

  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
      }
    },

    handleFileDrop(event) {
      const file = event.dataTransfer.files[0]
      if (file) {
        this.selectedFile = file
      }
    },

    clearFile() {
      this.selectedFile = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },

    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    },

    async nextStep() {
      if (this.currentStep === 1) {
        this.currentStep = 2
        await this.validateFile()
      } else if (this.currentStep === 2) {
        this.currentStep = 3
        await this.processImport()
      }
    },

    async validateFile() {
      this.startLoading('Parsing file...')
      try {
        const formData = new FormData()
        formData.append('file', this.selectedFile)
        const result = await api.post('/users/import/validate', formData)
        this.parsedRows = result.rows || []
        this.validRowCount = result.validCount || 0

        if (result.errors) {
          this.errors = result.errors
        }
      } catch (err) {
        this.setError(err.message || 'Failed to validate file')
      } finally {
        this.stopLoading()
      }
    },

    async processImport() {
      this.isExporting = true
      this.exportProgress = 0
      try {
        const batchSize = 50
        for (let i = 0; i < this.parsedRows.length; i += batchSize) {
          const batch = this.parsedRows.slice(i, i + batchSize)
          await api.post('/users/import/batch', { users: batch })
          this.importedCount += batch.length
          this.exportProgress = Math.round((this.importedCount / this.parsedRows.length) * 100)
        }
        this.addNotification({
          type: 'success',
          message: `Successfully imported ${this.importedCount} users`
        })
        this.$emit('import-complete', this.importedCount)
      } catch (err) {
        this.setError(err.message || 'Import failed')
        this.addNotification({
          type: 'error',
          message: 'User import failed: ' + err.message
        })
      } finally {
        this.isExporting = false
      }
    }
  }
}
</script>

<style scoped>
.user-import {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem;
}

.import-steps {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
}

.step.active {
  color: #4f46e5;
  font-weight: 600;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.step.active .step-number {
  background: #4f46e5;
  color: #fff;
}

.file-drop-zone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
}

.validation-summary {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.validation-stat {
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  flex: 1;
}

.validation-stat.valid { background: #d1fae5; }
.validation-stat.invalid { background: #fef2f2; }

.error-list {
  max-height: 200px;
  overflow-y: auto;
}

.error-row {
  display: flex;
  gap: 0.5rem;
  padding: 0.375rem 0;
  font-size: 0.875rem;
  color: #dc2626;
}

.import-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: #4f46e5;
  transition: width 0.3s;
}
</style>
