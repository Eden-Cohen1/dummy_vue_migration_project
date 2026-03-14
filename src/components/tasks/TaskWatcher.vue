<!-- TaskWatcher.vue
  Mixins used:
  - notificationMixin: Provides sendNotification, notificationPreferences for watcher alerts
  - permissionMixin: Provides hasPermission, canEdit for gating the add-watcher action
  This component manages task watchers/subscribers, showing who is watching a task,
  allowing authorized users to add new watchers, and configuring notification preferences.
-->
<template>
  <div class="task-watcher">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">
        Watchers
        <span class="text-sm font-normal text-gray-500 ml-1">({{ watchers.length }})</span>
      </h3>
      <button
        v-if="canEdit"
        @click="showAddWatcher = true"
        class="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        + Add Watcher
      </button>
    </div>

    <!-- Add watcher input -->
    <div v-if="showAddWatcher" class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <input
        v-model="newWatcherEmail"
        type="email"
        placeholder="Enter email address..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <div class="flex items-center space-x-2 mt-2">
        <button
          @click="addWatcher"
          :disabled="!newWatcherEmail.trim()"
          class="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          Add
        </button>
        <button
          @click="showAddWatcher = false"
          class="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Watcher list -->
    <div class="space-y-3">
      <div
        v-for="watcher in watchers"
        :key="watcher.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-xs font-medium text-indigo-700">
            {{ watcher.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ watcher.name }}</p>
            <p class="text-xs text-gray-500">{{ watcher.email }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <select
            v-model="watcher.notifyOn"
            class="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All changes</option>
            <option value="status">Status only</option>
            <option value="comments">Comments only</option>
            <option value="none">None</option>
          </select>
          <button
            v-if="canEdit"
            @click="removeWatcher(watcher.id)"
            class="text-gray-400 hover:text-red-500 transition-colors"
            title="Remove watcher"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="watchers.length === 0" class="text-center py-6">
      <p class="text-sm text-gray-400">No watchers on this task</p>
    </div>
  </div>
</template>

<script>
import notificationMixin from '@/mixins/notificationMixin'
import permissionMixin from '@/mixins/permissionMixin'

export default {
  name: 'TaskWatcher',

  mixins: [notificationMixin, permissionMixin],

  props: {
    taskId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      watchers: [],
      showAddWatcher: false,
      newWatcherEmail: ''
    }
  },

  methods: {
    addWatcher() {
      if (!this.newWatcherEmail.trim()) return
      this.watchers.push({
        id: Date.now(),
        name: this.newWatcherEmail.split('@')[0],
        email: this.newWatcherEmail,
        notifyOn: 'all'
      })
      this.sendNotification('Watcher added', 'success')
      this.newWatcherEmail = ''
      this.showAddWatcher = false
    },

    removeWatcher(watcherId) {
      this.watchers = this.watchers.filter(w => w.id !== watcherId)
      this.sendNotification('Watcher removed', 'info')
    },

    updatePreference(watcher, value) {
      watcher.notifyOn = value
      this.$emit('preference-changed', { watcherId: watcher.id, notifyOn: value })
    }
  }
}
</script>

<style scoped>
.task-watcher {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
