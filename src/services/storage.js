// Local storage abstraction with JSON serialization and fallback
// Used by cacheMixin, themeMixin, authMixin, bookmarkMixin

const PREFIX = 'pm_app_'

export function getItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw !== null ? JSON.parse(raw) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeItem(key) {
  localStorage.removeItem(PREFIX + key)
}

export function clear() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k))
}

export function hasItem(key) {
  return localStorage.getItem(PREFIX + key) !== null
}
