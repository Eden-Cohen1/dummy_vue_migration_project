<template>
  <!-- Edge case: tableMixin internally uses sortMixin(factory) + paginationMixin.
       Tests that factory mixin composition propagates correctly. -->
  <div class="user-permissions-grid">
    <div class="grid-header">
      <h2 class="grid-title">User Permissions</h2>
      <div class="grid-controls">
        <select v-model="pageSize" @change="changePageSize(Number(pageSize))" class="page-size-select">
          <option :value="10">10 per page</option>
          <option :value="25">25 per page</option>
          <option :value="50">50 per page</option>
        </select>
      </div>
    </div>

    <div class="permissions-table" ref="tableContainer">
      <table class="table">
        <thead>
          <tr>
            <th
              v-for="col in visibleColumns"
              :key="col.key"
              :class="getColumnClass(col)"
              :data-col="col.key"
              @click="col.sortable ? sortBy(col.key) : null"
            >
              {{ col.label }}
              <span v-if="sortField === col.key" class="sort-indicator">
                {{ sortDirection === 'asc' ? '&#9650;' : '&#9660;' }}
              </span>
            </th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedRows" :key="row.id" class="table-row">
            <td>{{ row.userName }}</td>
            <td>
              <span class="role-badge" :class="'role-' + row.role">{{ row.role }}</span>
            </td>
            <td>
              <div class="permission-pills">
                <span
                  v-for="perm in row.permissions"
                  :key="perm"
                  class="permission-pill"
                >
                  {{ perm }}
                </span>
              </div>
            </td>
            <td>
              <span :class="row.active ? 'status-active' : 'status-inactive'">
                {{ row.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="actions-col">
              <button
                v-if="canEdit"
                class="btn-edit-perm"
                @click="editPermissions(row)"
              >
                Edit
              </button>
              <button
                v-if="canDelete"
                class="btn-revoke"
                @click="revokeAccess(row)"
              >
                Revoke
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="sortedRows.length === 0" class="empty-table">
        <p>No users found</p>
      </div>
    </div>

    <div class="grid-pagination" v-if="totalPages > 1">
      <button class="btn-page" :disabled="!hasPrevPage" @click="prevPage">Previous</button>
      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
        ({{ totalItems }} total users)
      </span>
      <button class="btn-page" :disabled="!hasNextPage" @click="nextPage">Next</button>
    </div>

    <div v-if="hasExpandedRows" class="expanded-details">
      <p>{{ expandedRows.length }} row(s) expanded</p>
    </div>
  </div>
</template>

<script>
import permissionMixin from '@/mixins/permissionMixin'
import tableMixin from '@/mixins/tableMixin'
import { api } from '@/services/api'

export default {
  name: 'UserPermissionsGrid',

  mixins: [permissionMixin, tableMixin],

  data() {
    return {
      columns: [
        { key: 'userName', label: 'User', sortable: true },
        { key: 'role', label: 'Role', sortable: true },
        { key: 'permissions', label: 'Permissions', sortable: false },
        { key: 'active', label: 'Status', sortable: true }
      ]
    }
  },

  computed: {
    paginatedRows() {
      this.totalItems = this.sortedRows.length
      const start = this.paginatedOffset
      return this.sortedRows.slice(start, start + this.pageSize)
    }
  },

  async created() {
    await this.fetchPermissions()
  },

  methods: {
    async fetchPermissions() {
      try {
        const data = await api.get('/users/permissions')
        this.rows = data.map((user) => ({
          id: user.id,
          userName: user.name,
          role: user.role || 'viewer',
          permissions: this.roleMap[user.role] || ['read'],
          active: user.active !== false
        }))
      } catch (err) {
        console.error('Failed to load permissions:', err)
      }
    },

    editPermissions(row) {
      this.$emit('edit-permissions', row)
      this.toggleRow(row.id)
    },

    async revokeAccess(row) {
      try {
        await api.delete(`/users/${row.id}/permissions`)
        this.rows = this.rows.filter((r) => r.id !== row.id)
        this.$emit('access-revoked', row)
      } catch (err) {
        console.error('Failed to revoke access:', err)
      }
    }
  }
}
</script>

<style scoped>
.user-permissions-grid {
  padding: 1.5rem;
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table th.sortable {
  cursor: pointer;
}

.table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
}

.role-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.role-admin { background: #fef2f2; color: #dc2626; }
.role-manager { background: #fef3c7; color: #d97706; }
.role-developer { background: #dbeafe; color: #2563eb; }
.role-viewer { background: #f3f4f6; color: #6b7280; }

.permission-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.permission-pill {
  font-size: 0.6875rem;
  padding: 0.0625rem 0.375rem;
  background: #f3f4f6;
  border-radius: 4px;
  color: #374151;
}

.status-active { color: #059669; }
.status-inactive { color: #9ca3af; }

.grid-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-page {
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
