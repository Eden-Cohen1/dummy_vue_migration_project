<template>
  <!-- Edge case: Diamond dependency — uses entityListMixin + entityDetailMixin,
       both of which extend crudMixin. crudMixin members should appear once. -->
  <div class="entity-manager">
    <div v-if="isLoading" class="loading-overlay">Loading...</div>
    <div v-if="error" class="error-banner">{{ error }}</div>

    <div class="entity-list-panel">
      <div class="view-toggle">
        <button @click="toggleView">{{ isGridView ? 'Table' : 'Grid' }}</button>
        <span>{{ itemCount }} items</span>
      </div>
      <div :class="['entity-list', listView]">
        <div
          v-for="item in displayedItems"
          :key="item.id"
          class="entity-item"
          @click="selectEntity(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <div v-if="currentItem" class="entity-detail-panel">
      <h3>{{ currentItem.name }}</h3>
      <p v-if="isModified" class="modified-badge">Modified ({{ changeLog.length }} changes)</p>
      <div class="detail-actions">
        <button v-if="!isEditing" @click="startEditing">Edit</button>
        <button v-if="isEditing" @click="saveChanges('/api/entities')">Save</button>
        <button v-if="isEditing" @click="discardChanges">Cancel</button>
      </div>
      <div class="detail-tabs">
        <button @click="detailTab = 'overview'">Overview</button>
        <button @click="detailTab = 'history'">History</button>
      </div>
    </div>
  </div>
</template>

<script>
import entityListMixin from '@/mixins/entityListMixin'
import entityDetailMixin from '@/mixins/entityDetailMixin'

export default {
  name: 'EntityManager',
  mixins: [entityListMixin, entityDetailMixin],

  methods: {
    selectEntity(item) {
      this.currentItem = item
      this.isEditing = false
    }
  }
}
</script>

<style scoped>
.entity-manager {
  display: flex;
  gap: 1rem;
}
.entity-list-panel {
  flex: 1;
}
.entity-detail-panel {
  flex: 1;
  border-left: 1px solid #e2e8f0;
  padding-left: 1rem;
}
</style>
