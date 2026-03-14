<template>
  <!-- Edge case: Uses injectConsumerMixin — consumes inject values from parent.
       Tests inject migration for child components. -->
  <div class="config-consumer" :class="{ light: isLightTheme }">
    <h4>Config Consumer</h4>
    <p>{{ configLabel }}</p>
    <p>Timeout: {{ configTimeout }}ms</p>
    <button @click="triggerRefresh">Request Refresh</button>
    <div class="config-values">
      <p>Max Retries: {{ readConfig('maxRetries') }}</p>
    </div>
  </div>
</template>

<script>
import injectConsumerMixin from '@/mixins/injectConsumerMixin'

export default {
  name: 'ConfigConsumer',
  mixins: [injectConsumerMixin]
}
</script>

<style scoped>
.config-consumer {
  padding: 1rem;
  border: 1px dashed #aaa;
  margin: 0.5rem 0;
}
.light { background: #fafafa; }
</style>
