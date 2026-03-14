// Edge case: this.$set and this.$delete on nested reactive properties.
// Vue 3 removed these — direct assignment works for reactivity.
export default {
  data() {
    return {
      nestedObj: {
        level1: {
          level2: {
            existingKey: 'value'
          }
        }
      },
      dynamicList: ['alpha', 'beta', 'gamma'],
      metadata: {}
    }
  },

  methods: {
    addNestedProp(key, value) {
      // $set on deeply nested object
      this.$set(this.nestedObj.level1.level2, key, value)
    },

    removeNestedProp(key) {
      // $delete on nested property
      this.$delete(this.nestedObj.level1, key)
    },

    addListItem(index, item) {
      // $set on array index
      this.$set(this.dynamicList, index, item)
    },

    removeListItem(index) {
      // $delete on array index
      this.$delete(this.dynamicList, index)
    },

    addMetadata(key, value) {
      // $set on root-level reactive object
      this.$set(this.metadata, key, value)
    },

    removeMetadata(key) {
      this.$delete(this.metadata, key)
    },

    batchUpdate(updates) {
      // Multiple $set calls in sequence
      for (const { path, key, value } of updates) {
        const target = path.split('.').reduce((obj, k) => obj[k], this)
        this.$set(target, key, value)
      }
    },

    replaceNestedObject() {
      // $set to replace entire nested object
      this.$set(this.nestedObj, 'level1', {
        level2: { replacedKey: 'newValue' }
      })
    }
  }
}
