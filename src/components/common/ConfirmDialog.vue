<template>
  <teleport to="body">
    <div v-if="isOpen" ref="modalOverlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="cancelDialog">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <button @click="cancelDialog" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div class="p-6">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed">{{ message }}</p>
          </div>
        </div>
        <div class="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            @click="cancelDialog"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ cancelText }}
          </button>
          <button
            @click="confirmDialog"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import modalMixin from '@/mixins/modalMixin'

export default {
  name: 'ConfirmDialog',

  mixins: [modalMixin],

  props: {
    title: {
      type: String,
      default: 'Confirm Action'
    },
    message: {
      type: String,
      default: 'Are you sure you want to proceed?'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    }
  },

  emits: ['confirmed', 'cancelled', 'modal-closed', 'modal-confirmed'],

  methods: {
    confirmDialog() {
      this.$emit('confirmed')
      this.closeModal()
    },

    cancelDialog() {
      this.$emit('cancelled')
      this.closeModal()
    }
  }
}
</script>
