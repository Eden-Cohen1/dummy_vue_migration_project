<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Calendar</h1>
      <p class="mt-1 text-sm text-gray-500">View tasks and deadlines on a calendar.</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>

    <div v-else class="rounded-lg bg-white p-6 shadow">
      <!-- Month Navigation Header -->
      <div class="mb-6 flex items-center justify-between">
        <button
          class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          @click="prevMonth"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <h2 class="text-xl font-semibold text-gray-900">{{ monthName }} {{ currentMonth.getFullYear() }}</h2>

        <button
          class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          @click="nextMonth"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <!-- Day-of-Week Headers -->
      <div class="mb-2 grid grid-cols-7 gap-px text-center text-sm font-semibold text-gray-700">
        <div class="py-2">Sun</div>
        <div class="py-2">Mon</div>
        <div class="py-2">Tue</div>
        <div class="py-2">Wed</div>
        <div class="py-2">Thu</div>
        <div class="py-2">Fri</div>
        <div class="py-2">Sat</div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-px rounded-lg bg-gray-200">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="min-h-[100px] bg-white p-2"
          :class="{
            'bg-gray-50 text-gray-400': !day.isCurrentMonth,
            'bg-indigo-50': day.isToday
          }"
        >
          <!-- Day Number -->
          <div class="mb-1 flex items-center justify-between">
            <span
              class="text-sm font-medium"
              :class="{
                'flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white': day.isToday,
                'text-gray-900': day.isCurrentMonth && !day.isToday,
                'text-gray-400': !day.isCurrentMonth
              }"
            >
              {{ day.date }}
            </span>
          </div>

          <!-- Task Dots / Indicators -->
          <div class="space-y-1">
            <div
              v-for="task in getTasksForDay(day)"
              :key="task.id"
              class="truncate rounded px-1 py-0.5 text-xs"
              :class="{
                'bg-red-100 text-red-700': task.priority === 'high',
                'bg-yellow-100 text-yellow-700': task.priority === 'medium',
                'bg-green-100 text-green-700': task.priority === 'low',
                'bg-blue-100 text-blue-700': !task.priority
              }"
              :title="task.title"
            >
              {{ task.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useTasksStore } from '@/stores/tasks'
import { formatDate } from '@/utils/helpers'
import filterMixin from '@/mixins/filterMixin'
import loadingMixin from '@/mixins/loadingMixin'

export default {
  name: 'CalendarView',

  mixins: [filterMixin, loadingMixin],

  data() {
    return {
      currentMonth: new Date(),
      calendarDays: [],
      tasks: []
    }
  },

  computed: {
    monthName() {
      return this.currentMonth.toLocaleString('default', { month: 'long' })
    },

    daysInMonth() {
      const year = this.currentMonth.getFullYear()
      const month = this.currentMonth.getMonth()
      return new Date(year, month + 1, 0).getDate()
    }
  },

  created() {
    this.fetchCalendarData()
  },

  methods: {
    async fetchCalendarData() {
      this.startLoading()
      try {
        const taskStore = useTasksStore()
        await taskStore.fetchTasks()
        this.tasks = taskStore.tasks
        this.generateCalendar()
      } catch (error) {
        console.error('Failed to fetch calendar data:', error)
      } finally {
        this.stopLoading()
      }
    },

    generateCalendar() {
      const year = this.currentMonth.getFullYear()
      const month = this.currentMonth.getMonth()
      const today = new Date()

      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)

      const startDay = firstDay.getDay()
      const totalDays = lastDay.getDate()

      const days = []

      // Previous month padding days
      const prevMonthLastDay = new Date(year, month, 0).getDate()
      for (let i = startDay - 1; i >= 0; i--) {
        days.push({
          date: prevMonthLastDay - i,
          fullDate: new Date(year, month - 1, prevMonthLastDay - i),
          isCurrentMonth: false,
          isToday: false
        })
      }

      // Current month days
      for (let d = 1; d <= totalDays; d++) {
        const dateObj = new Date(year, month, d)
        days.push({
          date: d,
          fullDate: dateObj,
          isCurrentMonth: true,
          isToday:
            d === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        })
      }

      // Next month padding days
      const remaining = 42 - days.length
      for (let i = 1; i <= remaining; i++) {
        days.push({
          date: i,
          fullDate: new Date(year, month + 1, i),
          isCurrentMonth: false,
          isToday: false
        })
      }

      this.calendarDays = days
    },

    getTasksForDay(day) {
      if (!day.fullDate || !this.tasks.length) return []
      return this.tasks.filter((task) => {
        if (!task.dueDate) return false
        const taskDate = new Date(task.dueDate)
        return (
          taskDate.getDate() === day.fullDate.getDate() &&
          taskDate.getMonth() === day.fullDate.getMonth() &&
          taskDate.getFullYear() === day.fullDate.getFullYear()
        )
      })
    },

    prevMonth() {
      const newDate = new Date(this.currentMonth)
      newDate.setMonth(newDate.getMonth() - 1)
      this.currentMonth = newDate
      this.generateCalendar()
    },

    nextMonth() {
      const newDate = new Date(this.currentMonth)
      newDate.setMonth(newDate.getMonth() + 1)
      this.currentMonth = newDate
      this.generateCalendar()
    }
  }
}
</script>
