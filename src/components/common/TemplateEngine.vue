<template>
  <div class="template-engine">
    <h3>{{ title }}</h3>
    <div class="output-preview" v-html="compiledTemplate"></div>
    <div class="format-summary">
      <p>{{ formattedOutput.summary }}</p>
      <p>Rules: {{ formattedOutput.ruleCount }}</p>
    </div>
    <textarea v-model="rawInput" placeholder="Enter raw data"></textarea>
    <button @click="processInput">Process</button>
    <div class="css-preview">
      <pre>{{ generateCSS() }}</pre>
    </div>
    <div class="log">
      <div v-for="(entry, i) in transformLog" :key="i">{{ entry }}</div>
    </div>
  </div>
</template>

<script>
import edgeCaseComboMixin from '@/mixins/edgeCaseComboMixin'
import multilineStringMixin from '@/mixins/multilineStringMixin'

export default {
  name: 'TemplateEngine',
  mixins: [edgeCaseComboMixin, multilineStringMixin],

  data() {
    return {
      rawInput: ''
    }
  },

  methods: {
    processInput() {
      if (!this.rawInput) return
      const items = JSON.parse(this.rawInput)
      this.rawData = items
      this.formatAll(items)
    }
  }
}
</script>

<style scoped>
.template-engine { padding: 1rem; }
textarea { width: 100%; min-height: 80px; }
.output-preview { border: 1px solid #ddd; padding: 1rem; margin: 0.5rem 0; }
</style>
