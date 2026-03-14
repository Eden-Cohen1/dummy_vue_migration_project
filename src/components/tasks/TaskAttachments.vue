<!-- TaskAttachments.vue
  Mixins used:
  - fileHandlerMixin: Provides file management, drag-and-drop handlers, upload progress, formatFileSize
  - loadingMixin: Provides isLoading, startLoading/stopLoading for fetching existing attachments
  This component handles file attachments for tasks, with drag-and-drop upload,
  file list display with metadata, progress tracking, and download/delete actions.
-->
<template>
  <div class="task-attachments">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      Attachments
      <span v-if="hasFiles" class="text-sm font-normal text-gray-500 ml-1">({{ files.length }})</span>
    </h3>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <svg class="animate-spin h-6 w-6 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      <span class="text-sm text-gray-500">Loading attachments...</span>
    </div>

    <template v-else>
      <!-- Drop zone -->
      <div
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @dragover.prevent
        @drop="handleDrop"
        :class="[
          'border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-colors',
          isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
        ]"
      >
        <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="text-sm text-gray-500">Drag files here or
          <label class="text-indigo-600 hover:text-indigo-700 cursor-pointer font-medium">
            browse
            <input type="file" multiple class="hidden" @change="handleFileSelect" />
          </label>
        </p>
        <p class="text-xs text-gray-400 mt-1">Max file size: {{ formatFileSize(maxFileSize) }}</p>
      </div>

      <!-- File list -->
      <div v-if="hasFiles" class="space-y-2">
        <div
          v-for="file in files"
          :key="file.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
        >
          <div class="flex items-center space-x-3 min-w-0">
            <span class="text-lg">{{ fileIcon(file.type) }}</span>
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <!-- Upload progress -->
          <div v-if="file.status === 'uploading'" class="flex-1 mx-4">
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div class="bg-indigo-500 h-1.5 rounded-full transition-all" :style="{ width: (uploadProgress[file.id] || 0) + '%' }"></div>
            </div>
          </div>
          <div class="flex items-center space-x-2 flex-shrink-0">
            <button
              @click="downloadFile(file)"
              class="text-gray-400 hover:text-indigo-600 transition-colors"
              title="Download"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button
              @click="removeFile(file.id)"
              class="text-gray-400 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Total size -->
      <div v-if="hasFiles" class="mt-3 text-xs text-gray-400 text-right">
        Total: {{ formattedTotalSize }}
      </div>
    </template>
  </div>
</template>

<script>
import fileHandlerMixin from '@/mixins/fileHandlerMixin'
import loadingMixin from '@/mixins/loadingMixin'

export default {
  name: 'TaskAttachments',

  mixins: [fileHandlerMixin, loadingMixin],

  props: {
    taskId: {
      type: [String, Number],
      required: true
    }
  },

  methods: {
    fileIcon(type) {
      if (!type) return '📄'
      if (type.startsWith('image/')) return '🖼️'
      if (type === 'application/pdf') return '📕'
      if (type.includes('spreadsheet') || type.includes('excel')) return '📊'
      return '📄'
    },

    downloadFile(file) {
      this.$emit('download', file)
    },

    async uploadAll() {
      const pending = this.files.filter(f => f.status === 'pending')
      for (const file of pending) {
        await this.uploadFile(file)
      }
    }
  }
}
</script>

<style scoped>
.task-attachments {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
