import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'

export default {
  data() {
    return {
      user: null,
      isAuthenticated: false,
      authError: null,
      loginAttempts: 0
    }
  },

  computed: {
    isAdmin() {
      return this.user?.role === 'admin'
    },

    userDisplayName() {
      return this.user
        ? this.user.firstName + ' ' + this.user.lastName
        : 'Guest'
    },

    hasPermission() {
      return this.isAuthenticated && this.user
    }
  },

  methods: {
    async login(credentials) {
      try {
        this.loginAttempts++

        const authStore = useAuthStore()
        await authStore.login(credentials)

        this.user = authStore.user
        this.isAuthenticated = true
        this.authError = null
        this.$emit('auth-changed')
      } catch (error) {
        this.authError = error.message
      }
    },

    logout() {
      const authStore = useAuthStore()
      authStore.logout()

      this.user = null
      this.isAuthenticated = false
      this.authError = null
      this.$router.push('/login')
    },

    checkAuth() {
      const authStore = useAuthStore()
      authStore.checkSession()

      if (authStore.isAuthenticated) {
        this.user = authStore.user
        this.isAuthenticated = true
      }
    },

    refreshToken() {
      return new Promise((resolve) => {
        setTimeout(() => {
          localStorage.setItem('token', 'refreshed-token-' + Date.now())
          resolve(true)
        }, 100)
      })
    }
  },

  created() {
    this.checkAuth()
  }
}
