<template>
  <!-- Edge case: Dead import — imports tooltipMixin but uses ZERO members in template or script.
       The mixin is completely unused. Tests whether the migration tool detects dead mixin imports. -->
  <span class="info-tooltip-trigger">
    <svg
      class="info-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
      <path d="M8 7v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
    <span class="info-label" :title="label">{{ label }}</span>
  </span>
</template>

<script>
import tooltipMixin from '@/mixins/tooltipMixin'

export default {
  name: 'InfoTooltip',

  mixins: [tooltipMixin]
}
</script>

<style scoped>
.info-tooltip-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  cursor: help;
  color: #6b7280;
}

.info-icon {
  flex-shrink: 0;
}

.info-label {
  font-size: 0.75rem;
}
</style>
