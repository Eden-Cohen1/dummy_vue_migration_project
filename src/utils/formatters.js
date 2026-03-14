// Formatting utilities for display
// Used by exportMixin, reportMixin, and dashboard components

export function formatCurrency(value, currency = 'USD', locale = 'en-US') {
  if (value == null) return ''
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
}

export function formatPercentage(value, decimals = 1) {
  if (value == null) return ''
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours < 24) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
}

export function formatNumber(value, locale = 'en-US') {
  if (value == null) return ''
  return new Intl.NumberFormat(locale).format(value)
}

export function truncate(str, maxLength = 50) {
  if (!str || str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}
