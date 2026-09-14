import { defaultTableConfig } from '../../shared/config/defaultTableConfig'

/**
 * User-specific table overrides, sorting configurations, and initial state
 */
export const userTableConfig = {
  ...defaultTableConfig,
  // editDisplayMode: "row",
  initialState: {
    ...defaultTableConfig.initialState,
    columnOrder: [
      'email',
      'firstName',
      'lastName',
      'middleName',
      'suffix',
      'role',
      'isActive',
      'createdAt',
      'mrt-row-actions',
    ],
  },
}
