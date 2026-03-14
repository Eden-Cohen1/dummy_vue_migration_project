<template>
  <div class="dom-inspector" ref="inspectorRoot">
    <h3>DOM Inspector</h3>

    <div class="measurements">
      <h4>Element Rect</h4>
      <p>Top: {{ elementRect.top }}, Left: {{ elementRect.left }}</p>
      <p>Size: {{ elementRect.width }}×{{ elementRect.height }}</p>
      <button @click="measureElement">Re-measure</button>
    </div>

    <div class="tree-access">
      <h4>Instance Tree</h4>
      <p>Children: {{ childCount }}</p>
      <p>Root flag: {{ rootFlag }}</p>
      <button @click="notifyParent('child-message', { from: 'inspector' })">Notify Parent</button>
      <button @click="refreshFirstChild">Refresh Child</button>
      <button @click="getRootState('debugMode')">Check Root State</button>
    </div>

    <div class="force-reactive">
      <h4>Force Reactive</h4>
      <pre>{{ derivedData }}</pre>
      <button @click="forceRefresh">$forceUpdate</button>
      <button @click="patchData('test', Date.now())">$set</button>
      <p v-if="lastForceUpdate">Last force update: {{ lastForceUpdate }}</p>
    </div>

    <button @click="scrollToElement">Scroll To This</button>
  </div>
</template>

<script>
import domAccessMixin from '@/mixins/domAccessMixin'
import forceReactiveMixin from '@/mixins/forceReactiveMixin'

export default {
  name: 'DomInspector',
  mixins: [domAccessMixin, forceReactiveMixin]
}
</script>

<style scoped>
.dom-inspector { padding: 1rem; }
.measurements, .tree-access, .force-reactive {
  margin: 1rem 0;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
}
</style>
