<template>
  <div class="reactive-editor">
    <h3>Reactive Editor</h3>
    <div v-if="isUpdating" class="updating">Updating DOM...</div>

    <div class="nested-data">
      <h4>Nested Object</h4>
      <pre>{{ nestedObj }}</pre>
      <div class="controls">
        <input v-model="newKey" placeholder="Key" />
        <input v-model="newValue" placeholder="Value" />
        <button @click="addNestedProp(newKey, newValue)">$set</button>
        <button @click="removeNestedProp(newKey)">$delete</button>
      </div>
    </div>

    <div class="list-section">
      <h4>Dynamic List</h4>
      <div v-for="(item, i) in dynamicList" :key="i">
        {{ i }}: {{ item }}
        <button @click="removeListItem(i)">×</button>
      </div>
    </div>

    <div class="form-section" v-if="formData">
      <h4>Form ({{ isDirty ? 'Modified' : 'Clean' }})</h4>
      <button @click="submitForm">Save</button>
      <button @click="resetForm">Reset</button>
    </div>

    <div class="tick-info">
      Tick count: {{ tickCount }} | Pending: {{ pendingUpdates.length }}
    </div>

    <button @click="updateAndMeasure">Measure After Tick</button>
    <button @click="asyncUpdate">Async Update</button>
  </div>
</template>

<script>
import reactiveSetMixin from '@/mixins/reactiveSetMixin'
import formMixin from '@/mixins/formMixin'
import nextTickChainMixin from '@/mixins/nextTickChainMixin'

export default {
  name: 'ReactiveEditor',
  mixins: [reactiveSetMixin, formMixin, nextTickChainMixin],

  data() {
    return {
      newKey: '',
      newValue: ''
    }
  }
}
</script>

<style scoped>
.reactive-editor { padding: 1rem; }
.controls { display: flex; gap: 0.5rem; margin: 0.5rem 0; }
.updating { color: #ffc107; font-weight: bold; }
</style>
