export default {
  data() {
    return {
      currentTheme: 'light',
      themes: ['light', 'dark', 'blue'],
      customColors: {}
    }
  },

  computed: {
    themeClass() {
      return 'theme-' + this.currentTheme
    },

    isDarkMode() {
      return this.currentTheme === 'dark'
    },

    themeVariables() {
      const variables = {
        light: {
          '--bg-color': '#ffffff',
          '--text-color': '#333333',
          '--primary-color': '#4CAF50',
          '--border-color': '#e0e0e0'
        },
        dark: {
          '--bg-color': '#1a1a1a',
          '--text-color': '#f0f0f0',
          '--primary-color': '#66BB6A',
          '--border-color': '#444444'
        },
        blue: {
          '--bg-color': '#e3f2fd',
          '--text-color': '#1a237e',
          '--primary-color': '#2196F3',
          '--border-color': '#90caf9'
        }
      }
      return variables[this.currentTheme] || variables.light
    }
  },

  methods: {
    setTheme(name) {
      if (this.themes.includes(name)) {
        this.currentTheme = name
        localStorage.setItem('selectedTheme', name)
      }
    },

    toggleDarkMode() {
      if (this.currentTheme === 'dark') {
        this.setTheme('light')
      } else {
        this.setTheme('dark')
      }
    },

    applyTheme() {
      // Remove existing theme classes
      this.themes.forEach(theme => {
        document.documentElement.classList.remove('theme-' + theme)
      })
      // Apply current theme class
      document.documentElement.classList.add('theme-' + this.currentTheme)

      // Apply CSS variables
      const vars = this.themeVariables
      Object.keys(vars).forEach(key => {
        document.documentElement.style.setProperty(key, vars[key])
      })

      if (this.$el && this.$el.style) {
        this.$el.style.transition = 'background-color 0.3s ease'
      }

      this.$forceUpdate()
    }
  },

  created() {
    const savedTheme = localStorage.getItem('selectedTheme')
    if (savedTheme && this.themes.includes(savedTheme)) {
      this.currentTheme = savedTheme
    }
  },

  watch: {
    currentTheme: 'applyTheme'
  }
}
