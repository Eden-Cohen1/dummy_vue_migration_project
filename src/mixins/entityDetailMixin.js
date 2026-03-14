// Edge case: Right branch of diamond dependency — also extends crudMixin.
// A component using both entityListMixin and entityDetailMixin creates a diamond
// where crudMixin is the shared base. Tests member deduplication.
import crudMixin from '@/mixins/crudMixin'

export default {
  mixins: [crudMixin],

  data() {
    return {
      isEditing: false,
      changeLog: [],
      detailTab: 'overview'
    }
  },

  computed: {
    isModified() {
      return this.changeLog.length > 0
    },

    lastChange() {
      return this.changeLog.length > 0
        ? this.changeLog[this.changeLog.length - 1]
        : null
    }
  },

  methods: {
    startEditing() {
      this.isEditing = true
      this.changeLog = []
    },

    saveChanges(endpoint) {
      if (this.currentItem && this.currentItem.id) {
        return this.updateItem(endpoint, this.currentItem.id, this.currentItem)
      }
    },

    discardChanges() {
      this.isEditing = false
      this.changeLog = []
    },

    logChange(field, oldValue, newValue) {
      this.changeLog.push({
        field,
        oldValue,
        newValue,
        timestamp: new Date().toISOString()
      })
    }
  }
}
