// Edge case: Regex literals with braces /\{[a-z]+\}/g. A brace-counting parser
// must not treat regex braces as scope delimiters.
export default {
  data() {
    return {
      pattern: '',
      inputText: '',
      matchResults: [],
      replacementMap: {}
    }
  },

  computed: {
    matchCount() {
      return this.matchResults.length
    },

    isValidInput() {
      return this.inputText.length > 0
    }
  },

  methods: {
    matchPlaceholders() {
      // Regex with braces — must not confuse parser
      const placeholderRegex = /\{[a-z]+\}/g
      this.matchResults = this.inputText.match(placeholderRegex) || []
      return this.matchResults
    },

    matchDoubleBraces() {
      // More braces in regex
      const templateRegex = /\{\{(\w+)\}\}/g
      const matches = []
      let match
      while ((match = templateRegex.exec(this.inputText)) !== null) {
        matches.push({ full: match[0], key: match[1], index: match.index })
      }
      return matches
    },

    replaceTokens(template, values) {
      // Regex replacement with braces
      return template.replace(/\{(\w+)\}/g, (match, key) => {
        return values[key] !== undefined ? values[key] : match
      })
    },

    validateEmail(email) {
      // Complex regex with no braces (control case)
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },

    extractNumbers() {
      // Regex with quantifier braces {2,4}
      const pattern = /\d{2,4}/g
      return this.inputText.match(pattern) || []
    },

    sanitizeHtml(html) {
      // Regex to strip HTML tags (contains angle brackets and slashes)
      return html.replace(/<\/?[^>]+(>|$)/g, '')
    }
  }
}
