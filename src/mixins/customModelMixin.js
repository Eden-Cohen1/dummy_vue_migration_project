// Edge case: Custom model option — model: { prop: 'checked', event: 'change' }.
// Vue 2 allows customizing v-model prop/event names. Vue 3 uses modelValue/update:modelValue.
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },

  props: {
    checked: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      internalChecked: false
    }
  },

  watch: {
    checked: {
      handler(newVal) {
        this.internalChecked = newVal
      },
      immediate: true
    }
  },

  computed: {
    isChecked() {
      return this.internalChecked
    },

    toggleLabel() {
      return this.internalChecked ? 'On' : 'Off'
    }
  },

  methods: {
    toggle() {
      this.internalChecked = !this.internalChecked
      this.$emit('change', this.internalChecked)
    },

    setChecked(value) {
      this.internalChecked = value
      this.$emit('change', value)
    }
  }
}
