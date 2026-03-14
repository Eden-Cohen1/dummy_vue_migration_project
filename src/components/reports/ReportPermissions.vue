<!-- ReportPermissions.vue
  Mixins used:
  - permissionMixin: Provides hasPermission, canEdit, permission checks for access control
  - selectionMixin: Provides selectedItems, toggleSelection, selectAll, clearSelection for user/role selection
  This component manages report sharing and permissions, with a user/role list
  featuring checkboxes, permission level dropdowns, share controls, and an access summary.
-->
<template>
  <div class="report-permissions">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Permissions & Sharing</h3>
      <button
        @click="shareReport"
        :disabled="selectedItems.length === 0"
        :class="[
          'px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors',
          selectedItems.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
        ]"
      >
        Share
      </button>
    </div>

    <!-- Access summary -->
    <div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
      <p class="text-sm text-blue-700">
        <span class="font-medium">{{ accessSummary.viewers }}</span> viewers,
        <span class="font-medium">{{ accessSummary.editors }}</span> editors,
        <span class="font-medium">{{ accessSummary.admins }}</span> admins
      </p>
    </div>

    <!-- Select all -->
    <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
      <label class="flex items-center space-x-2 text-sm text-gray-600">
        <input
          type="checkbox"
          :checked="allSelected"
          @change="toggleSelectAll"
          class="rounded text-indigo-600"
        />
        <span>Select all</span>
      </label>
      <span class="text-xs text-gray-400">{{ selectedItems.length }} selected</span>
    </div>

    <!-- User/role list -->
    <div class="space-y-2">
      <div
        v-for="entry in permissionEntries"
        :key="entry.id"
        class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center space-x-3">
          <input
            type="checkbox"
            :checked="isSelected(entry.id)"
            @change="toggleSelection(entry.id)"
            class="rounded text-indigo-600"
          />
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
            :class="entry.type === 'role' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'"
          >
            {{ entry.type === 'role' ? 'R' : entry.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ entry.name }}</p>
            <p class="text-xs text-gray-500">{{ entry.type === 'role' ? 'Role' : entry.email }}</p>
          </div>
        </div>
        <select
          v-model="entry.permission"
          class="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 outline-none"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
          <option value="none">No Access</option>
        </select>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="permissionEntries.length === 0" class="text-center py-8">
      <p class="text-sm text-gray-400">No users or roles configured</p>
    </div>
  </div>
</template>

<script>
import permissionMixin from '@/mixins/permissionMixin'
import selectionMixin from '@/mixins/selectionMixin'

export default {
  name: 'ReportPermissions',

  mixins: [permissionMixin, selectionMixin],

  props: {
    reportId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      permissionEntries: []
    }
  },

  computed: {
    accessSummary() {
      const viewers = this.permissionEntries.filter(e => e.permission === 'viewer').length
      const editors = this.permissionEntries.filter(e => e.permission === 'editor').length
      const admins = this.permissionEntries.filter(e => e.permission === 'admin').length
      return { viewers, editors, admins }
    },

    allSelected() {
      return this.permissionEntries.length > 0 && this.selectedItems.length === this.permissionEntries.length
    }
  },

  methods: {
    isSelected(id) {
      return this.selectedItems.includes(id)
    },

    toggleSelectAll() {
      if (this.allSelected) {
        this.clearSelection()
      } else {
        this.selectAll(this.permissionEntries.map(e => e.id))
      }
    },

    shareReport() {
      const shared = this.permissionEntries.filter(e => this.selectedItems.includes(e.id))
      this.$emit('share', shared)
    }
  }
}
</script>

<style scoped>
.report-permissions {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
