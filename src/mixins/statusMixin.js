// Edge case: Sibling collision — defines isLoading and error in data(), same names
// as fetchMixin. When both are used by ResourceViewer.vue, last-mixin-wins determines
// which data initializer takes effect.
export default {
  data() {
    return {
      isLoading: false,
      error: null,
      statusMessage: '',
      statusType: 'info'
    }
  },

  computed: {
    statusLabel() {
      if (this.isLoading) return 'Loading...'
      if (this.error) return 'Error'
      return this.statusMessage || 'Ready'
    },

    hasStatus() {
      return !!this.statusMessage
    }
  },

  methods: {
    setStatus(message, type = 'info') {
      this.statusMessage = message
      this.statusType = type
      this.error = null
    },

    clearStatus() {
      this.statusMessage = ''
      this.statusType = 'info'
    },

    setStatusError(message) {
      this.error = message
      this.statusType = 'error'
    }
  }
}
