// Edge case: localStorage interaction via imported storage service
import { getItem, setItem } from '@/services/storage'

export default {
  data() {
    return {
      bookmarks: [],
      isBookmarked: false,
      bookmarkStorageKey: 'app_bookmarks'
    }
  },

  computed: {
    bookmarkCount() {
      return this.bookmarks.length
    },

    sortedBookmarks() {
      return [...this.bookmarks].sort((a, b) => {
        const dateA = new Date(a.addedAt || 0)
        const dateB = new Date(b.addedAt || 0)
        return dateB - dateA
      })
    }
  },

  methods: {
    toggleBookmark(item) {
      if (!item || !item.id) return

      const existing = this.bookmarks.find((b) => b.id === item.id)

      if (existing) {
        this.removeBookmark(item.id)
      } else {
        this.addBookmark(item)
      }
    },

    addBookmark(item) {
      if (!item || !item.id) return

      const alreadyExists = this.bookmarks.some((b) => b.id === item.id)
      if (alreadyExists) return

      const bookmark = {
        id: item.id,
        title: item.title || item.name || 'Untitled',
        type: item.type || 'item',
        addedAt: new Date().toISOString(),
        metadata: item.metadata || {}
      }

      this.bookmarks.push(bookmark)
      this.isBookmarked = true
      this._persistBookmarks()
      this.$emit('bookmark-added', bookmark)
    },

    removeBookmark(id) {
      const index = this.bookmarks.findIndex((b) => b.id === id)
      if (index === -1) return

      const removed = this.bookmarks.splice(index, 1)[0]
      this.isBookmarked = false
      this._persistBookmarks()
      this.$emit('bookmark-removed', removed)
    },

    loadBookmarks() {
      const stored = getItem(this.bookmarkStorageKey)

      if (stored) {
        try {
          this.bookmarks = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse bookmarks:', e)
          this.bookmarks = []
        }
      }
    },

    _persistBookmarks() {
      setItem(this.bookmarkStorageKey, JSON.stringify(this.bookmarks))
    },

    isItemBookmarked(itemId) {
      return this.bookmarks.some((b) => b.id === itemId)
    }
  },

  mounted() {
    this.loadBookmarks()
  }
}
