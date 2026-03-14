// Edge case: Window resize listener with lifecycle hooks mounted/beforeUnmount
export default {
  data() {
    return {
      windowWidth: 0,
      windowHeight: 0,
      breakpoint: 'desktop',
      resizeDebounceTimer: null
    }
  },

  computed: {
    isMobile() {
      return this.windowWidth < 768
    },

    isTablet() {
      return this.windowWidth >= 768 && this.windowWidth <= 1024
    },

    isDesktop() {
      return this.windowWidth > 1024
    },

    screenOrientation() {
      return this.windowWidth > this.windowHeight ? 'landscape' : 'portrait'
    }
  },

  methods: {
    handleResize() {
      if (this.resizeDebounceTimer) {
        clearTimeout(this.resizeDebounceTimer)
      }

      this.resizeDebounceTimer = setTimeout(() => {
        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight
        this.breakpoint = this.getBreakpoint(this.windowWidth)
        this.$emit('breakpoint-changed', this.breakpoint)
      }, 100)
    },

    getBreakpoint(width) {
      if (width < 576) return 'xs'
      if (width < 768) return 'sm'
      if (width < 992) return 'md'
      if (width < 1200) return 'lg'
      if (width < 1400) return 'xl'
      return 'xxl'
    }
  },

  mounted() {
    this.windowWidth = window.innerWidth
    this.windowHeight = window.innerHeight
    this.breakpoint = this.getBreakpoint(this.windowWidth)

    window.addEventListener('resize', this.handleResize, { passive: true })
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)

    if (this.resizeDebounceTimer) {
      clearTimeout(this.resizeDebounceTimer)
      this.resizeDebounceTimer = null
    }
  }
}
