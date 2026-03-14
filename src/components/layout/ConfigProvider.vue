<template>
  <!-- Edge case: Uses provideMixin — provide() references this (instance-dependent).
       Tests migration of provide function with this-dependent values. -->
  <div class="config-provider" :class="themeClass">
    <div class="config-toolbar">
      <span>Theme: {{ currentTheme }}</span>
      <button @click="switchTheme('light')">Light</button>
      <button @click="switchTheme('dark')">Dark</button>
      <span>Refreshes: {{ refreshCount }}</span>
    </div>
    <div class="config-details">
      <p>API: {{ config.apiEndpoint }}</p>
      <p>Timeout: {{ config.timeout }}ms</p>
    </div>
    <div class="provider-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import provideMixin from '@/mixins/provideMixin'
import themeMixin from '@/mixins/themeMixin'

export default {
  name: 'ConfigProvider',
  mixins: [provideMixin, themeMixin]
}
</script>

<style scoped>
.config-provider { padding: 1rem; }
.config-toolbar { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1rem; }
</style>
