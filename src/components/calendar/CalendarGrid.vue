<template>
  <div class="calendar-grid">
    <!-- Month/Year Header with Navigation -->
    <div class="calendar-header">
      <button class="nav-btn" @click="prevMonth">&laquo;</button>
      <h3 class="month-year">{{ monthName }} {{ year }}</h3>
      <button class="nav-btn" @click="nextMonth">&raquo;</button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading events...</p>
    </div>

    <template v-else>
      <!-- Filter Bar -->
      <div class="filter-bar">
        <select v-model="activeFilter" class="filter-select" @change="applyFilters">
          <option value="all">All Events</option>
          <option value="meetings">Meetings</option>
          <option value="deadlines">Deadlines</option>
          <option value="reminders">Reminders</option>
        </select>
        <span class="timezone-info">{{ currentTimezone }}</span>
      </div>

      <!-- Weekday Headers -->
      <div class="weekday-row">
        <span v-for="day in localizedWeekdays" :key="day" class="weekday-label">{{ day }}</span>
      </div>

      <!-- Calendar Days -->
      <div class="days-grid">
        <div
          v-for="(day, idx) in calendarDays"
          :key="idx"
          :class="['day-cell', { today: day.isToday, 'other-month': !day.isCurrentMonth }]"
          @click="selectDay(day)"
        >
          <span class="day-number">{{ day.date }}</span>
          <div v-if="day.events && day.events.length > 0" class="event-dots">
            <span
              v-for="(evt, eIdx) in day.events.slice(0, 3)"
              :key="eIdx"
              :class="['event-dot', evt.type]"
              :title="evt.title"
            ></span>
            <span v-if="day.events.length > 3" class="more-events">+{{ day.events.length - 3 }}</span>
          </div>
        </div>
      </div>

      <!-- Event Detail Popover -->
      <div v-if="selectedDay && selectedDay.events && selectedDay.events.length > 0" class="event-popover">
        <h4 class="popover-title">Events on {{ selectedDay.date }}</h4>
        <ul class="event-list">
          <li v-for="evt in selectedDay.events" :key="evt.id" class="event-item">
            <span :class="['event-badge', evt.type]">{{ evt.type }}</span>
            <span class="event-name">{{ evt.title }}</span>
            <span class="event-time">{{ evt.time }}</span>
          </li>
        </ul>
        <button class="popover-close" @click="selectedDay = null">Close</button>
      </div>
    </template>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'
import filterMixin from '@/mixins/filterMixin'
import localeMixin from '@/mixins/localeMixin'
import timezoneMixin from '@/mixins/timezoneMixin'

export default {
  name: 'CalendarGrid',

  mixins: [loadingMixin, filterMixin, localeMixin, timezoneMixin],

  data() {
    return {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      activeFilter: 'all',
      selectedDay: null,
      calendarDays: [],
      localizedWeekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  },

  computed: {
    monthName() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
      return months[this.month]
    }
  },

  created() {
    this.buildCalendar()
  },

  methods: {
    prevMonth() {
      if (this.month === 0) { this.month = 11; this.year-- }
      else { this.month-- }
      this.buildCalendar()
    },

    nextMonth() {
      if (this.month === 11) { this.month = 0; this.year++ }
      else { this.month++ }
      this.buildCalendar()
    },

    buildCalendar() {
      const days = []
      const firstDay = new Date(this.year, this.month, 1).getDay()
      const daysInMonth = new Date(this.year, this.month + 1, 0).getDate()
      const today = new Date()

      const startOffset = (firstDay === 0 ? 6 : firstDay - 1)
      for (let i = startOffset; i > 0; i--) {
        days.push({ date: '', isCurrentMonth: false, isToday: false, events: [] })
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === today.getDate() && this.month === today.getMonth() && this.year === today.getFullYear()
        days.push({ date: d, isCurrentMonth: true, isToday, events: [] })
      }
      this.calendarDays = days
    },

    selectDay(day) {
      if (day.isCurrentMonth) this.selectedDay = day
    }
  }
}
</script>

<style scoped>
.calendar-grid { padding: 1rem; background: white; border-radius: 8px; border: 1px solid #e5e7eb; }
.calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.month-year { font-size: 1.125rem; font-weight: 600; }
.nav-btn { background: none; border: 1px solid #d1d5db; border-radius: 6px; padding: 0.25rem 0.75rem; cursor: pointer; font-size: 1rem; }
.filter-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.filter-select { padding: 0.3rem 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.8rem; }
.timezone-info { font-size: 0.7rem; color: #9ca3af; }
.weekday-row { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 0.25rem; }
.weekday-label { font-size: 0.75rem; font-weight: 600; color: #6b7280; padding: 0.25rem; }
.days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; }
.day-cell {
  min-height: 4rem; padding: 0.25rem; border: 1px solid #f3f4f6;
  cursor: pointer; position: relative;
}
.day-cell:hover { background: #f9fafb; }
.day-cell.today { background: #eff6ff; }
.day-cell.other-month { opacity: 0.3; }
.day-number { font-size: 0.8rem; font-weight: 500; }
.event-dots { display: flex; gap: 2px; margin-top: 0.25rem; flex-wrap: wrap; }
.event-dot { width: 6px; height: 6px; border-radius: 50%; }
.event-dot.meetings { background: #3b82f6; }
.event-dot.deadlines { background: #ef4444; }
.event-dot.reminders { background: #f59e0b; }
.more-events { font-size: 0.6rem; color: #9ca3af; }
.event-popover {
  margin-top: 1rem; padding: 1rem; background: #f9fafb;
  border: 1px solid #e5e7eb; border-radius: 8px;
}
.popover-title { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; }
.event-list { list-style: none; padding: 0; }
.event-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.3rem 0; font-size: 0.8rem; }
.event-badge {
  font-size: 0.65rem; padding: 1px 6px; border-radius: 4px;
  text-transform: capitalize; color: white;
}
.event-badge.meetings { background: #3b82f6; }
.event-badge.deadlines { background: #ef4444; }
.event-badge.reminders { background: #f59e0b; }
.event-time { color: #9ca3af; font-size: 0.75rem; }
.popover-close {
  margin-top: 0.5rem; background: none; border: 1px solid #d1d5db;
  border-radius: 6px; padding: 0.25rem 0.75rem; cursor: pointer; font-size: 0.8rem;
}
.loading-state { text-align: center; padding: 2rem; color: #6b7280; }
.spinner {
  width: 2rem; height: 2rem; margin: 0 auto 0.5rem;
  border: 3px solid #e5e7eb; border-top-color: #3b82f6;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
