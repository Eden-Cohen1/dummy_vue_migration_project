// Edge case: File API usage with validation and this.$emit for upload events
export default {
  data() {
    return {
      files: [],
      maxFileSize: 10485760,
      allowedTypes: ['image/png', 'image/jpeg', 'application/pdf'],
      uploadProgress: 0,
      isUploading: false
    }
  },

  computed: {
    hasFiles() {
      return this.files.length > 0
    },

    totalFileSize() {
      return this.files.reduce((sum, file) => sum + (file.size || 0), 0)
    },

    formattedTotalSize() {
      const bytes = this.totalFileSize
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
      return `${(bytes / 1048576).toFixed(1)} MB`
    }
  },

  methods: {
    handleFileSelect(event) {
      const selectedFiles = event.target.files || event.dataTransfer.files
      if (!selectedFiles || selectedFiles.length === 0) return

      Array.from(selectedFiles).forEach((file) => {
        const validation = this.validateFile(file)
        if (validation.valid) {
          this.files.push({
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            id: Date.now() + Math.random().toString(36).slice(2),
            status: 'pending'
          })
        } else {
          this.$emit('file-error', { file: file.name, error: validation.error })
        }
      })
    },

    uploadFile(file) {
      this.isUploading = true
      this.uploadProgress = 0

      const entry = this.files.find((f) => f.id === file.id)
      if (entry) entry.status = 'uploading'

      return new Promise((resolve) => {
        const interval = setInterval(() => {
          this.uploadProgress = Math.min(this.uploadProgress + 10, 100)
          if (this.uploadProgress >= 100) {
            clearInterval(interval)
            if (entry) entry.status = 'completed'
            this.isUploading = false
            this.$emit('file-uploaded', file)
            resolve(file)
          }
        }, 100)
      })
    },

    removeFile(index) {
      if (index >= 0 && index < this.files.length) {
        const removed = this.files.splice(index, 1)
        this.$emit('file-removed', removed[0])
      }
    },

    validateFile(file) {
      if (file.size > this.maxFileSize) {
        return { valid: false, error: `File exceeds maximum size of ${this.maxFileSize / 1048576}MB` }
      }

      if (this.allowedTypes.length > 0 && !this.allowedTypes.includes(file.type)) {
        return { valid: false, error: `File type "${file.type}" is not allowed` }
      }

      return { valid: true, error: null }
    }
  }
}
