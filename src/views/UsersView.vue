<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Users</h1>
        <p class="mt-1 text-sm text-gray-500">{{ userCount }} registered users in the system.</p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search users by name or email..."
        class="block w-full rounded-md border-0 py-2 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>

    <!-- User List -->
    <UserList
      v-else
      :users="filteredUsers"
      @edit="openEditModal"
    />

    <!-- Edit User Modal -->
    <BaseModal :show="showEditModal" title="Edit User" @close="closeEditModal">
      <UserForm
        v-if="editingUser"
        :user="editingUser"
        @submit="handleUpdateUser"
        @cancel="closeEditModal"
      />
    </BaseModal>
  </div>
</template>

<script>
import UserList from '@/components/users/UserList.vue'
import UserForm from '@/components/users/UserForm.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { mapState, mapActions } from 'pinia'
import { useUsersStore } from '@/stores/users'
import loadingMixin from '@/mixins/loadingMixin'
import searchMixin from '@/mixins/searchMixin'

export default {
  name: 'UsersView',

  components: {
    UserList,
    UserForm,
    BaseModal
  },

  mixins: [loadingMixin, searchMixin],

  data() {
    return {
      showEditModal: false,
      editingUser: null
    }
  },

  computed: {
    ...mapState(useUsersStore, ['users', 'userCount']),

    filteredUsers() {
      if (!this.searchQuery) {
        return this.users
      }
      const query = this.searchQuery.toLowerCase()
      return this.users.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      )
    }
  },

  created() {
    this.loadUsers()
  },

  methods: {
    ...mapActions(useUsersStore, ['fetchUsers', 'updateUser']),

    async loadUsers() {
      this.startLoading()
      try {
        await this.fetchUsers()
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        this.stopLoading()
      }
    },

    openEditModal(user) {
      this.editingUser = { ...user }
      this.showEditModal = true
    },

    closeEditModal() {
      this.showEditModal = false
      this.editingUser = null
    },

    async handleUpdateUser(data) {
      try {
        await this.updateUser(data)
        this.closeEditModal()
      } catch (error) {
        console.error('Failed to update user:', error)
      }
    }
  }
}
</script>
