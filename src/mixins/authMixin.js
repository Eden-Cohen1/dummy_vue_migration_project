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
    login(credentials) {
      try {
        this.loginAttempts++
        this.user = credentials
        this.isAuthenticated = true
        this.authError = null
        this.$emit('auth-changed')
      } catch (error) {
        this.authError = error.message
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      this.authError = null
      this.$router.push('/login')
    },

    checkAuth() {
      const token = localStorage.getItem('token')
      if (token) {
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
