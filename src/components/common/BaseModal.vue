<template>
  <teleport to="body">
    <div v-if="isOpen" ref="modalOverlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold">{{ modalTitle }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div class="p-4">
          <slot :data="modalData">{{ modalData }}</slot>
        </div>
        <div class="flex justify-end gap-2 p-4 border-t">
          <button @click="closeModal" class="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50">Cancel</button>
          <button @click="confirmModal" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import modalMixin from '@/mixins/modalMixin'
import keyboardShortcutMixin from '@/mixins/keyboardShortcutMixin'

export default {
  name: 'BaseModal',

  mixins: [modalMixin, keyboardShortcutMixin],

  emits: ['modal-closed', 'modal-confirmed', 'shortcut-triggered'],

  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (this.$refs.modalOverlay) {
            this.$refs.modalOverlay.focus()
          }
        })
      }
    }
  },

  mounted() {
    this.registerShortcut('Escape', () => {
      if (this.isOpen) {
        this.closeModal()
      }
    })
  }
}
</script>
