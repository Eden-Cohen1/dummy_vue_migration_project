// Edge case: Intentionally MISSING refreshToken method.
// authMixin has refreshToken(), but this composable omits it.
// Tests BLOCKED_NOT_RETURNED for a critical auth method.
import { ref, computed } from 'vue'

export function useAuth() {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const authError = ref(null)
  const loginAttempts = ref(0)

  const isAdmin = computed(() => {
    return user.value?.role === 'admin'
  })

  const userDisplayName = computed(() => {
    if (!user.value) return 'Guest'
    return user.value.name || user.value.email || 'Unknown'
  })

  const hasPermission = computed(() => {
    return isAuthenticated.value
  })

  function login(credentials) {
    loginAttempts.value++
    authError.value = null
    // Simulated login
    if (credentials.email && credentials.password) {
      user.value = { id: 1, name: credentials.email, role: 'user' }
      isAuthenticated.value = true
      return true
    }
    authError.value = 'Invalid credentials'
    return false
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
  }

  function checkAuth() {
    // Check stored token
    const token = localStorage.getItem('auth_token')
    if (token) {
      isAuthenticated.value = true
    }
  }

  // NOTE: refreshToken intentionally NOT implemented

  return {
    user,
    isAuthenticated,
    authError,
    loginAttempts,
    isAdmin,
    userDisplayName,
    hasPermission,
    login,
    logout,
    checkAuth
    // NOTE: refreshToken intentionally NOT returned
  }
}
