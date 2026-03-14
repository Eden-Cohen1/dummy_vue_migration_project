// Edge case: Window print API with beforeprint/afterprint event listeners
export default {
  data() {
    return {
      isPrintMode: false,
      printOptions: {
        orientation: 'portrait',
        margins: 'normal'
      },
      printStyleElement: null
    }
  },

  computed: {
    printableContent() {
      if (!this.$el) return ''
      const printArea = this.$el.querySelector('[data-print-area]') || this.$el
      return printArea.innerHTML || ''
    }
  },

  methods: {
    preparePrint() {
      this.isPrintMode = true

      const styles = `
        @media print {
          body * { visibility: hidden; }
          [data-print-area], [data-print-area] * { visibility: visible; }
          [data-print-area] { position: absolute; left: 0; top: 0; width: 100%; }
          @page {
            size: ${this.printOptions.orientation};
            margin: ${this.printOptions.margins === 'narrow' ? '0.5cm' : '2cm'};
          }
        }
      `

      this.printStyleElement = document.createElement('style')
      this.printStyleElement.setAttribute('data-print-styles', 'true')
      this.printStyleElement.textContent = styles
      document.head.appendChild(this.printStyleElement)

      this.$emit('print-preparing')
    },

    print() {
      this.preparePrint()

      this.$nextTick(() => {
        window.print()
      })
    },

    afterPrint() {
      this.isPrintMode = false

      if (this.printStyleElement && this.printStyleElement.parentNode) {
        this.printStyleElement.parentNode.removeChild(this.printStyleElement)
        this.printStyleElement = null
      }

      this.$emit('print-completed')
    },

    _onBeforePrint() {
      this.isPrintMode = true
    },

    _onAfterPrint() {
      this.afterPrint()
    }
  },

  mounted() {
    window.addEventListener('beforeprint', this._onBeforePrint)
    window.addEventListener('afterprint', this._onAfterPrint)
  },

  beforeUnmount() {
    window.removeEventListener('beforeprint', this._onBeforePrint)
    window.removeEventListener('afterprint', this._onAfterPrint)

    if (this.printStyleElement && this.printStyleElement.parentNode) {
      this.printStyleElement.parentNode.removeChild(this.printStyleElement)
    }
  }
}
