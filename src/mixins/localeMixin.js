// Edge case: Realistic filler mixin for project depth — i18n locale switching with dynamic translations
export default {
  data() {
    return {
      currentLocale: 'en',
      availableLocales: [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' }
      ],
      translations: {},
      isLoadingLocale: false
    }
  },

  computed: {
    isRTL() {
      const rtlLocales = ['ar', 'he', 'fa', 'ur']
      return rtlLocales.includes(this.currentLocale)
    },

    localeLabel() {
      const locale = this.availableLocales.find((l) => l.code === this.currentLocale)
      return locale ? locale.name : this.currentLocale
    }
  },

  methods: {
    setLocale(code) {
      if (code === this.currentLocale) return

      const locale = this.availableLocales.find((l) => l.code === code)
      if (!locale) {
        console.warn(`Locale "${code}" is not available`)
        return
      }

      this.currentLocale = code
      document.documentElement.setAttribute('lang', code)
      document.documentElement.setAttribute('dir', this.isRTL ? 'rtl' : 'ltr')

      this.loadTranslations(code)
      this.$emit('locale-changed', code)
    },

    translate(key, params) {
      let text = this.translations[key] || key

      if (params && typeof params === 'object') {
        Object.keys(params).forEach((param) => {
          text = text.replace(new RegExp(`{${param}}`, 'g'), params[param])
        })
      }

      return text
    },

    loadTranslations(locale) {
      this.isLoadingLocale = true

      return new Promise((resolve) => {
        this.$nextTick(() => {
          this.translations = {
            'app.title': locale === 'es' ? 'Gestión de Proyectos' : locale === 'fr' ? 'Gestion de Projets' : 'Project Management',
            'app.save': locale === 'es' ? 'Guardar' : locale === 'fr' ? 'Sauvegarder' : 'Save',
            'app.cancel': locale === 'es' ? 'Cancelar' : locale === 'fr' ? 'Annuler' : 'Cancel',
            'app.delete': locale === 'es' ? 'Eliminar' : locale === 'fr' ? 'Supprimer' : 'Delete',
            'app.loading': locale === 'es' ? 'Cargando...' : locale === 'fr' ? 'Chargement...' : 'Loading...'
          }
          this.isLoadingLocale = false
          resolve(this.translations)
        })
      })
    }
  },

  mounted() {
    this.loadTranslations(this.currentLocale)
  }
}
