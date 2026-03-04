<template>
  <div v-if="isLoading">
    <!-- Overlay mode -->
    <div
      v-if="overlay"
      class="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="relative">
          <div class="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        </div>
        <p v-if="displayMessage" class="text-sm font-medium text-gray-600 animate-pulse">
          {{ displayMessage }}
        </p>
        <div v-if="hasError" class="mt-2 text-center">
          <p class="text-sm text-red-600 mb-2">{{ error }}</p>
          <button
            v-if="canRetry"
            @click="$emit('retry')"
            class="px-4 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            Retry ({{ 3 - retryCount }} attempts left)
          </button>
        </div>
      </div>
    </div>

    <!-- Inline mode -->
    <div v-else class="flex flex-col items-center justify-center py-8 gap-3">
      <div class="relative">
        <div class="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
      </div>
      <p v-if="displayMessage" class="text-sm text-gray-500">
        {{ displayMessage }}
      </p>
      <div v-if="hasError" class="mt-2 text-center">
        <p class="text-sm text-red-500 mb-2">{{ error }}</p>
        <button
          v-if="canRetry"
          @click="$emit('retry')"
          class="px-3 py-1 text-xs font-medium text-red-600 border border-red-300 rounded hover:bg-red-50"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'

export default {
  name: 'LoadingSpinner',

  mixins: [loadingMixin],

  props: {
    message: {
      type: String,
      default: ''
    },
    overlay: {
      type: Boolean,
      default: false
    }
  },

  emits: ['retry'],

  computed: {
    displayMessage() {
      return this.message || this.loadingMessage || 'Loading...'
    }
  },

  watch: {
    message: {
      immediate: true,
      handler(newMsg) {
        if (newMsg) {
          this.startLoading(newMsg)
        }
      }
    }
  }
}
</script>
