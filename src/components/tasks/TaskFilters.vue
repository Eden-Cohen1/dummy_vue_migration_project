<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-gray-900">Filters</h3>
      <div class="flex items-center gap-2">
        <span v-if="isFiltered" class="text-xs text-indigo-600">
          {{ activeFilterCount }} active
        </span>
        <button
          v-if="isFiltered"
          @click="handleClearAll"
          class="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
        >
          Clear all
        </button>
      </div>
    </div>

    <!-- Status Filter -->
    <div>
      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="option in statusOptions"
          :key="option.value"
          @click="toggleFilter('status', option.value)"
          :class="[
            'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
            activeFilters.status === option.value
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
          ]"
        >
          <span :class="['inline-block w-1.5 h-1.5 rounded-full mr-1.5', option.dotClass]"></span>
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Priority Filter -->
    <div>
      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Priority</label>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="option in priorityOptions"
          :key="option.value"
          @click="toggleFilter('priority', option.value)"
          :class="[
            'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
            activeFilters.priority === option.value
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Assignee Filter -->
    <div>
      <label for="filter-assignee" class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
        Assignee
      </label>
      <select
        id="filter-assignee"
        :value="activeFilters.assignee || ''"
        @change="handleAssigneeChange($event.target.value)"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 bg-white"
      >
        <option value="">All assignees</option>
        <option v-for="user in users" :key="user.id" :value="user.name || user.id">
          {{ user.name || user.id }}
        </option>
      </select>
    </div>

    <!-- Date Range Filter -->
    <div>
      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Due Date Range</label>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-xs text-gray-400 mb-1">From</label>
          <input
            type="date"
            :value="activeFilters.dateFrom || ''"
            @change="handleDateChange('dateFrom', $event.target.value)"
            class="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-400 mb-1">To</label>
          <input
            type="date"
            :value="activeFilters.dateTo || ''"
            @change="handleDateChange('dateTo', $event.target.value)"
            class="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>

    <!-- Applied Filters Summary -->
    <div v-if="isFiltered" class="pt-3 border-t border-gray-100">
      <p class="text-xs text-gray-500 mb-2">Applied filters:</p>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="(value, key) in activeFilters"
          :key="key"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
        >
          <span class="text-indigo-400 mr-1">{{ key }}:</span>
          {{ value }}
          <button
            @click="removeFilter(key)"
            class="ml-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 transition-colors"
          >
            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      </div>
    </div>

    <!-- Apply Filters Button -->
    <div class="pt-2">
      <button
        @click="handleApplyFilters"
        class="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  </div>
</template>

<script>
import filterMixin from '@/mixins/filterMixin'

export default {
  name: 'TaskFilters',

  mixins: [filterMixin],

  props: {
    users: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      statusOptions: [
        { label: 'To Do', value: 'todo', dotClass: 'bg-gray-400' },
        { label: 'In Progress', value: 'in-progress', dotClass: 'bg-blue-500' },
        { label: 'Review', value: 'review', dotClass: 'bg-yellow-500' },
        { label: 'Done', value: 'done', dotClass: 'bg-green-500' }
      ],
      priorityOptions: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' }
      ]
    }
  },

  watch: {
    activeFilters: {
      deep: true,
      handler(newFilters) {
        this.$emit('filters-applied', { ...newFilters })
      }
    }
  },

  methods: {
    toggleFilter(key, value) {
      if (this.activeFilters[key] === value) {
        this.removeFilter(key)
      } else {
        this.applyFilter(key, value)
      }
    },

    handleAssigneeChange(value) {
      if (value) {
        this.applyFilter('assignee', value)
      } else {
        this.removeFilter('assignee')
      }
    },

    handleDateChange(key, value) {
      if (value) {
        this.applyFilter(key, value)
      } else {
        this.removeFilter(key)
      }
    },

    handleClearAll() {
      this.clearAllFilters()
    },

    handleApplyFilters() {
      this.$emit('filters-applied', { ...this.activeFilters })
    }
  }
}
</script>
