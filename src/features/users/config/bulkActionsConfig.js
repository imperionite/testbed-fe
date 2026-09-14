export const bulkActionsConfig = [
  {
    key: 'change-role',
    label: 'Change role',
    requiredInput: 'role',
    mutationType: 'updateRole',
    hasPermission: (permissions) => permissions.canBulkEdit && permissions.canChangeRole,
  },
  {
    key: 'activate',
    label: 'Activate',
    requiredInput: null,
    mutationType: 'updateStatus',
    hasPermission: (permissions) => permissions.canBulkEdit && permissions.canChangeStatus,
  },
  {
    key: 'deactivate',
    label: 'Deactivate',
    requiredInput: null,
    mutationType: 'updateStatus',
    hasPermission: (permissions) => permissions.canBulkEdit && permissions.canChangeStatus,
  }
];