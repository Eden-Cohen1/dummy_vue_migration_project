<template>
  <div class="event-bridge">
    <h3>Event Bridge</h3>
    <div class="status">
      <span :class="{ active: isListening }">{{ isListening ? 'Listening' : 'Idle' }}</span>
      <span>Events: {{ receivedEvents.length }}</span>
      <span v-if="hasUnread">{{ unreadCount }} unread notifications</span>
    </div>
    <div class="events">
      <div v-for="(event, i) in receivedEvents" :key="i" class="event-entry">
        <span class="type">{{ event.type }}</span>
        <span class="time">{{ new Date(event.timestamp).toLocaleTimeString() }}</span>
      </div>
    </div>
    <div class="actions">
      <button @click="emitEvent('data-updated', { source: 'manual' })">Emit Update</button>
      <button @click="emitEvent('user-action', 'click')">Emit Action</button>
      <button @click="clearEventLog">Clear Events</button>
    </div>
    <div v-if="notifications.length" class="notifications">
      <div v-for="n in sortedNotifications" :key="n.id">{{ n.title }}</div>
    </div>
  </div>
</template>

<script>
import eventBusMixin from '@/mixins/eventBusMixin'
import notificationMixin from '@/mixins/notificationMixin'

export default {
  name: 'EventBridge',
  mixins: [eventBusMixin, notificationMixin]
}
</script>

<style scoped>
.event-bridge { padding: 1rem; }
.status { display: flex; gap: 1rem; margin-bottom: 1rem; }
.active { color: green; font-weight: bold; }
.event-entry { display: flex; gap: 0.5rem; padding: 0.25rem 0; }
.type { font-weight: bold; }
.time { color: #666; }
</style>
