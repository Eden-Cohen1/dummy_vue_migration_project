import { useTasksStore } from '@/stores/tasks'
import { api } from '@/services/api'
import { generateId, timeAgo } from '@/utils/helpers'

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
    },

    formattedComments() {
      return this.sortedComments.map(c => ({
        ...c,
        timeLabel: timeAgo(c.createdAt)
      }))
    }
  },

  methods: {
    async addComment() {
      if (!this.newComment.trim()) return

      const comment = {
        id: generateId(),
        text: this.newComment,
        createdAt: new Date().toISOString(),
        author: 'currentUser',
        parentId: null
      }

      const saved = await api.addComment({
        ...comment,
        taskId: this.entityId
      })

      this.comments.unshift(saved)
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

    async deleteComment(id) {
      await api.deleteComment(id)
      this.comments = this.comments.filter(c => c.id !== id)
    },

    async loadComments(entityId) {
      this.isLoadingComments = true
      const tasksStore = useTasksStore()
      // Ensure task is loaded before fetching comments
      if (!tasksStore.currentTask || tasksStore.currentTask.id !== entityId) {
        await tasksStore.fetchTask(entityId)
      }
      try {
        const data = await api.getComments(entityId)
        this.comments = data
      } finally {
        this.isLoadingComments = false
      }
    },

    replyToComment(parentId, text) {
      const reply = {
        id: generateId(),
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
