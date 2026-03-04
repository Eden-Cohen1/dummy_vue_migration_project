<template>
  <div class="bg-white border rounded-lg shadow-sm">
    <!-- Header -->
    <button
      @click="isExpanded = !isExpanded"
      class="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
    >
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span class="text-sm font-semibold text-gray-700">Filters</span>
        <span
          v-if="isFiltered"
          class="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full"
        >
          {{ activeFilterCount }}
        </span>
      </div>
      <svg
        :class="['w-4 h-4 text-gray-400 transition-transform duration-200', isExpanded ? 'rotate-180' : '']"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Active filter chips -->
    <div v-if="isFiltered" class="px-4 pb-3 flex flex-wrap gap-2">
      <span
        v-for="(value, key) in activeFilters"
        :key="key"
        class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
      >
        <span class="capitalize">{{ key }}:</span> {{ value }}
        <button
          @click.stop="removeFilter(key)"
          class="ml-0.5 hover:text-blue-900"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
      <button
        @click="clearAllFilters"
        class="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        Clear all
      </button>
    </div>

    <!-- Filter options -->
    <div v-show="isExpanded" class="border-t divide-y">
      <div
        v-for="(options, filterKey) in availableFilters"
        :key="filterKey"
        class="p-4"
      >
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {{ filterKey }}
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in options"
            :key="option"
            @click="toggleFilter(filterKey, option)"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors',
              activeFilters[filterKey] === option
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
            ]"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filterMixin from '@/mixins/filterMixin'

export default {
  name: 'FilterPanel',

  mixins: [filterMixin],

  props: {
    availableFilters: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ['filters-changed'],

  data() {
    return {
      isExpanded: false
    }
  },

  methods: {
    toggleFilter(key, value) {
      if (this.activeFilters[key] === value) {
        this.removeFilter(key)
      } else {
        this.applyFilter(key, value)
      }
    }
  }
}
</script>
