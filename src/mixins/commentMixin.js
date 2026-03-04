export default {
  data() {
    return {
      comments: [],
      newComment: '',
      editingComment: null,
      isLoadingComments: false
    }
  },

  computed: {
    commentCount() {
      return this.comments.length
    },

    sortedComments() {
      return [...this.comments].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    },

    hasComments() {
      return this.comments.length > 0
    }
  },

  methods: {
    addComment() {
      if (!this.newComment.trim()) return

      const comment = {
        id: Date.now(),
        text: this.newComment,
        createdAt: new Date().toISOString(),
        author: 'currentUser',
        parentId: null
      }

      this.comments.unshift(comment)
      this.newComment = ''

      this.$refs.commentInput?.focus()
      this.$emit('comment-added')
      this.$nextTick(() => {
        // DOM updated after comment added
      })
    },

    editComment(id, text) {
      const comment = this.comments.find(c => c.id === id)
      if (comment) {
        comment.text = text
        comment.updatedAt = new Date().toISOString()
        this.editingComment = null
      }
    },

    deleteComment(id) {
      this.comments = this.comments.filter(c => c.id !== id)
    },

    loadComments(entityId) {
      this.isLoadingComments = true
      // Simulate API call to load comments
      setTimeout(() => {
        this.comments = []
        this.isLoadingComments = false
      }, 500)
    },

    replyToComment(parentId, text) {
      const reply = {
        id: Date.now(),
        text: text,
        createdAt: new Date().toISOString(),
        author: 'currentUser',
        parentId: parentId
      }

      this.comments.unshift(reply)
    }
  },

  mounted() {
    if (this.entityId) {
      this.loadComments(this.entityId)
    }
  }
}
