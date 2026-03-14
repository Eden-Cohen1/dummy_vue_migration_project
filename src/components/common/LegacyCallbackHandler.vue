<template>
  <div class="legacy-callback-handler">
    <h3>Legacy Callbacks</h3>
    <div v-if="isLoading" class="loading">{{ loadingMessage }}</div>

    <div class="timer-section">
      <p>Timer: {{ timerValue }}</p>
      <p>Status: {{ fetchStatus }}</p>
      <p v-if="callbackResult">Result: {{ callbackResult }}</p>
    </div>

    <div class="actions">
      <button @click="delayedAction(500)">setTimeout (self=this)</button>
      <button @click="promiseAction('/api/test')">Promise (that=this)</button>
      <button @click="nestedCallback">Nested (vm=this)</button>
      <button @click="startInterval">Start Interval</button>
    </div>

    <div v-if="hasError" class="error">{{ error }}</div>
  </div>
</template>

<script>
import selfAliasMixin from '@/mixins/selfAliasMixin'
import loadingMixin from '@/mixins/loadingMixin'

export default {
  name: 'LegacyCallbackHandler',
  mixins: [selfAliasMixin, loadingMixin]
}
</script>

<style scoped>
.legacy-callback-handler { padding: 1rem; }
.timer-section { margin: 1rem 0; padding: 0.5rem; background: #f5f5f5; }
</style>
