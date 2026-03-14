<template>
  <!-- Edge case: Method override — component redefines exportToCSV from exportMixin
       with custom implementation for project-specific CSV generation. -->
  <div class="project-export">
    <h2 class="export-title">Export Project Data</h2>

    <div class="export-options">
      <div class="format-selection">
        <label class="format-label">Export Format</label>
        <div class="format-buttons">
          <button
            v-for="fmt in availableFormats"
            :key="fmt"
            class="format-btn"
            :class="{ active: exportFormat === fmt }"
            @click="exportFormat = fmt"
          >
            {{ fmt.toUpperCase() }}
          </button>
        </div>
      </div>

      <div class="column-selection">
        <label class="columns-label">Columns to Export</label>
        <div class="column-checkboxes">
          <label v-for="col in allColumns" :key="col.key" class="column-checkbox">
            <input
              type="checkbox"
              :value="col.key"
              v-model="exportColumns"
            />
            {{ col.label }}
          </label>
        </div>
      </div>

      <div class="date-range">
        <label>Date Range</label>
        <div class="date-inputs">
          <input v-model="dateFrom" type="date" class="form-input" />
          <span class="date-separator">to</span>
          <input v-model="dateTo" type="date" class="form-input" />
        </div>
      </div>
    </div>

    <div v-if="isExporting" class="export-progress">
      <p>Exporting {{ exportFormat.toUpperCase() }}... {{ exportProgress }}%</p>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: exportProgress + '%' }"></div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <span>{{ loadingMessage }}</span>
    </div>

    <div v-if="hasError" class="error-state">
      <p>{{ error }}</p>
      <button v-if="canRetry" @click="retry(() => handleExport())" class="btn-retry">Retry</button>
    </div>

    <div class="export-actions">
      <button
        class="btn-primary"
        :disabled="isExporting || isLoading || exportColumns.length === 0"
        @click="handleExport"
      >
        {{ isExporting ? 'Exporting...' : 'Download ' + exportFormat.toUpperCase() }}
      </button>
      <button class="btn-secondary" @click="resetExport">
        Reset Options
      </button>
    </div>
  </div>
</template>

<script>
import exportMixin from '@/mixins/exportMixin'
import loadingMixin from '@/mixins/loadingMixin'
import { api } from '@/services/api'
import { formatDate } from '@/utils/helpers'

export default {
  name: 'ProjectExport',

  mixins: [exportMixin, loadingMixin],

  props: {
    projectId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      dateFrom: '',
      dateTo: '',
      projectData: [],
      allColumns: [
        { key: 'name', label: 'Task Name' },
        { key: 'status', label: 'Status' },
        { key: 'priority', label: 'Priority' },
        { key: 'assignee', label: 'Assignee' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'estimatedHours', label: 'Estimated Hours' },
        { key: 'actualHours', label: 'Actual Hours' },
        { key: 'tags', label: 'Tags' }
      ]
    }
  },

  created() {
    this.exportColumns = ['name', 'status', 'priority', 'assignee', 'dueDate']
  },

  methods: {
    // Override exportMixin's exportToCSV with project-specific implementation
    exportToCSV(data) {
      this.isExporting = true
      this.exportProgress = 0

      const columns = this.exportColumns
      const header = columns.map((col) => {
        const colDef = this.allColumns.find((c) => c.key === col)
        return colDef ? colDef.label : col
      }).join(',')

      this.exportProgress = 25

      const rows = data.map((row) => {
        return columns.map((col) => {
          let value = row[col]
          if (col === 'dueDate' && value) {
            value = formatDate(new Date(value))
          }
          if (col === 'tags' && Array.isArray(value)) {
            value = value.join('; ')
          }
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return '"' + value.replace(/"/g, '""') + '"'
          }
          return value !== undefined && value !== null ? value : ''
        }).join(',')
      })

      this.exportProgress = 75

      const csvContent = [header, ...rows].join('\n')
      const bom = '\uFEFF'
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8' })

      this.exportProgress = 100
      this.isExporting = false
      this.downloadFile(blob, `project-${this.projectId}-export.csv`)
    },

    async handleExport() {
      this.startLoading('Fetching project data...')
      try {
        const params = {}
        if (this.dateFrom) params.from = this.dateFrom
        if (this.dateTo) params.to = this.dateTo

        this.projectData = await api.get(`/projects/${this.projectId}/tasks`, params)
        this.stopLoading()

        if (this.exportFormat === 'csv') {
          this.exportToCSV(this.projectData)
        } else if (this.exportFormat === 'pdf') {
          this.exportToPDF(this.projectData)
        }
      } catch (err) {
        this.setError(err.message || 'Failed to fetch project data')
      }
    },

    resetExport() {
      this.exportFormat = 'csv'
      this.exportColumns = ['name', 'status', 'priority', 'assignee', 'dueDate']
      this.dateFrom = ''
      this.dateTo = ''
    }
  }
}
</script>

<style scoped>
.project-export {
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem;
}

.export-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.export-options {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.format-buttons {
  display: flex;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.format-btn {
  padding: 0.375rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.875rem;
}

.format-btn.active {
  background: #4f46e5;
  color: #fff;
  border-color: #4f46e5;
}

.column-checkboxes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.column-checkbox {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: #4f46e5;
  transition: width 0.3s;
}

.export-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-primary {
  padding: 0.5rem 1.25rem;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-secondary {
  padding: 0.5rem 1.25rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
}
</style>
