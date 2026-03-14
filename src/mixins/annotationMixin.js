// Edge case: Content annotations with selection tracking and color management.
// Tests migration of methods that manipulate arrays with unique IDs and
// computed properties that sort/filter annotation collections.
export default {
  data() {
    return {
      annotations: [],
      selectedAnnotation: null,
      isAnnotating: false,
      annotationColor: '#ffeb3b'
    }
  },

  computed: {
    annotationCount() {
      return this.annotations.length
    },

    hasAnnotations() {
      return this.annotations.length > 0
    },

    sortedAnnotations() {
      return [...this.annotations].sort((a, b) => {
        if (a.range && b.range) {
          return a.range.start - b.range.start
        }
        return (a.createdAt || 0) - (b.createdAt || 0)
      })
    }
  },

  methods: {
    addAnnotation(range, text) {
      const annotation = {
        id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        range: range,
        text: text,
        color: this.annotationColor,
        createdAt: Date.now(),
        author: this.$store ? this.$store.getters.currentUser : null
      }
      this.annotations.push(annotation)
      this.$emit('annotation-added', annotation)
      return annotation
    },

    removeAnnotation(id) {
      const index = this.annotations.findIndex(a => a.id === id)
      if (index !== -1) {
        const removed = this.annotations.splice(index, 1)[0]
        if (this.selectedAnnotation && this.selectedAnnotation.id === id) {
          this.selectedAnnotation = null
        }
        this.$emit('annotation-removed', removed)
      }
    },

    selectAnnotation(id) {
      this.selectedAnnotation = this.annotations.find(a => a.id === id) || null
      this.$emit('annotation-selected', this.selectedAnnotation)
    },

    clearAnnotations() {
      this.annotations = []
      this.selectedAnnotation = null
      this.$emit('annotations-cleared')
    },

    updateAnnotation(id, changes) {
      const annotation = this.annotations.find(a => a.id === id)
      if (annotation) {
        Object.assign(annotation, changes, { updatedAt: Date.now() })
        this.$emit('annotation-updated', annotation)
      }
    }
  }
}
