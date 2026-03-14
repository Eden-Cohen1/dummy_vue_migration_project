// Edge case: Intl API usage with external utility import for date formatting
import { formatDate } from '@/utils/helpers'

export default {
  data() {
    return {
      currentTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezones: [
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'Europe/London',
        'Europe/Paris',
        'Europe/Berlin',
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Australia/Sydney',
        'Pacific/Auckland'
      ]
    }
  },

  computed: {
    timezoneOffset() {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: this.currentTimezone,
        timeZoneName: 'shortOffset'
      })

      const parts = formatter.formatToParts(now)
      const offsetPart = parts.find((p) => p.type === 'timeZoneName')
      return offsetPart ? offsetPart.value : 'UTC'
    },

    timezoneLabel() {
      const city = this.currentTimezone.split('/').pop().replace(/_/g, ' ')
      return `${city} (${this.timezoneOffset})`
    }
  },

  methods: {
    setTimezone(tz) {
      if (!this.timezones.includes(tz) && tz !== this.currentTimezone) {
        console.warn(`Timezone "${tz}" is not in the available list`)
      }

      this.currentTimezone = tz
      this.$emit('timezone-changed', tz)
    },

    convertTime(date, fromTz, toTz) {
      const sourceDate = date instanceof Date ? date : new Date(date)

      const sourceFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: fromTz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })

      const targetFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: toTz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })

      return {
        source: sourceFormatter.format(sourceDate),
        target: targetFormatter.format(sourceDate),
        formatted: formatDate(sourceDate)
      }
    },

    getLocalTime() {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: this.currentTimezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })

      return formatter.format(now)
    }
  }
}
