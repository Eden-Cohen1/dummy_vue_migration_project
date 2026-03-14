// Edge case: Dead import target — InfoTooltip.vue imports this mixin but uses zero members.
// This tests whether the migration tool detects and handles completely unused mixin imports.
export default {
  data() {
    return {
      tooltipText: '',
      isTooltipVisible: false,
      tooltipPosition: { x: 0, y: 0 }
    }
  },

  computed: {
    tooltipStyle() {
      return {
        position: 'absolute',
        left: `${this.tooltipPosition.x}px`,
        top: `${this.tooltipPosition.y}px`,
        opacity: this.isTooltipVisible ? 1 : 0,
        pointerEvents: 'none',
        transition: 'opacity 0.15s ease-in-out'
      }
    }
  },

  methods: {
    showTooltip(event, text) {
      this.tooltipText = text
      this.isTooltipVisible = true
      this.positionTooltip(event)
    },

    hideTooltip() {
      this.isTooltipVisible = false
      this.tooltipText = ''
    },

    positionTooltip(event) {
      const rect = event.target.getBoundingClientRect()
      this.tooltipPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top - 8
      }
    }
  }
}
