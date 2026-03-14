// Edge case: @mention autocomplete in text inputs with cursor position tracking.
// Tests migration of DOM manipulation (selectionStart, input element refs)
// and methods that coordinate popup positioning with text insertion.
export default {
  data() {
    return {
      mentionQuery: '',
      mentionResults: [],
      isMentioning: false,
      mentionPosition: { x: 0, y: 0 },
      mentionTrigger: '@'
    }
  },

  computed: {
    hasMentionResults() {
      return this.mentionResults.length > 0
    },

    filteredMentionResults() {
      if (!this.mentionQuery) return this.mentionResults
      const query = this.mentionQuery.toLowerCase()
      return this.mentionResults.filter(user => {
        const name = (user.name || '').toLowerCase()
        const email = (user.email || '').toLowerCase()
        return name.includes(query) || email.includes(query)
      })
    }
  },

  methods: {
    startMention(event) {
      const input = event.target
      const value = input.value || ''
      const cursorPos = input.selectionStart

      // Check if the character before cursor is the trigger
      const charBefore = value.charAt(cursorPos - 1)
      if (charBefore !== this.mentionTrigger) {
        this.cancelMention()
        return
      }

      this.isMentioning = true

      // Extract query text after the trigger
      const afterTrigger = value.substring(cursorPos)
      const spaceIndex = afterTrigger.indexOf(' ')
      this.mentionQuery = spaceIndex === -1 ? afterTrigger : afterTrigger.substring(0, spaceIndex)

      // Position the mention dropdown near the cursor
      const rect = input.getBoundingClientRect()
      this.mentionPosition = {
        x: rect.left + (cursorPos * 8),
        y: rect.bottom + 4
      }

      this.searchUsers(this.mentionQuery)
    },

    selectMention(user) {
      this.$emit('mention-selected', user)
      this.isMentioning = false
      this.mentionQuery = ''
      this.mentionResults = []
    },

    cancelMention() {
      this.isMentioning = false
      this.mentionQuery = ''
      this.mentionResults = []
    },

    searchUsers(query) {
      // Simulated user search — components should override this
      const allUsers = this.$store ? this.$store.state.users || [] : []
      const q = (query || '').toLowerCase()
      this.mentionResults = allUsers.filter(u => {
        return (u.name || '').toLowerCase().includes(q)
      }).slice(0, 10)
    },

    insertMention(user, inputEl) {
      if (!inputEl) return
      const value = inputEl.value || ''
      const cursorPos = inputEl.selectionStart
      const triggerIndex = value.lastIndexOf(this.mentionTrigger, cursorPos)

      if (triggerIndex === -1) return

      const before = value.substring(0, triggerIndex)
      const after = value.substring(cursorPos)
      const mentionText = `${this.mentionTrigger}${user.name || user.username} `

      inputEl.value = before + mentionText + after
      const newPos = before.length + mentionText.length
      inputEl.setSelectionRange(newPos, newPos)

      this.cancelMention()
      this.$emit('mention-inserted', user)
    }
  }
}
