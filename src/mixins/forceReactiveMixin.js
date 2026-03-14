// Edge case: this.$forceUpdate(), this.$set inside computed getter (anti-pattern),
// and this.$delete on array index. Tests unusual Vue 2 reactivity patterns.
export default {
  data() {
    return {
      staleData: {},
      refreshFlag: 0,
      items: [],
      lastForceUpdate: null
    }
  },

  computed: {
    derivedData() {
      // Access refreshFlag to force recomputation
      const _ = this.refreshFlag
      return Object.keys(this.staleData).map(key => ({
        key,
        value: this.staleData[key],
        computed: true
      }))
    }
  },

  methods: {
    forceRefresh() {
      // $forceUpdate usage
      this.$forceUpdate()
      this.lastForceUpdate = Date.now()
      this.refreshFlag++
    },

    patchData(key, value) {
      // $set on object that might not trigger reactivity otherwise
      this.$set(this.staleData, key, value)
    },

    removeByIndex(index) {
      // $delete on array
      this.$delete(this.items, index)
    },

    addItem(item) {
      this.items.push(item)
    },

    batchPatch(updates) {
      for (const [key, value] of Object.entries(updates)) {
        this.$set(this.staleData, key, value)
      }
      this.$forceUpdate()
    },

    clearStaleData() {
      const keys = Object.keys(this.staleData)
      keys.forEach(key => {
        this.$delete(this.staleData, key)
      })
    }
  }
}
