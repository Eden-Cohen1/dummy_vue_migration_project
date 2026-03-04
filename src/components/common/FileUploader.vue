<template>
  <div class="w-full">
    <!-- Drop zone -->
    <div
      :class="[
        'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer',
        dragOver
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400 bg-gray-50'
      ]"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        class="hidden"
        @change="handleFileSelect"
      />

      <div class="flex flex-col items-center gap-3">
        <div :class="['w-12 h-12 rounded-full flex items-center justify-center', dragOver ? 'bg-blue-100' : 'bg-gray-200']">
          <svg :class="['w-6 h-6', dragOver ? 'text-blue-600' : 'text-gray-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-700">
            <span class="text-blue-600 hover:text-blue-700">Click to upload</span>
            or drag and drop
          </p>
          <p class="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
        </div>
      </div>
    </div>

    <!-- Validation errors -->
    <div v-if="!isValid" class="mt-2">
      <p v-for="(err, field) in errors" :key="field" class="text-xs text-red-500">
        {{ err }}
      </p>
    </div>

    <!-- File list -->
    <ul v-if="files.length > 0" class="mt-4 space-y-2">
      <li
        v-for="(file, index) in files"
        :key="index"
        class="flex items-center justify-between p-3 bg-white border rounded-lg"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="flex-shrink-0 w-8 h-8 rounded bg-blue-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-700 truncate">{{ file.name }}</p>
            <p class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</p>
          </div>
        </div>
        <button
          @click="removeFile(index)"
          class="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </li>
    </ul>

    <!-- Form state indicators from formMixin -->
    <div v-if="isDirty" class="mt-2 text-xs text-amber-600">
      Unsaved changes
    </div>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import validationMixin from '@/mixins/validationMixin'

export default {
  name: 'FileUploader',

  mixins: [formMixin, validationMixin],

  data() {
    return {
      files: [],
      dragOver: false
    }
  },

  emits: ['files-selected', 'form-submitted', 'validation-complete'],

  methods: {
    handleDrop(e) {
      this.dragOver = false
      const droppedFiles = Array.from(e.dataTransfer.files)
      this.addFiles(droppedFiles)
    },

    handleFileSelect(e) {
      const selectedFiles = Array.from(e.target.files)
      this.addFiles(selectedFiles)
      this.$refs.fileInput.value = ''
    },

    removeFile(index) {
      this.files.splice(index, 1)
      this.isDirty = true
      this.$emit('files-selected', this.files)
    },

    addFiles(newFiles) {
      this.files = [...this.files, ...newFiles]
      this.isDirty = true
      this.formData = { files: this.files }
      this.$emit('files-selected', this.files)
    },

    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    onDragOver() {
      this.dragOver = true
    },

    onDragLeave() {
      this.dragOver = false
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }
  }
}
</script>
