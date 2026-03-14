<template>
  <div class="infinite-list" ref="scrollContainer" @scroll="handleScroll">
    <!-- Items Container -->
    <div v-if="isLoading && items.length === 0" class="initial-loading">
      <div class="spinner"></div>
      <p>Loading items...</p>
    </div>

    <div v-else-if="items.length === 0" class="empty-state">
      <p class="empty-title">No items to display</p>
      <p class="empty-subtitle">There are no items available at this time.</p>
    </div>

    <template v-else>
      <ul class="list-items">
        <li v-for="item in items" :key="item.id" class="list-item">
          <slot name="item" :item="item">
            <span>{{ item.label || item.name || item.id }}</span>
          </slot>
        </li>
      </ul>

      <!-- Loading More Indicator -->
      <div v-if="isLoadingMore" class="loading-more">
        <div class="spinner-small"></div>
        <span>Loading more...</span>
      </div>

      <!-- No More Items -->
      <div v-if="!hasMore && items.length > 0" class="no-more">
        No more items to load
      </div>
    </template>
  </div>
</template>

<script>
import infiniteScrollMixin from '@/mixins/infiniteScrollMixin'
import loadingMixin from '@/mixins/loadingMixin'

export default {
  name: 'InfiniteList',

  mixins: [infiniteScrollMixin, loadingMixin],

  props: {
    items: {
      type: Array,
      default: () => []
    },
    hasMore: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 200
    }
  },

  emits: ['load-more'],

  data() {
    return {
      isLoadingMore: false
    }
  },

  methods: {
    handleScroll() {
      const container = this.$refs.scrollContainer
      if (!container) return
      const bottomDistance = container.scrollHeight - container.scrollTop - container.clientHeight
      if (bottomDistance < this.threshold && this.hasMore && !this.isLoadingMore) {
        this.isLoadingMore = true
        this.$emit('load-more')
      }
    },

    finishLoading() {
      this.isLoadingMore = false
    }
  }
}
</script>

<style scoped>
.infinite-list {
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.list-items { list-style: none; padding: 0; margin: 0; }
.list-item { padding: 0.75rem 1rem; border-bottom: 1px solid #f3f4f6; }
.list-item:last-child { border-bottom: none; }
.loading-more {
  display: flex; align-items: center; justify-content: center;
  gap: 0.5rem; padding: 1rem; color: #6b7280; font-size: 0.875rem;
}
.no-more {
  text-align: center; padding: 1rem; color: #9ca3af; font-size: 0.8rem;
}
.initial-loading { text-align: center; padding: 3rem; color: #6b7280; }
.empty-state { text-align: center; padding: 3rem 1rem; color: #6b7280; }
.empty-title { font-weight: 600; }
.empty-subtitle { font-size: 0.875rem; }
.spinner {
  width: 2rem; height: 2rem; margin: 0 auto 0.5rem;
  border: 3px solid #e5e7eb; border-top-color: #3b82f6;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
.spinner-small {
  width: 1.25rem; height: 1.25rem;
  border: 2px solid #e5e7eb; border-top-color: #3b82f6;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
