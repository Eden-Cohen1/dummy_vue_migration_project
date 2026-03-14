<template>
  <div class="dynamic-field-renderer">
    <div class="config-display" :style="themeConfig">
      <h3>Dynamic Fields</h3>
      <div v-for="field in resolvedFields" :key="field.name" class="field">
        <label>{{ field.name }}</label>
        <input :value="field.value" @input="setField(field.name, $event.target.value)" />
      </div>
    </div>
    <div class="status-flags">
      <span v-for="(value, key) in statusMap" :key="key" :class="{ active: value }">
        {{ key }}: {{ value }}
      </span>
    </div>
    <div class="merged-config">
      <pre>{{ mergedConfig }}</pre>
    </div>
  </div>
</template>

<script>
import bracketNotationMixin from '@/mixins/bracketNotationMixin'
import computedObjectMixin from '@/mixins/computedObjectMixin'

export default {
  name: 'DynamicFieldRenderer',
  mixins: [bracketNotationMixin, computedObjectMixin]
}
</script>

<style scoped>
.dynamic-field-renderer { padding: 1rem; }
.field { margin: 0.5rem 0; }
.active { color: green; }
</style>
