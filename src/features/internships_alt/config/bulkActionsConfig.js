export const bulkActionsConfig = [
  {
    key: 'change-status',
    label: 'Change Status',
    requiredInput: 'status',
    mutationType: 'updateStatus',
    hasPermission: (permissions) => permissions.canBulkEdit && permissions.canChangeStatus,
  },
];