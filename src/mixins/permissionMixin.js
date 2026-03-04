export default {
  data() {
    return {
      userPermissions: [],
      roleMap: {
        admin: ['create', 'read', 'update', 'delete'],
        manager: ['create', 'read', 'update'],
        developer: ['read', 'update'],
        viewer: ['read']
      }
    }
  },

  computed: {
    canEdit() {
      return this.checkPermission('update')
    },

    canDelete() {
      return this.checkPermission('delete')
    },

    canCreate() {
      return this.checkPermission('create')
    },

    isManager() {
      return this.userPermissions.includes('manage') || this.checkPermission('create')
    },

    permissionLevel() {
      if (this.checkPermission('delete')) {
        return 'admin'
      }
      if (this.checkPermission('update')) {
        return 'editor'
      }
      return 'viewer'
    }
  },

  methods: {
    checkPermission(action) {
      return this.userPermissions.includes(action)
    },

    requestPermission(action) {
      // Simulate permission request
      const granted = this.userPermissions.includes(action)
      if (!granted) {
        this.$router.push('/unauthorized')
      }
      return granted
    },

    hasRole(role) {
      const permissions = this.roleMap[role]
      if (!permissions) return false
      return permissions.every(p => this.userPermissions.includes(p))
    }
  }
}
