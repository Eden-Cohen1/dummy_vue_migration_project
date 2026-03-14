<template>
  <div class="token-replacer">
    <h3>{{ displayLabel }}</h3>
    <div class="input-section">
      <textarea v-model="inputText" placeholder="Enter text with {placeholders}"></textarea>
      <p>{{ matchCount }} placeholders found</p>
    </div>
    <div class="results" v-if="matchResults.length">
      <div v-for="(match, i) in matchResults" :key="i" class="match">{{ match }}</div>
    </div>
    <button @click="matchPlaceholders">Find Placeholders</button>
    <button @click="buildApiUrl('preview')">Build URL</button>
    <div class="preview">{{ formatMessage('user') }}</div>
  </div>
</template>

<script>
import templateStringMixin from '@/mixins/templateStringMixin'
import regexMixin from '@/mixins/regexMixin'

export default {
  name: 'TokenReplacer',
  mixins: [templateStringMixin, regexMixin],

  methods: {
    processInput() {
      this.matchPlaceholders()
      const result = this.replaceTokens(this.inputText, { name: this.itemName })
      return result
    }
  }
}
</script>

<style scoped>
.token-replacer { padding: 1rem; }
textarea { width: 100%; min-height: 100px; }
.match { padding: 0.25rem; background: #f0f0f0; margin: 2px 0; }
</style>
