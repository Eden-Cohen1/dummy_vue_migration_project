<template>
  <!-- Edge case: Sibling collision — statusMixin and fetchMixin both define
       isLoading and error. fetchMixin wins (last in array). -->
  <div class="resource-viewer">
    <div v-if="isLoading" class="loading">Loading resource...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="hasStatus" class="status" :class="statusType">{{ statusLabel }}</div>

    <div v-if="hasFetchedData" class="resource-content">
      <pre>{{ fetchedData }}</pre>
      <p class="fetch-info">Fetched {{ fetchAge }}ms ago</p>
    </div>

    <div class="actions">
      <button @click="fetchData('/api/resources/1')">Fetch Resource</button>
      <button @click="setStatus('Ready to load', 'info')">Set Status</button>
      <button @click="clearStatus">Clear Status</button>
    </div>
  </div>
</template>

<script>
import statusMixin from '@/mixins/statusMixin'
import fetchMixin from '@/mixins/fetchMixin'

export default {
  name: 'ResourceViewer',
  mixins: [statusMixin, fetchMixin]
}
</script>

<style scoped>
.resource-viewer {
  padding: 1rem;
}
.error { color: #dc3545; }
.status.info { color: #17a2b8; }
.status.error { color: #dc3545; }
</style>
