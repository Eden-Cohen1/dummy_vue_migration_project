// Edge case: Template-only usage target — ClipboardButton.vue uses members only in template,
// never in script. Tests whether the migration tool can detect template-based mixin member usage.
export default {
  data() {
    return {
      copiedText: '',
      isCopied: false,
      copyTimeout: null
    }
  },

  computed: {
    canCopy() {
      return !!navigator.clipboard
    },

    copyButtonLabel() {
      return this.isCopied ? 'Copied!' : 'Copy'
    }
  },

  methods: {
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
        this.copiedText = text
        this.isCopied = true

        if (this.copyTimeout) {
          clearTimeout(this.copyTimeout)
        }
        this.copyTimeout = setTimeout(() => {
          this.isCopied = false
        }, 2000)
      } catch (err) {
        console.error('Failed to copy text:', err)
      }
    },

    clearClipboard() {
      this.copiedText = ''
      this.isCopied = false
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout)
        this.copyTimeout = null
      }
    }
  }
}
