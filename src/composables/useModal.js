import { ref, computed } from 'vue'

export function useModal() {
  const isOpen = ref(false)
  const modalData = ref(null)
  const modalOptions = ref({})

  const modalTitle = computed(() => modalOptions.value.title || 'Modal')
  const hasData = computed(() => modalData.value !== null)

  function openModal(data, options) {
    modalData.value = data
    modalOptions.value = options || {}
    isOpen.value = true
  }

  function closeModal() {
    isOpen.value = false
    modalData.value = null
    modalOptions.value = {}
  }

  function confirmModal() {
    const callback = modalOptions.value.onConfirm
    if (typeof callback === 'function') {
      callback(modalData.value)
    }
    closeModal()
  }

  return {
    isOpen,
    modalData,
    modalOptions,
    modalTitle,
    hasData,
    openModal,
    closeModal,
    confirmModal
  }
}
