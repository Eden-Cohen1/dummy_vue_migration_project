// Validation helper functions
// Used by validationMixin and formMixin consumers

export function required(value) {
  if (Array.isArray(value)) return value.length > 0 || 'This field is required'
  return !!value || 'This field is required'
}

export function minLength(min) {
  return (value) => {
    if (!value) return true
    return value.length >= min || `Minimum ${min} characters required`
  }
}

export function maxLength(max) {
  return (value) => {
    if (!value) return true
    return value.length <= max || `Maximum ${max} characters allowed`
  }
}

export function email(value) {
  if (!value) return true
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(value) || 'Invalid email address'
}

export function numeric(value) {
  if (!value && value !== 0) return true
  return !isNaN(Number(value)) || 'Must be a number'
}

export function pattern(regex, message = 'Invalid format') {
  return (value) => {
    if (!value) return true
    return regex.test(value) || message
  }
}

export function between(min, max) {
  return (value) => {
    if (!value && value !== 0) return true
    const num = Number(value)
    return (num >= min && num <= max) || `Must be between ${min} and ${max}`
  }
}
