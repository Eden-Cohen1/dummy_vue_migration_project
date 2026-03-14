<template>
  <!-- Edge case: Props overlap mixin data. Component declares `props: { items: Array }`
       and uses tagMixin which also defines `data.items`. Tests prop vs data collision. -->
  <div class="tag-editor">
    <div class="tag-list" v-if="tagCount > 0">
      <span v-for="(tag, index) in items" :key="index" class="tag-badge">
        <span class="tag-text">{{ tag }}</span>
        <button
          type="button"
          class="tag-remove"
          @click="removeTag(index)"
          aria-label="Remove tag"
        >
          &times;
        </button>
      </span>
    </div>

    <div class="tag-input-wrapper" v-if="!hasReachedMax">
      <input
        ref="tagInput"
        v-model="tagInput"
        type="text"
        class="tag-input"
        placeholder="Add a tag..."
        @keydown.enter.prevent="addTag(tagInput)"
        @keydown.backspace="handleBackspace"
        @input="filterSuggestions(tagInput)"
      />
      <ul v-if="tagSuggestions.length > 0" class="suggestions-dropdown">
        <li
          v-for="suggestion in tagSuggestions"
          :key="suggestion"
          class="suggestion-item"
          @click="addTag(suggestion)"
        >
          {{ suggestion }}
        </li>
      </ul>
    </div>

    <div v-if="hasReachedMax" class="max-tags-warning">
      <span class="warning-icon">!</span>
      Maximum of {{ maxTags }} tags reached
    </div>

    <div class="tag-footer">
      <span class="tag-count">{{ tagCount }} / {{ maxTags }} tags</span>
      <button
        v-if="tagCount > 0"
        type="button"
        class="btn-clear-tags"
        @click="clearTags"
      >
        Clear All
      </button>
    </div>
  </div>
</template>

<script>
import tagMixin from '@/mixins/tagMixin'

export default {
  name: 'TagEditor',

  mixins: [tagMixin],

  props: {
    items: {
      type: Array,
      default: () => []
    },
    allowedTags: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    handleBackspace() {
      if (this.tagInput === '' && this.tagCount > 0) {
        this.removeTag(this.tagCount - 1)
      }
    }
  }
}
</script>

<style scoped>
.tag-editor {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.5rem;
  background: #fff;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  background: #eef2ff;
  color: #4f46e5;
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  font-size: 0.875rem;
}

.tag-remove {
  margin-left: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6366f1;
  font-size: 1rem;
  line-height: 1;
}

.tag-input {
  width: 100%;
  border: none;
  outline: none;
  padding: 0.375rem;
  font-size: 0.875rem;
}

.suggestions-dropdown {
  position: absolute;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0;
  z-index: 10;
}

.suggestion-item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}

.suggestion-item:hover {
  background: #f3f4f6;
}

.max-tags-warning {
  color: #d97706;
  font-size: 0.75rem;
  padding: 0.375rem;
}

.tag-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.375rem;
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
