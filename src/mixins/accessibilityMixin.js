// Edge case: DOM manipulation with focus trapping and live region announcements
export default {
  data() {
    return {
      ariaLabels: {},
      focusTrapEnabled: false,
      announcements: [],
      previousFocusElement: null,
      trapContainerRef: null
    }
  },

  computed: {
    accessibilityScore() {
      const labelCount = Object.keys(this.ariaLabels).length
      if (labelCount === 0) return 0
      if (labelCount < 3) return 25
      if (labelCount < 6) return 50
      if (labelCount < 10) return 75
      return 100
    }
  },

  methods: {
    setAriaLabel(element, label) {
      this.ariaLabels = { ...this.ariaLabels, [element]: label }

      this.$nextTick(() => {
        const el = this.$refs[element] || document.getElementById(element)
        if (el) {
          el.setAttribute('aria-label', label)
        }
      })
    },

    trapFocus(containerRef) {
      this.previousFocusElement = document.activeElement
      this.trapContainerRef = containerRef
      this.focusTrapEnabled = true

      this.$nextTick(() => {
        const container = this.$refs[containerRef] || document.querySelector(containerRef)
        if (!container) return

        const focusable = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        if (focusable.length > 0) {
          focusable[0].focus()
        }

        container.addEventListener('keydown', this._handleTrapKeydown)
      })
    },

    releaseFocus() {
      this.focusTrapEnabled = false

      if (this.trapContainerRef) {
        const container = this.$refs[this.trapContainerRef] || document.querySelector(this.trapContainerRef)
        if (container) {
          container.removeEventListener('keydown', this._handleTrapKeydown)
        }
      }

      if (this.previousFocusElement && this.previousFocusElement.focus) {
        this.previousFocusElement.focus()
      }

      this.previousFocusElement = null
      this.trapContainerRef = null
    },

    announceToScreenReader(message) {
      this.announcements.push({ message, timestamp: Date.now() })

      const liveRegion = document.getElementById('aria-live-region')
      if (liveRegion) {
        liveRegion.textContent = message
      }
    },

    _handleTrapKeydown(event) {
      if (event.key !== 'Tab') return

      const container = event.currentTarget
      const focusable = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }
}
