export default {
  data() {
    return {
      isOpen: false,
      modalData: null,
      modalOptions: {}
    }
  },

  computed: {
    modalTitle() {
      return this.modalOptions.title || 'Modal'
    },

    hasData() {
      return !!this.modalData
    }
  },

  methods: {
    openModal(data, options) {
      this.modalData = data
      this.modalOptions = options || {}
      this.isOpen = true

      this.$nextTick(() => {
        this.$refs.modalOverlay?.focus()
      })
    },

    closeModal() {
      this.isOpen = false
      this.modalData = null
      this.modalOptions = {}
      this.$emit('modal-closed')
    },

    confirmModal() {
      this.$emit('modal-confirmed', this.modalData)
      this.closeModal()
    },

    _handleEscapeKey(event) {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeModal()
      }
    }
  },

  mounted() {
    document.addEventListener('keydown', this._handleEscapeKey)
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this._handleEscapeKey)
  }
}
