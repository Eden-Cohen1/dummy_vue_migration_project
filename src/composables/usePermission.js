import { ref, computed } from 'vue'

export function usePermission() {
  const userPermissions = ref([])
  const roleMap = ref({
    admin: ['read', 'write', 'create', 'delete', 'manage'],
    editor: ['read', 'write', 'create'],
    viewer: ['read']
  })

  const canEdit = computed(() => userPermissions.value.includes('write'))

  const canCreate = computed(() => userPermissions.value.includes('create'))

  const isManager = computed(() => userPermissions.value.includes('manage'))

  const permissionLevel = computed(() => {
    if (userPermissions.value.includes('manage')) return 'admin'
    if (userPermissions.value.includes('create')) return 'editor'
    if (userPermissions.value.includes('read')) return 'viewer'
    return 'none'
  })

  function checkPermission(action) {
    return userPermissions.value.includes(action)
  }

  function requestPermission(action) {
    if (!userPermissions.value.includes(action)) {
      userPermissions.value.push(action)
    }
  }

  // NOTE: canDelete and hasRole are NOT defined in this composable

  return {
    userPermissions,
    roleMap,
    canEdit,
    canCreate,
    isManager,
    permissionLevel,
    checkPermission,
    requestPermission
  }
}
