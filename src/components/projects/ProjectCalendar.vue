<!-- ProjectCalendar.vue
  Mixins used:
  - loadingMixin: Provides isLoading, startLoading/stopLoading for fetching milestone data
  - filterMixin: Provides activeFilters, applyFilter, clearFilters for filtering milestones by type/status
  This component renders a monthly calendar view of project milestones and deadlines,
  with navigation controls and a filter sidebar for narrowing visible events.
-->
<template>
  <div class="project-calendar">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Project Calendar</h3>
      <div class="flex items-center space-x-3">
        <button @click="prevMonth" class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="text-sm font-medium text-gray-700 min-w-[120px] text-center">{{ monthLabel }}</span>
        <button @click="nextMonth" class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button @click="goToday" class="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100 transition-colors">
          Today
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-16">
      <svg class="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>

    <div v-else class="flex space-x-4">
      <!-- Calendar grid -->
      <div class="flex-1">
        <!-- Day headers -->
        <div class="grid grid-cols-7 gap-px mb-1">
          <div v-for="day in dayHeaders" :key="day" class="text-xs font-medium text-gray-500 text-center py-2">
            {{ day }}
          </div>
        </div>
        <!-- Day cells -->
        <div class="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          <div
            v-for="(cell, idx) in calendarCells"
            :key="idx"
            :class="[
              'bg-white p-2 min-h-[80px]',
              cell.isCurrentMonth ? '' : 'bg-gray-50',
              cell.isToday ? 'ring-2 ring-indigo-500 ring-inset' : ''
            ]"
          >
            <span :class="['text-xs', cell.isCurrentMonth ? 'text-gray-900' : 'text-gray-400']">
              {{ cell.day }}
            </span>
            <div v-for="milestone in cell.milestones" :key="milestone.id" class="mt-1">
              <span class="block text-xs px-1 py-0.5 rounded truncate" :class="milestoneClass(milestone.type)">
                {{ milestone.title }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter sidebar -->
      <div class="w-48 flex-shrink-0">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Filters</h4>
        <div class="space-y-2">
          <label v-for="type in milestoneTypes" :key="type" class="flex items-center space-x-2 text-sm text-gray-600">
            <input type="checkbox" :checked="isFilterActive(type)" @change="toggleFilter(type)" class="rounded text-indigo-600" />
            <span>{{ type }}</span>
          </label>
        </div>
        <button @click="clearFilters" class="mt-3 text-xs text-indigo-600 hover:text-indigo-700">Clear all filters</button>
      </div>
    </div>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'
import filterMixin from '@/mixins/filterMixin'

export default {
  name: 'ProjectCalendar',

  mixins: [loadingMixin, filterMixin],

  props: {
    projectId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      milestones: [],
      dayHeaders: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      milestoneTypes: ['Deadline', 'Release', 'Review', 'Meeting']
    }
  },

  computed: {
    monthLabel() {
      const date = new Date(this.currentYear, this.currentMonth)
      return date.toLocaleString('default', { month: 'long', year: 'numeric' })
    },

    calendarCells() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay()
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate()
      const cells = []
      const today = new Date()

      for (let i = 0; i < firstDay; i++) {
        const prevDate = new Date(this.currentYear, this.currentMonth, -firstDay + i + 1)
        cells.push({ day: prevDate.getDate(), isCurrentMonth: false, isToday: false, milestones: [] })
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === today.getDate() && this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear()
        cells.push({ day: d, isCurrentMonth: true, isToday, milestones: this.milestonesForDay(d) })
      }
      return cells
    }
  },

  methods: {
    prevMonth() {
      if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear-- }
      else { this.currentMonth-- }
    },

    nextMonth() {
      if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++ }
      else { this.currentMonth++ }
    },

    goToday() {
      this.currentYear = new Date().getFullYear()
      this.currentMonth = new Date().getMonth()
    },

    milestonesForDay(day) {
      return this.milestones.filter(m => {
        const d = new Date(m.date)
        return d.getDate() === day && d.getMonth() === this.currentMonth && d.getFullYear() === this.currentYear
      })
    },

    isFilterActive(type) {
      return this.activeFilters && this.activeFilters.includes(type)
    },

    toggleFilter(type) {
      this.applyFilter('type', type)
    },

    milestoneClass(type) {
      const map = { Deadline: 'bg-red-100 text-red-700', Release: 'bg-green-100 text-green-700', Review: 'bg-yellow-100 text-yellow-700', Meeting: 'bg-blue-100 text-blue-700' }
      return map[type] || 'bg-gray-100 text-gray-700'
    }
  }
}
</script>

<style scoped>
.project-calendar {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
