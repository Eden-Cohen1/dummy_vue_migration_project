export default {
  data() {
    return {
      undoStack: [],
      redoStack: [],
      maxHistory: 50
    }
  },

  computed: {
    canUndo() {
      return this.undoStack.length > 0
    },

    canRedo() {
      return this.redoStack.length > 0
    },

    historyLength() {
      return this.undoStack.length
    }
  },

  methods: {
    pushState(state) {
      this.undoStack.push(state)
      if (this.undoStack.length > this.maxHistory) {
        this.undoStack.shift()
      }
      this.redoStack = []
      this.$emit('state-changed')
    },

    undo() {
      if (this.undoStack.length === 0) return null

      const state = this.undoStack.pop()
      this.redoStack.push(state)
      this.$emit('state-changed')
      return state
    },

    redo() {
      if (this.redoStack.length === 0) return null

      const state = this.redoStack.pop()
      this.undoStack.push(state)
      this.$emit('state-changed')
      return state
    },

    clearHistory() {
      this.undoStack = []
      this.redoStack = []
    }
  }
}
