// Edge case: Uses this.$route and this.$router for navigation-based logic
export default {
  data() {
    return {
      breadcrumbs: [],
      homeCrumb: { label: 'Home', path: '/', icon: 'home' }
    }
  },

  computed: {
    currentBreadcrumb() {
      if (this.breadcrumbs.length === 0) return null
      return this.breadcrumbs[this.breadcrumbs.length - 1]
    }
  },

  methods: {
    buildBreadcrumbs() {
      const route = this.$route
      if (!route || !route.matched) {
        this.breadcrumbs = [this.homeCrumb]
        return
      }

      const crumbs = [this.homeCrumb]

      route.matched.forEach((matched) => {
        const meta = matched.meta || {}
        if (meta.breadcrumb) {
          crumbs.push({
            label: typeof meta.breadcrumb === 'function'
              ? meta.breadcrumb(route)
              : meta.breadcrumb,
            path: matched.path,
            icon: meta.breadcrumbIcon || null
          })
        }
      })

      if (route.params && route.params.id) {
        const entityName = route.meta && route.meta.entityName
        if (entityName) {
          crumbs.push({
            label: `${entityName} #${route.params.id}`,
            path: route.path,
            icon: null
          })
        }
      }

      this.breadcrumbs = crumbs
    },

    navigateToBreadcrumb(crumb) {
      if (!crumb || !crumb.path) return

      if (crumb.path === this.$route.path) return

      this.$router.push(crumb.path).catch((err) => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('Breadcrumb navigation error:', err)
        }
      })
    }
  },

  watch: {
    '$route': {
      handler() {
        this.buildBreadcrumbs()
      },
      immediate: true
    }
  }
}
