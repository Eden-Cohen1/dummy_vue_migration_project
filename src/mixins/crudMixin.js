// Edge case: Base of diamond dependency — both entityListMixin and entityDetailMixin
// extend this mixin. When a component uses both branches, crudMixin members (items,
// currentItem, isLoading, error, fetchAll, etc.) should appear once, not duplicated.
import api from '@/services/api'

export default {
  data() {
    return {
      items: [],
      currentItem: null,
      isLoading: false,
      error: null
    }
  },

  computed: {
    itemCount() {
      return this.items.length
    },

    isEmpty() {
      return this.items.length === 0
    }
  },

  methods: {
    async fetchAll(endpoint) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get(endpoint)
        this.items = response.data || []
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    async fetchOne(endpoint, id) {
      this.isLoading = true
      try {
        const response = await api.get(`${endpoint}/${id}`)
        this.currentItem = response.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    async createItem(endpoint, data) {
      const response = await api.post(endpoint, data)
      this.items.push(response.data)
      return response.data
    },

    async updateItem(endpoint, id, data) {
      const response = await api.put(`${endpoint}/${id}`, data)
      const index = this.items.findIndex(item => item.id === id)
      if (index !== -1) this.items.splice(index, 1, response.data)
      this.currentItem = response.data
      return response.data
    },

    async deleteItem(endpoint, id) {
      await api.delete(`${endpoint}/${id}`)
      this.items = this.items.filter(item => item.id !== id)
      if (this.currentItem && this.currentItem.id === id) {
        this.currentItem = null
      }
    }
  }
}
