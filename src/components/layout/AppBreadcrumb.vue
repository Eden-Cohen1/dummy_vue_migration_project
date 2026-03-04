<template>
  <nav class="mb-4" aria-label="Breadcrumb">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center space-x-2">
      <div class="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      <span class="text-gray-300">/</span>
      <div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      <span class="text-gray-300">/</span>
      <div class="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="flex items-center space-x-2 text-sm text-red-500">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <span>Failed to load breadcrumbs</span>
      <button
        v-if="canRetry"
        @click="retry(loadBreadcrumbs)"
        class="text-indigo-600 hover:text-indigo-800 underline text-xs"
      >
        Retry
      </button>
    </div>

    <!-- Breadcrumb List -->
    <ol v-else class="flex items-center space-x-2 text-sm">
      <!-- Home icon -->
      <li>
        <router-link
          to="/"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-150"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </router-link>
      </li>

      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
        <!-- Separator -->
        <li class="flex items-center">
          <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </li>

        <!-- Crumb Link or Text -->
        <li>
          <router-link
            v-if="index < breadcrumbs.length - 1"
            :to="crumb.path"
            class="text-gray-500 hover:text-indigo-600 font-medium transition-colors duration-150"
          >
            {{ crumb.label }}
          </router-link>
          <span
            v-else
            class="text-gray-800 font-semibold"
          >
            {{ crumb.label }}
          </span>
        </li>
      </template>
    </ol>

    <!-- Route Params Display (if any) -->
    <div v-if="hasRouteParams" class="mt-1">
      <span class="text-xs text-gray-400">
        ID: {{ $route.params.id || 'N/A' }}
      </span>
    </div>
  </nav>
</template>

<script>
import loadingMixin from '../../mixins/loadingMixin'

export default {
  name: 'AppBreadcrumb',

  mixins: [loadingMixin],

  computed: {
    breadcrumbs() {
      const matched = this.$route.matched || []
      return matched
        .filter(route => route.meta && route.meta.breadcrumb)
        .map(route => {
          let label = route.meta.breadcrumb

          // Replace dynamic segments with actual params
          if (typeof label === 'function') {
            label = label(this.$route)
          }

          // Replace param placeholders in label
          if (this.$route.params) {
            Object.keys(this.$route.params).forEach(key => {
              label = label.replace(`:${key}`, this.$route.params[key])
            })
          }

          return {
            label: label,
            path: route.path.replace(/:(\w+)/g, (match, paramName) => {
              return this.$route.params[paramName] || match
            })
          }
        })
    },

    currentRoutePath() {
      return this.$route.path
    },

    hasRouteParams() {
      return this.$route.params && Object.keys(this.$route.params).length > 0
    }
  },

  methods: {
    loadBreadcrumbs() {
      this.startLoading('Loading breadcrumbs...')
      try {
        // Force re-evaluation of breadcrumbs
        const path = this.$route.path
        if (path) {
          this.stopLoading()
        }
      } catch (err) {
        this.setError(err.message)
      }
    }
  },

  watch: {
    '$route.path': {
      handler() {
        this.loadBreadcrumbs()
      },
      immediate: true
    }
  }
}
</script>
