<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="text-center">
      <!-- 404 Illustration -->
      <div class="mx-auto mb-8">
        <svg class="mx-auto h-40 w-40 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke-width="0.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>

      <!-- Error Code -->
      <h1 class="text-9xl font-extrabold tracking-widest text-indigo-600">404</h1>

      <!-- Message -->
      <h2 class="mt-4 text-3xl font-bold text-gray-900">Page not found</h2>
      <p class="mt-4 text-lg text-gray-500">
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>

      <!-- Actions -->
      <div class="mt-8 flex items-center justify-center space-x-4">
        <button
          class="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="goHome"
        >
          <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clip-rule="evenodd" />
          </svg>
          Go Home
        </button>

        <button
          class="inline-flex items-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          @click="$router.back()"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'

export default {
  name: 'NotFoundView',

  mixins: [loadingMixin],

  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>
