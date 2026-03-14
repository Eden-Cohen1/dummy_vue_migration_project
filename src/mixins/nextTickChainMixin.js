// Edge case: this.$nextTick().then(() => ...) chaining and await this.$nextTick().
// Tests promise-chain migration patterns.
export default {
  data() {
    return {
      tickCount: 0,
      pendingUpdates: [],
      domMeasurements: {},
      isUpdating: false
    }
  },

  methods: {
    updateAndMeasure() {
      this.isUpdating = true
      // Chained nextTick calls
      this.$nextTick().then(() => {
        this.tickCount++
        this.domMeasurements.firstPass = this.$el ? this.$el.offsetHeight : 0

        // Nested nextTick inside .then
        this.$nextTick().then(() => {
          this.tickCount++
          this.domMeasurements.secondPass = this.$el ? this.$el.offsetHeight : 0
          this.isUpdating = false
        })
      })
    },

    async asyncUpdate() {
      // await pattern
      this.pendingUpdates.push('start')
      await this.$nextTick()
      this.tickCount++
      this.pendingUpdates.push('after-first-tick')

      await this.$nextTick()
      this.tickCount++
      this.pendingUpdates.push('after-second-tick')
    },

    batchUpdate(items) {
      // Multiple updates followed by a single nextTick
      items.forEach(item => {
        this.pendingUpdates.push(item)
      })

      this.$nextTick(() => {
        // Callback-style nextTick
        this.tickCount++
        this.processPendingUpdates()
      })
    },

    processPendingUpdates() {
      const batch = [...this.pendingUpdates]
      this.pendingUpdates = []
      return batch
    },

    measureAfterRender() {
      return this.$nextTick().then(() => {
        return {
          height: this.$el ? this.$el.offsetHeight : 0,
          width: this.$el ? this.$el.offsetWidth : 0,
          tickCount: this.tickCount
        }
      })
    }
  }
}
