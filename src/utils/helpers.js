const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Formats a date into "MMM DD, YYYY" format.
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatDate(date) {
  const d = new Date(date);
  const month = MONTHS[d.getMonth()];
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}

/**
 * Formats a date into "MMM DD, YYYY HH:mm" format.
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatDateTime(date) {
  const d = new Date(date);
  const month = MONTHS[d.getMonth()];
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${month} ${day}, ${year} ${hours}:${minutes}`;
}

/**
 * Returns a human-readable relative time string such as "2 hours ago" or "3 days ago".
 * @param {Date|string|number} date
 * @returns {string}
 */
export function timeAgo(date) {
  const now = Date.now();
  const past = new Date(date).getTime();
  const diffMs = now - past;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  } else if (diffWeeks < 5) {
    return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
  } else if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
  } else {
    return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
  }
}

/**
 * Generates a random string id.
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Standard debounce function. Returns a debounced version of the given function
 * that delays invocation until after `delay` milliseconds have elapsed since
 * the last time the debounced function was called.
 * @param {Function} fn
 * @param {number} delay - milliseconds
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**
 * Truncates a string to the specified length and appends "..." if it exceeds that length.
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export function truncate(str, length) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Returns a Tailwind CSS color class based on the given priority level.
 * @param {'low'|'medium'|'high'|'critical'} priority
 * @returns {string}
 */
export function getPriorityColor(priority) {
  const colors = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-orange-500',
    critical: 'text-red-500',
  };
  return colors[priority] || 'text-gray-500';
}

/**
 * Returns a Tailwind CSS color class based on the given task status.
 * @param {'todo'|'in-progress'|'review'|'done'} status
 * @returns {string}
 */
export function getStatusColor(status) {
  const colors = {
    'todo': 'text-gray-500',
    'in-progress': 'text-blue-500',
    'review': 'text-yellow-500',
    'done': 'text-green-500',
  };
  return colors[status] || 'text-gray-500';
}
