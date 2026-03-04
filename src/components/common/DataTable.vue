<template>
  <div ref="tableContainer" class="w-full bg-white rounded-lg shadow overflow-hidden">
    <!-- Table toolbar -->
    <div class="flex items-center justify-between p-4 border-b bg-gray-50">
      <div class="flex items-center gap-2">
        <span v-if="hasSelection" class="text-sm text-blue-600 font-medium">
          {{ selectionCount }} item(s) selected
        </span>
        <button
          v-if="hasSelection"
          @click="deselectAll"
          class="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Clear selection
        </button>
      </div>
      <div class="text-sm text-gray-500">
        Total: {{ totalItems }} rows
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-12 px-4 py-3">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th
              v-for="col in visibleColumns"
              :key="col.key"
              :data-col="col.key"
              :class="getColumnClass(col)"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              @click="col.sortable !== false && sortBy(col.key)"
            >
              <div class="flex items-center gap-1">
                <span>{{ col.label }}</span>
                <span v-if="sortField === col.key" class="text-blue-500">
                  {{ sortDirection === 'asc' ? '\u25B2' : '\u25BC' }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, index) in paginatedRows"
            :key="row.id || index"
            :class="[
              isSelected(row) ? 'bg-blue-50' : 'hover:bg-gray-50',
              'transition-colors duration-150'
            ]"
          >
            <td class="w-12 px-4 py-3">
              <input
                type="checkbox"
                :checked="isSelected(row)"
                @change="toggleSelection(row)"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </td>
            <td
              v-for="col in visibleColumns"
              :key="col.key"
              class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
            >
              <slot :name="'cell-' + col.key" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
          <tr v-if="paginatedRows.length === 0">
            <td :colspan="visibleColumns.length + 1" class="px-4 py-8 text-center text-gray-400 text-sm">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between p-4 border-t bg-gray-50">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Rows per page:</span>
        <select
          v-model.number="pageSize"
          class="border border-gray-300 rounded text-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="prevPage"
          :disabled="!hasPrevPage"
          class="px-3 py-1 text-sm border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Prev
        </button>
        <button
          @click="nextPage"
          :disabled="!hasNextPage"
          class="px-3 py-1 text-sm border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import tableMixin from '@/mixins/tableMixin'
import selectionMixin from '@/mixins/selectionMixin'
import paginationMixin from '@/mixins/paginationMixin'

export default {
  name: 'DataTable',

  mixins: [tableMixin, selectionMixin, paginationMixin],

  props: {
    data: {
      type: Array,
      default: () => []
    },
    columnDefs: {
      type: Array,
      default: () => []
    }
  },

  emits: ['selection-changed'],

  data() {
    return {
      tableReady: false
    }
  },

  computed: {
    selectedStatus: {
      get() {
        if (this.selectedItems.length === 0) return 'none'
        if (this.selectedItems.length === this.sortedRows.length) return 'all'
        return 'partial'
      },
      set(value) {
        if (value === 'all') {
          this.selectAll(this.sortedRows)
        } else {
          this.deselectAll()
        }
      }
    },

    paginatedRows() {
      const start = this.paginatedOffset
      const end = start + this.pageSize
      return this.sortedRows.slice(start, end)
    }
  },

  watch: {
    data: {
      immediate: true,
      handler(newData) {
        this.rows = newData || []
        this.columns = this.columnDefs.map(col => ({
          key: col.key || col.field,
          label: col.label || col.header || col.key,
          sortable: col.sortable !== false,
          hidden: col.hidden || false,
          align: col.align || 'left'
        }))
        this.totalItems = this.rows.length
        this.deselectAll()
      }
    }
  },

  methods: {
    toggleSelectAll() {
      if (this.selectedStatus === 'all') {
        this.deselectAll()
      } else {
        this.selectAll(this.sortedRows)
      }
    }
  },

  mounted() {
    const self = this
    setTimeout(function () {
      self.tableReady = true
      if (self.$refs.tableContainer) {
        self.$refs.tableContainer.classList.add('table-initialized')
      }
      const firstCol = self.$el.querySelector('[data-col]')
      if (firstCol) {
        firstCol.classList.add('first-visible')
      }
    }, 100)
  }
}
</script>
