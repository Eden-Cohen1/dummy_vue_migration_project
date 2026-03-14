// Edge case: Realistic filler mixin for project depth — color conversion utilities
export default {
  data() {
    return {
      selectedColor: '#3498db',
      colorPalette: [
        '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
        '#1abc9c', '#3498db', '#9b59b6', '#34495e'
      ],
      recentColors: [],
      maxRecentColors: 10
    }
  },

  computed: {
    colorPreview() {
      return {
        backgroundColor: this.selectedColor,
        width: '24px',
        height: '24px',
        borderRadius: '4px',
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }
    },

    isValidColor() {
      return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(this.selectedColor)
    }
  },

  methods: {
    selectColor(color) {
      if (!color) return
      this.selectedColor = color
      this.addToRecent(color)
      this.$emit('color-selected', color)
    },

    addToRecent(color) {
      const filtered = this.recentColors.filter((c) => c !== color)
      filtered.unshift(color)

      if (filtered.length > this.maxRecentColors) {
        filtered.pop()
      }

      this.recentColors = filtered
    },

    hexToRgb(hex) {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)
      if (!result) return null

      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    },

    rgbToHex(r, g, b) {
      const toHex = (value) => {
        const hex = Math.max(0, Math.min(255, value)).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }

      return '#' + toHex(r) + toHex(g) + toHex(b)
    }
  }
}
