export default {
  data() {
    return {
      isDragging: false,
      dragItem: null,
      dropTarget: null,
      dragOverIndex: -1
    }
  },

  computed: {
    hasDragItem() {
      return !!this.dragItem
    },

    dropPosition() {
      if (this.dragOverIndex < 0) {
        return 'none'
      }
      return this.dragOverIndex
    }
  },

  methods: {
    onDragStart(event, item) {
      this.isDragging = true
      this.dragItem = item
      event.dataTransfer.effectAllowed = 'move'

      if (this.$refs.dragContainer) {
        this.$refs.dragContainer.classList.add('dragging')
      }
      this.$el.classList.add('drag-active')
    },

    onDragOver(event, index) {
      event.preventDefault()
      this.dragOverIndex = index
    },

    onDrop(event) {
      event.preventDefault()
      this.$emit('item-reordered', {
        item: this.dragItem,
        newIndex: this.dragOverIndex
      })

      this.isDragging = false
      this.dragItem = null
      this.dropTarget = null
      this.dragOverIndex = -1
    },

    onDragEnd() {
      this.isDragging = false
      this.dragItem = null
      this.dropTarget = null
      this.dragOverIndex = -1

      if (this.$refs.dragContainer) {
        this.$refs.dragContainer.classList.remove('dragging')
      }
      this.$el.classList.remove('drag-active')
    }
  }
}
