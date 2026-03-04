<template>
  <span
    :class="[
      'inline-flex items-center font-medium rounded-full',
      sizeClasses,
      badgeClasses
    ]"
  >
    <span :class="['rounded-full mr-1.5', dotClasses]"></span>
    <span class="capitalize">{{ status }}</span>
  </span>
</template>

<script>
import permissionMixin from '@/mixins/permissionMixin'
import { getStatusColor, getPriorityColor } from '@/utils/helpers'

export default {
  name: 'StatusBadge',

  mixins: [permissionMixin],

  props: {
    status: {
      type: String,
      default: 'todo'
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    }
  },

  computed: {
    canDelete() {
      return true
    },

    statusColorClass() {
      return getStatusColor(this.status)
    },

    priorityColorClass() {
      return getPriorityColor(this.status)
    },

    sizeClasses() {
      const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm'
      }
      return sizes[this.size] || sizes.md
    },

    dotClasses() {
      const sizes = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-2.5 h-2.5'
      }
      const dotSize = sizes[this.size] || sizes.md

      const colorMap = {
        'todo': 'bg-gray-400',
        'in-progress': 'bg-blue-400',
        'review': 'bg-yellow-400',
        'done': 'bg-green-400',
        'low': 'bg-green-400',
        'medium': 'bg-yellow-400',
        'high': 'bg-orange-400',
        'critical': 'bg-red-400'
      }
      const dotColor = colorMap[this.status] || 'bg-gray-400'

      return `${dotSize} ${dotColor}`
    },

    badgeClasses() {
      const bgMap = {
        'todo': 'bg-gray-100 text-gray-700',
        'in-progress': 'bg-blue-100 text-blue-700',
        'review': 'bg-yellow-100 text-yellow-700',
        'done': 'bg-green-100 text-green-700',
        'low': 'bg-green-100 text-green-700',
        'medium': 'bg-yellow-100 text-yellow-700',
        'high': 'bg-orange-100 text-orange-700',
        'critical': 'bg-red-100 text-red-700'
      }
      return bgMap[this.status] || 'bg-gray-100 text-gray-700'
    }
  }
}
</script>
