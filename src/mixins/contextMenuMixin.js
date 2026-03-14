// Edge case: Right-click context menu with dynamic positioning and event listeners.
// Tests migration of DOM event handling (addEventListener/removeEventListener)
// and computed properties that filter menu items by visibility.
export default {
  data() {
    return {
      contextMenuItems: [],
      isContextMenuVisible: false,
      contextMenuPosition: { x: 0, y: 0 }
    }
  },

  computed: {
    visibleMenuItems() {
      return this.contextMenuItems.filter(item => {
        if (typeof item.visible === 'function') return item.visible()
        return item.visible !== false
      })
    },

    hasMenuItems() {
      return this.visibleMenuItems.length > 0
    }
  },

  methods: {
    showContextMenu(event, items) {
      event.preventDefault()
      event.stopPropagation()

      if (items) {
        this.contextMenuItems = items
      }

      this.positionMenu(event)
      this.isContextMenuVisible = true

      this.$nextTick(() => {
        document.addEventListener('click', this._handleOutsideClick)
        document.addEventListener('contextmenu', this._handleOutsideClick)
      })
    },

    hideContextMenu() {
      this.isContextMenuVisible = false
      document.removeEventListener('click', this._handleOutsideClick)
      document.removeEventListener('contextmenu', this._handleOutsideClick)
    },

    executeAction(item) {
      if (item.disabled) return
      if (typeof item.action === 'function') {
        item.action()
      }
      this.hideContextMenu()
      this.$emit('context-action', item)
    },

    positionMenu(event) {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const menuWidth = 200
      const menuHeight = this.contextMenuItems.length * 36

      let x = event.clientX
      let y = event.clientY

      if (x + menuWidth > viewportWidth) {
        x = viewportWidth - menuWidth - 8
      }
      if (y + menuHeight > viewportHeight) {
        y = viewportHeight - menuHeight - 8
      }

      this.contextMenuPosition = { x, y }
    },

    _handleOutsideClick() {
      this.hideContextMenu()
    }
  },

  beforeDestroy() {
    document.removeEventListener('click', this._handleOutsideClick)
    document.removeEventListener('contextmenu', this._handleOutsideClick)
  }
}
