<template>
  <!-- Edge case: Template-only usage. clipboardMixin members (isCopied, copyToClipboard,
       canCopy, copyButtonLabel) appear ONLY in template via v-if, @click, {{ }}, :disabled.
       The script section has NO references to any mixin members. -->
  <div class="clipboard-button-wrapper">
    <button
      type="button"
      class="clipboard-btn"
      :class="{ 'clipboard-btn--copied': isCopied }"
      :disabled="!canCopy"
      @click="copyToClipboard(textToCopy)"
    >
      <svg v-if="!isCopied" class="clipboard-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="4" y="4" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5" />
        <path d="M3 11V3a1.5 1.5 0 011.5-1.5H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <svg v-else class="clipboard-icon clipboard-icon--check" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 8l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="clipboard-label">{{ copyButtonLabel }}</span>
    </button>
  </div>
</template>

<script>
import clipboardMixin from '@/mixins/clipboardMixin'

export default {
  name: 'ClipboardButton',

  mixins: [clipboardMixin],

  props: {
    textToCopy: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.clipboard-button-wrapper {
  display: inline-block;
}

.clipboard-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  color: #374151;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.clipboard-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.clipboard-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clipboard-btn--copied {
  color: #059669;
  background: #ecfdf5;
  border-color: #a7f3d0;
}

.clipboard-icon--check {
  color: #059669;
}
</style>
