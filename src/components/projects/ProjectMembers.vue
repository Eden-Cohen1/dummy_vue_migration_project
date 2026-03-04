<template>
  <div class="bg-white rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Project Members</h2>
        <p class="text-sm text-gray-500 mt-1">
          {{ members.length }} member{{ members.length !== 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Add Member Button (permission-gated) -->
      <button
        v-if="canCreate"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        @click="addMember"
      >
        <svg class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Member
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-if="members.length === 0"
      class="p-6 text-center"
    >
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <p class="text-gray-500 text-sm">No members in this project.</p>
      <button
        v-if="canCreate"
        class="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
        @click="addMember"
      >
        Add the first member
      </button>
    </div>

    <!-- Members List -->
    <ul v-else class="divide-y divide-gray-200">
      <li
        v-for="member in members"
        :key="member.id"
        class="px-6 py-4 hover:bg-gray-50 transition-colors"
        :class="{ 'bg-blue-50': isSelected(member) }"
        @click="toggleSelection(member)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <!-- Avatar -->
            <div
              class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              :class="getAvatarBg(member.name)"
            >
              {{ getInitials(member.name) }}
            </div>

            <!-- Member Info -->
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ member.name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ member.email || 'No email provided' }}
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <!-- Role Badge -->
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getRoleBadgeClass(member.role)"
            >
              {{ member.role || 'member' }}
            </span>

            <!-- Remove Button (permission-gated) -->
            <button
              v-if="canDelete"
              class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Remove member"
              @click.stop="removeMember(member.id)"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </li>
    </ul>

    <!-- Selection Bar -->
    <div
      v-if="hasSelection"
      class="px-6 py-3 border-t border-gray-200 bg-blue-50 flex items-center justify-between"
    >
      <span class="text-sm text-blue-700">
        {{ selectionCount }} member{{ selectionCount > 1 ? 's' : '' }} selected
      </span>
      <button
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
        @click="deselectAll"
      >
        Clear selection
      </button>
    </div>
  </div>
</template>

<script>
import selectionMixin from '@/mixins/selectionMixin'
import permissionMixin from '@/mixins/permissionMixin'

export default {
  name: 'ProjectMembers',

  mixins: [selectionMixin, permissionMixin],

  props: {
    members: {
      type: Array,
      default: () => []
    },
    projectId: {
      type: [String, Number],
      required: true
    }
  },

  emits: ['member-removed', 'member-added', 'selection-changed'],

  methods: {
    addMember() {
      this.$emit('member-added', { projectId: this.projectId })
    },

    removeMember(userId) {
      this.$emit('member-removed', { projectId: this.projectId, userId })
    },

    getInitials(name) {
      if (!name) return '?'
      return name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    },

    getAvatarBg(name) {
      const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-teal-500',
        'bg-orange-500',
        'bg-cyan-500'
      ]
      if (!name) return colors[0]
      const index = name.charCodeAt(0) % colors.length
      return colors[index]
    },

    getRoleBadgeClass(role) {
      const classes = {
        admin: 'bg-red-100 text-red-800',
        manager: 'bg-purple-100 text-purple-800',
        developer: 'bg-blue-100 text-blue-800',
        designer: 'bg-pink-100 text-pink-800',
        viewer: 'bg-gray-100 text-gray-800',
        member: 'bg-green-100 text-green-800'
      }
      return classes[role] || 'bg-gray-100 text-gray-800'
    }
  }
}
</script>
