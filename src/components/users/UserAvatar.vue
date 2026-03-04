<template>
  <div
    :class="[sizeClass, 'relative inline-flex items-center justify-center rounded-full flex-shrink-0']"
    v-bind="$attrs"
  >
    <!-- Loading State -->
    <div v-if="isLoading" :class="[sizeClass, 'rounded-full bg-gray-200 animate-pulse']"></div>

    <!-- Avatar Image -->
    <img
      v-else-if="avatarUrl && !imageError"
      :src="avatarUrl"
      :alt="user.name"
      :class="[sizeClass, 'rounded-full object-cover border-2 border-white shadow-sm']"
      @error="handleImageError"
      @load="handleImageLoad"
    />

    <!-- Fallback Initials -->
    <div
      v-else
      :class="[sizeClass, initialsTextSize, avatarColorClass, 'rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm']"
    >
      {{ initials }}
    </div>

    <!-- Online status indicator -->
    <span
      v-if="showStatus && user.status"
      :class="[
        statusDotSize,
        user.status === 'active' ? 'bg-green-400 border-white' : 'bg-gray-300 border-white',
        'absolute bottom-0 right-0 rounded-full border-2'
      ]"
    ></span>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loadingMixin'

export default {
  name: 'UserAvatar',

  mixins: [loadingMixin],

  inheritAttrs: false,

  props: {
    user: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    showStatus: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      imageError: false
    }
  },

  computed: {
    initials() {
      if (!this.user || !this.user.name) return '?'
      return this.user.name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    },

    avatarUrl() {
      if (!this.user) return null
      return this.user.avatar || this.user.avatarUrl || this.user.profileImage || null
    },

    sizeClass() {
      const sizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
      }
      return sizes[this.size] || sizes.md
    },

    initialsTextSize() {
      const sizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-xl'
      }
      return sizes[this.size] || sizes.md
    },

    statusDotSize() {
      const sizes = {
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3.5 h-3.5'
      }
      return sizes[this.size] || sizes.md
    },

    avatarColorClass() {
      if (!this.user || !this.user.name) return 'bg-gray-300 text-gray-600'
      const colors = [
        'bg-blue-100 text-blue-700',
        'bg-green-100 text-green-700',
        'bg-purple-100 text-purple-700',
        'bg-pink-100 text-pink-700',
        'bg-indigo-100 text-indigo-700',
        'bg-yellow-100 text-yellow-700',
        'bg-red-100 text-red-700',
        'bg-teal-100 text-teal-700'
      ]
      const charCode = this.user.name.charCodeAt(0) || 0
      return colors[charCode % colors.length]
    }
  },

  watch: {
    'user.avatar'() {
      this.imageError = false
    }
  },

  methods: {
    handleImageError() {
      this.imageError = true
      this.stopLoading()
    },

    handleImageLoad() {
      this.stopLoading()
    }
  }
}
</script>
