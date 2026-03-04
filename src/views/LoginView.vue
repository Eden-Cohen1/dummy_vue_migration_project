<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <!-- Logo / Brand -->
      <div class="text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600">
          <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        <p class="mt-2 text-sm text-gray-600">
          Manage your projects and tasks in one place.
        </p>
      </div>

      <!-- Login Card -->
      <div class="rounded-lg bg-white px-8 py-10 shadow">
        <!-- Error Display -->
        <div
          v-if="errorMessage"
          class="mb-4 rounded-md bg-red-50 p-4"
        >
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
            </svg>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Login Form -->
        <form ref="form" class="space-y-6" @submit.prevent="handleLogin">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div class="mt-2">
              <input
                id="email"
                v-model="credentials.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                placeholder="you@example.com"
                class="block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div class="mt-2">
              <input
                id="password"
                v-model="credentials.password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                placeholder="Enter your password"
                class="block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="credentials.rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                v-if="isSubmitting"
                class="-ml-1 mr-2 h-5 w-5 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <!-- Auto-login Hint -->
        <div class="mt-6 rounded-md bg-blue-50 p-3">
          <p class="text-center text-sm text-blue-700">
            Use any credentials to login
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import authMixin from '@/mixins/authMixin'
import formMixin from '@/mixins/formMixin'
import validationMixin from '@/mixins/validationMixin'

export default {
  name: 'LoginView',

  mixins: [authMixin, formMixin, validationMixin],

  data() {
    return {
      credentials: {
        email: '',
        password: '',
        rememberMe: false
      },
      errorMessage: '',
      isSubmitting: false
    }
  },

  methods: {
    async handleLogin() {
      this.errorMessage = ''

      // Basic validation
      if (!this.credentials.email || !this.credentials.password) {
        this.errorMessage = 'Please enter both email and password.'
        return
      }

      this.isSubmitting = true
      try {
        const authStore = useAuthStore()
        await authStore.login({
          email: this.credentials.email,
          password: this.credentials.password
        })
        this.$router.push('/dashboard')
      } catch (error) {
        this.errorMessage = error.message || 'Login failed. Please try again.'
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>
