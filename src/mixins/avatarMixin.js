// Edge case: Avatar generation with computed style objects and seed-based color.
// Tests migration of computed properties that return style objects (common in
// Vue 2 templates with :style binding) and string manipulation methods.
export default {
  data() {
    return {
      avatarUrl: '',
      avatarInitials: '',
      avatarColor: '#3498db',
      avatarSize: 40
    }
  },

  computed: {
    avatarStyle() {
      return {
        width: `${this.avatarSize}px`,
        height: `${this.avatarSize}px`,
        borderRadius: '50%',
        backgroundColor: this.hasCustomAvatar ? 'transparent' : this.avatarColor,
        backgroundImage: this.hasCustomAvatar ? `url(${this.avatarUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${Math.floor(this.avatarSize * 0.4)}px`,
        color: '#ffffff',
        fontWeight: 'bold',
        lineHeight: 1
      }
    },

    hasCustomAvatar() {
      return !!this.avatarUrl && this.avatarUrl.length > 0
    }
  },

  methods: {
    generateAvatar(user) {
      if (!user) return
      if (user.avatar || user.avatarUrl) {
        this.avatarUrl = user.avatar || user.avatarUrl
      } else {
        this.avatarUrl = ''
      }
      const name = user.name || user.displayName || user.email || ''
      this.avatarInitials = this.getInitials(name)
      this.avatarColor = this.getRandomColor(name)
    },

    getInitials(name) {
      if (!name) return '?'
      const parts = name.trim().split(/\s+/)
      if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase()
      }
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
    },

    getRandomColor(seed) {
      const colors = [
        '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
        '#9b59b6', '#1abc9c', '#e67e22', '#34495e',
        '#16a085', '#c0392b', '#8e44ad', '#d35400'
      ]
      let hash = 0
      const str = String(seed || '')
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
      return colors[Math.abs(hash) % colors.length]
    },

    setAvatarUrl(url) {
      this.avatarUrl = url || ''
    }
  }
}
