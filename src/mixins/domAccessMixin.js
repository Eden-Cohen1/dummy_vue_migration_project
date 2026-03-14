// Edge case: this.$el, this.$parent.$emit, this.$children[0].method(),
// this.$root.$data. Tests migration of Vue instance tree traversal APIs.
export default {
  data() {
    return {
      elementRect: {},
      parentData: null,
      childCount: 0,
      rootFlag: false
    }
  },

  mounted() {
    this.measureElement()
  },

  methods: {
    measureElement() {
      // this.$el usage
      if (this.$el && this.$el.getBoundingClientRect) {
        const rect = this.$el.getBoundingClientRect()
        this.elementRect = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        }
      }
    },

    notifyParent(eventName, data) {
      // this.$parent.$emit
      if (this.$parent) {
        this.$parent.$emit(eventName, data)
      }
    },

    getParentData(key) {
      // this.$parent access
      if (this.$parent && this.$parent.$data) {
        this.parentData = this.$parent.$data[key]
        return this.parentData
      }
      return null
    },

    accessChild(index, methodName) {
      // this.$children[n].method()
      if (this.$children && this.$children[index]) {
        if (typeof this.$children[index][methodName] === 'function') {
          return this.$children[index][methodName]()
        }
      }
      return null
    },

    refreshFirstChild() {
      // Direct $children access
      if (this.$children && this.$children[0] && this.$children[0].refresh) {
        this.$children[0].refresh()
      }
      this.childCount = this.$children ? this.$children.length : 0
    },

    getRootState(key) {
      // this.$root.$data access
      if (this.$root && this.$root.$data) {
        this.rootFlag = this.$root.$data[key] || false
        return this.rootFlag
      }
      return null
    },

    scrollToElement() {
      // this.$el.scrollIntoView
      if (this.$el) {
        this.$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    },

    setElementAttribute(attr, value) {
      // Direct DOM manipulation via $el
      if (this.$el) {
        this.$el.setAttribute(attr, value)
      }
    }
  }
}
