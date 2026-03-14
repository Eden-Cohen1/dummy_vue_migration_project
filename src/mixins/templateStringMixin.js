// Edge case: Template literals containing ${this.value}. A string-based parser must
// rewrite this.itemName inside ${} but NOT mistake backtick strings for code blocks.
export default {
  data() {
    return {
      itemName: '',
      itemId: null,
      messageTemplate: 'Hello, {name}',
      baseUrl: '/api/v2'
    }
  },

  computed: {
    displayLabel() {
      return this.itemName || 'Unnamed'
    }
  },

  methods: {
    formatMessage(recipient) {
      // Template literal with this.xxx inside interpolation
      return `Dear ${this.itemName}, your item #${this.itemId} is ready.`
    },

    buildApiUrl(action) {
      // Nested template literal
      return `${this.baseUrl}/items/${this.itemId}/${action}`
    },

    buildNotification(type) {
      // Template literal with expression
      const status = type === 'success' ? 'completed' : 'failed'
      return `Operation ${status} for "${this.itemName}" (ID: ${this.itemId})`
    },

    generateHtml() {
      // Multi-line template literal with this references
      return `
        <div class="item-card">
          <h3>${this.itemName}</h3>
          <p>ID: ${this.itemId}</p>
          <span>${this.displayLabel}</span>
        </div>
      `
    },

    // String that looks like code but is just text
    getDocumentation() {
      return 'Use this.itemName to access the name. Call this.$emit to fire events.'
    }
  }
}
