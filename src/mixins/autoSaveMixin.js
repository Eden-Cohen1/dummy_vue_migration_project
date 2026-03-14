// Edge case: Mixin that imports and nests another mixin (formMixin), timer cleanup
import formMixin from '@/mixins/formMixin'

export default {
  mixins: [formMixin],

  data() {
    return {
      autoSaveInterval: 30000,
      lastSavedAt: null,
      isSaving: false,
      autoSaveTimer: null,
      autoSaveEnabled: true
    }
  },

  computed: {
    hasUnsavedChanges() {
      return this.isDirty && !this.isSaving
    },

    timeSinceLastSave() {
      if (!this.lastSavedAt) {
        return 'Never saved'
      }

      const seconds = Math.floor((Date.now() - this.lastSavedAt) / 1000)

      if (seconds < 60) return `${seconds}s ago`
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
      return `${Math.floor(seconds / 3600)}h ago`
    }
  },

  methods: {
    startAutoSave() {
      this.stopAutoSave()

      if (!this.autoSaveEnabled) return

      this.autoSaveTimer = setInterval(() => {
        if (this.hasUnsavedChanges) {
          this.saveNow()
        }
      }, this.autoSaveInterval)
    },

    stopAutoSave() {
      if (this.autoSaveTimer) {
        clearInterval(this.autoSaveTimer)
        this.autoSaveTimer = null
      }
    },

    saveNow() {
      if (this.isSaving) return Promise.resolve()

      this.isSaving = true
      return this._performSave().then(() => {
        this.lastSavedAt = Date.now()
        this.isDirty = false
        this.$emit('auto-saved', this.formData)
      }).catch((error) => {
        console.error('Auto-save failed:', error)
        this.$emit('auto-save-error', error)
      }).finally(() => {
        this.isSaving = false
      })
    },

    _performSave() {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          resolve(this.formData)
        })
      })
    }
  },

  mounted() {
    this.startAutoSave()
  },

  beforeUnmount() {
    this.stopAutoSave()
  }
}
