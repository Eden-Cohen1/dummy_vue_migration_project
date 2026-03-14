// Edge case: Composite mixin using loadingMixin AND notificationMixin. Calls
// this.startLoading() from loadingMixin and this.addNotification() from
// notificationMixin. Tests cross-mixin method resolution in chains.
import loadingMixin from '@/mixins/loadingMixin'
import notificationMixin from '@/mixins/notificationMixin'

export default {
  mixins: [loadingMixin, notificationMixin],

  data() {
    return {
      operationQueue: [],
      isProcessing: false,
      maxConcurrent: 3,
      completedOperations: 0
    }
  },

  computed: {
    pendingOperationCount() {
      return this.operationQueue.filter(op => op.status === 'pending').length
    },

    queueIsEmpty() {
      return this.operationQueue.length === 0
    },

    operationProgress() {
      if (this.operationQueue.length === 0) return 100
      return Math.round((this.completedOperations / this.operationQueue.length) * 100)
    }
  },

  methods: {
    enqueueOperation(operation) {
      this.operationQueue.push({
        ...operation,
        id: Date.now() + Math.random(),
        status: 'pending',
        retries: 0
      })
    },

    async processQueue() {
      if (this.isProcessing) return
      this.isProcessing = true
      this.startLoading('Processing operations...')

      const pending = this.operationQueue.filter(op => op.status === 'pending')
      const batch = pending.slice(0, this.maxConcurrent)

      try {
        await Promise.all(batch.map(op => this.executeOperation(op)))
        this.addNotification({
          type: 'success',
          title: 'Operations completed',
          message: `${batch.length} operations processed successfully`
        })
      } catch (err) {
        this.addNotification({
          type: 'error',
          title: 'Operation failed',
          message: err.message
        })
      } finally {
        this.isProcessing = false
        this.stopLoading()
      }
    },

    async executeOperation(operation) {
      operation.status = 'running'
      try {
        if (typeof operation.handler === 'function') {
          await operation.handler()
        }
        operation.status = 'completed'
        this.completedOperations++
      } catch (err) {
        operation.status = 'failed'
        operation.error = err.message
      }
    },

    retryOperation(operationId) {
      const op = this.operationQueue.find(o => o.id === operationId)
      if (op && op.status === 'failed' && op.retries < 3) {
        op.status = 'pending'
        op.retries++
        op.error = null
      }
    },

    clearQueue() {
      this.operationQueue = []
      this.completedOperations = 0
    }
  }
}
