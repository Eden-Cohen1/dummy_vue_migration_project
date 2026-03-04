<template>
  <div class="space-y-4">
    <!-- Toolbar -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <!-- Search -->
        <div class="relative w-full sm:w-80">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Search users by name, email, or role..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex items-center gap-3">
          <!-- Selection info -->
          <span v-if="hasSelection" class="text-sm text-blue-600 font-medium">
            {{ selectionCount }} selected
          </span>
          <button
            v-if="hasSelection"
            @click="deselectAll"
            class="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear
          </button>

          <!-- View toggle -->
          <div class="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              @click="viewMode = 'table'"
              :class="viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'"
              class="p-1.5 rounded-md transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              @click="viewMode = 'grid'"
              :class="viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'"
              class="p-1.5 rounded-md transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>

          <!-- Result count -->
          <span class="text-sm text-gray-500">
            {{ displayedUsers.length }} user{{ displayedUsers.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Table View -->
    <div v-if="viewMode === 'table'" ref="tableContainer" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                v-for="col in tableColumns"
                :key="col.key"
                :data-col="col.key"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy(col.key)"
              >
                <div class="flex items-center gap-1">
                  <span>{{ col.label }}</span>
                  <span v-if="sortField === col.key" class="text-blue-500">
                    {{ sortDirection === 'asc' ? '\u25B2' : '\u25BC' }}
                  </span>
                </div>
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in displayedUsers"
              :key="user.id"
              :class="[isSelected(user) ? 'bg-blue-50' : 'hover:bg-gray-50']"
              class="transition-colors duration-150"
            >
              <td class="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  :checked="isSelected(user)"
                  @change="toggleSelection(user)"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                    <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="w-full h-full rounded-full object-cover" />
                    <span v-else>{{ getInitials(user.name) }}</span>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ user.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ user.email }}</td>
              <td class="px-4 py-3">
                <span
                  :class="getRoleBadgeClass(user.role)"
                  class="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="flex items-center gap-1.5 text-sm">
                  <span
                    :class="user.status === 'active' ? 'bg-green-400' : 'bg-gray-300'"
                    class="w-2 h-2 rounded-full inline-block"
                  ></span>
                  {{ user.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  @click="editUser(user)"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
              </td>
            </tr>
            <tr v-if="displayedUsers.length === 0">
              <td colspan="6" class="px-4 py-12 text-center text-gray-400 text-sm">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>No users found</p>
                <p v-if="searchQuery" class="mt-1 text-xs">Try adjusting your search query</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="user in displayedUsers"
        :key="user.id"
        :class="[isSelected(user) ? 'ring-2 ring-blue-500' : '']"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        @click="toggleSelection(user)"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
            <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="w-full h-full rounded-full object-cover" />
            <span v-else>{{ getInitials(user.name) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-gray-900 truncate">{{ user.name }}</h4>
            <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span
            :class="getRoleBadgeClass(user.role)"
            class="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
          >
            {{ user.role }}
          </span>
          <button
            @click.stop="editUser(user)"
            class="text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            Edit
          </button>
        </div>
      </div>
      <div v-if="displayedUsers.length === 0" class="col-span-full py-12 text-center text-gray-400 text-sm">
        No users found
      </div>
    </div>
  </div>
</template>

<script>
import tableMixin from '@/mixins/tableMixin'
import searchMixin from '@/mixins/searchMixin'
import selectionMixin from '@/mixins/selectionMixin'

export default {
  name: 'UserList',

  mixins: [tableMixin, searchMixin, selectionMixin],

  props: {
    users: {
      type: Array,
      default: () => []
    }
  },

  emits: ['user-edit', 'selection-changed'],

  data() {
    return {
      viewMode: 'table',
      tableColumns: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'role', label: 'Role', sortable: true },
        { key: 'status', label: 'Status', sortable: true }
      ]
    }
  },

  computed: {
    displayedUsers() {
      if (this.searchQuery && this.searchResults.length > 0) {
        return this.searchResults
      }
      if (this.searchQuery && !this.isSearching) {
        return []
      }
      return this.users
    },

    allSelected() {
      return this.displayedUsers.length > 0 && this.selectedItems.length === this.displayedUsers.length
    }
  },

  watch: {
    users: {
      immediate: true,
      handler(newUsers) {
        this.items = newUsers
        this.rows = newUsers
        this.totalItems = newUsers.length
      }
    }
  },

  methods: {
    editUser(user) {
      this.$emit('user-edit', user)
    },

    toggleSelectAll() {
      if (this.allSelected) {
        this.deselectAll()
      } else {
        this.selectAll(this.displayedUsers)
      }
    },

    getInitials(name) {
      if (!name) return '?'
      return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    },

    getRoleBadgeClass(role) {
      const classes = {
        admin: 'bg-red-100 text-red-700',
        manager: 'bg-purple-100 text-purple-700',
        developer: 'bg-blue-100 text-blue-700',
        designer: 'bg-pink-100 text-pink-700',
        viewer: 'bg-gray-100 text-gray-700'
      }
      return classes[role] || 'bg-gray-100 text-gray-700'
    }
  },

  mounted() {
    if (this.$refs.tableContainer) {
      this.$refs.tableContainer.classList.add('user-list-initialized')
    }
  }
}
</script>
