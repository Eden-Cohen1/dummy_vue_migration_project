// Edge case: Sibling collision — also defines isLoading and error, same as statusMixin.
// In ResourceViewer.vue which uses [statusMixin, fetchMixin], fetchMixin's data
// initializers win because it comes last in the mixins array.
import api from '@/services/api'

export default {
  data() {
    return {
      isLoading: false,
      error: null,
      fetchUrl: '',
      fetchedData: null,
      lastFetchedAt: null
    }
  },

  computed: {
    hasFetchedData() {
      return this.fetchedData !== null
    },

    fetchAge() {
      if (!this.lastFetchedAt) return null
      return Date.now() - new Date(this.lastFetchedAt).getTime()
    }
  },

  methods: {
    async fetchData(url) {
      this.fetchUrl = url || this.fetchUrl
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get(this.fetchUrl)
        this.fetchedData = response.data
        this.lastFetchedAt = new Date().toISOString()
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    cancelFetch() {
      this.isLoading = false
    },

    clearFetchedData() {
      this.fetchedData = null
      this.lastFetchedAt = null
    }
  }
}
