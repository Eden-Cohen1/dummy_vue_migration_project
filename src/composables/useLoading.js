import { ref, computed } from 'vue'

export function useLoading() {
  const isLoading = ref(false)
  const loadingMessage = ref('')
  const error = ref(null)
  const retryCount = ref(0)

  const hasError = computed(() => error.value !== null)
  const canRetry = computed(() => retryCount.value < 3)

  function startLoading(msg) {
    isLoading.value = true
    loadingMessage.value = msg || ''
    error.value = null
  }

  function stopLoading() {
    isLoading.value = false
    loadingMessage.value = ''
  }

  function setError(err) {
    error.value = err
    isLoading.value = false
  }

  async function retry(fn) {
    if (!canRetry.value) return
    retryCount.value++
    try {
      startLoading('Retrying...')
      await fn()
      stopLoading()
    } catch (err) {
      setError(err)
    }
  }

  return {
    isLoading,
    loadingMessage,
    error,
    retryCount,
    hasError,
    canRetry,
    startLoading,
    stopLoading,
    setError,
    retry
  }
}
