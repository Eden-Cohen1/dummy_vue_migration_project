<template>
  <div class="flex flex-col items-center justify-center py-16 px-4">
    <!-- Illustration -->
    <div class="w-24 h-24 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
      <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-gray-900 mb-2">
      {{ title }}
    </h3>

    <!-- Message -->
    <p class="text-sm text-gray-500 text-center max-w-sm mb-6">
      {{ message }}
    </p>

    <!-- Action button -->
    <button
      v-if="actionText"
      @click="handleAction"
      class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      {{ actionText }}
    </button>

    <!-- Error state from loadingMixin -->
    <div v-if="hasError" class="mt-6 text-center">
      <p class="text-sm text-red-500 mb-2">{{ error }}</p>
      <button
        v-if="canRetry"
        @click="retryAction"
        class="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Try again
      </button>
    </div>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'

export default {
  name: 'EmptyState',

  mixins: [loadingMixin],

  props: {
    title: {
      type: String,
      default: 'No data found'
    },
    message: {
      type: String,
      default: 'There are no items to display at this time. Try adjusting your filters or create a new item.'
    },
    actionText: {
      type: String,
      default: ''
    }
  },

  emits: ['action-clicked'],

  methods: {
    handleAction() {
      this.$emit('action-clicked')
    },

    retryAction() {
      this.retry(() => {
        this.$emit('action-clicked')
      })
    }
  }
}
</script>
