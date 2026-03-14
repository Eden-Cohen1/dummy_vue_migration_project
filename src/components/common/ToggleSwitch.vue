<template>
  <!-- Edge case: Uses customModelMixin — tests custom v-model option migration.
       Component uses model: { prop: 'checked', event: 'change' }. -->
  <div class="toggle-switch" @click="toggle" :class="{ active: isChecked }">
    <div class="toggle-track">
      <div class="toggle-thumb" :class="{ checked: internalChecked }"></div>
    </div>
    <span class="toggle-label">{{ toggleLabel }}</span>
  </div>
</template>

<script>
import customModelMixin from '@/mixins/customModelMixin'

export default {
  name: 'ToggleSwitch',
  mixins: [customModelMixin]
}
</script>

<style scoped>
.toggle-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.toggle-track {
  width: 48px;
  height: 24px;
  background: #ccc;
  border-radius: 12px;
  position: relative;
  transition: background 0.2s;
}
.active .toggle-track {
  background: #4caf50;
}
.toggle-thumb {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}
.toggle-thumb.checked {
  transform: translateX(24px);
}
</style>
