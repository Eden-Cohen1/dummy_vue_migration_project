// Edge case: Custom Vue plugin that adds instance methods via globalProperties.
// Tests detection of this.$toast and this.$confirm as plugin-provided methods.

export default {
  install(app) {
    app.config.globalProperties.$toast = function (message, type = 'info', duration = 3000) {
      const toast = document.createElement('div')
      toast.className = `toast toast-${type}`
      toast.textContent = message
      document.body.appendChild(toast)

      setTimeout(() => {
        toast.classList.add('toast-fade-out')
        setTimeout(() => toast.remove(), 300)
      }, duration)
    }

    app.config.globalProperties.$confirm = function (message, options = {}) {
      return new Promise((resolve) => {
        const result = window.confirm(message)
        resolve(result)
      })
    }
  }
}
