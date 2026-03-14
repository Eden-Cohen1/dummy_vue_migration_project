// Edge case: Defines `items` in data (array of tags), which collides with component props
// named `items` in TagEditor.vue. Tests prop vs mixin data name collision behavior.
export default {
  data() {
    return {
      items: [],
      tagInput: '',
      maxTags: 10,
      tagSuggestions: []
    }
  },

  computed: {
    tagCount() {
      return this.items.length
    },

    hasReachedMax() {
      return this.items.length >= this.maxTags
    },

    uniqueTags() {
      return [...new Set(this.items.map((tag) => tag.toLowerCase()))]
    }
  },

  methods: {
    addTag(tag) {
      const normalizedTag = tag.trim()
      if (!normalizedTag) return
      if (this.hasReachedMax) return
      if (this.items.includes(normalizedTag)) return

      this.items.push(normalizedTag)
      this.tagInput = ''
      this.$emit('tags-changed', this.items)
    },

    removeTag(index) {
      if (index >= 0 && index < this.items.length) {
        this.items.splice(index, 1)
        this.$emit('tags-changed', this.items)
      }
    },

    clearTags() {
      this.items = []
      this.$emit('tags-changed', this.items)
    },

    filterSuggestions(query) {
      if (!query.trim()) {
        this.tagSuggestions = []
        return
      }
      const lowerQuery = query.toLowerCase()
      this.tagSuggestions = ['bug', 'feature', 'enhancement', 'documentation', 'urgent', 'low-priority', 'backend', 'frontend', 'devops', 'testing']
        .filter((s) => s.includes(lowerQuery) && !this.items.includes(s))
    }
  }
}
