import { ROLES, MODES, FIELD_RULES, ROLE_OPTIONS } from '../../shared/constants/constants'
// ─────────────────────────────────────────────────────────────────────────────
// FIELD CONFIG
//
// The default for any unlisted role + mode is HIDDEN, handled by getFieldRule() in userPermissions.js.
// ─────────────────────────────────────────────────────────────────────────────
export const userFormConfig = [
  {
    name: 'id',
    label: 'ID',
    type: 'text',
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.READONLY,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: 'createdAt',
    label: 'Created At',
    type: 'text',
    format: 'date',
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.READONLY,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.READONLY,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: 'middleName',
    label: 'Middle Name',
    type: 'text',
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.EDITABLE,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: 'suffix',
    label: 'Suffix',
    type: 'text',
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.EDITABLE,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: ROLE_OPTIONS,
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: 'isActive',
    label: 'Account Status',
    type: 'status_account',
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: 'password',
    label: 'Password',
    type: 'text',
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
    },
  },
]
