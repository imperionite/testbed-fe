import { getVisibleUserFields, getUserFormPermissions } from '../userPermissions'
import { formatUserDate, formatAccountStatus } from '../../shared/fieldFormatters'
import DynamicForm from '../../shared/components/DynamicForm'

/**
 * @typedef {Object} UserFormProps
 * @property {string} role - Current user's role (admin, instructor, student)
 * @property {'view' | 'edit' | 'create'} mode - Form mode
 * @property {Object} control - React Hook Form control object
 * @property {Object} errors - Form field errors object from react-hook-form
 */

/**
 * UserForm component that dynamically renders user input fields based on
 * Role-Based Access Control (RBAC) visibility rules and form mode.
 */
export function UserForm({ role, mode, control, errors }) {
  // Get the list of fields that are visible for this role and mode
  const visibleFields = getVisibleUserFields(role, mode)

  // Get permission helper to determine field-level editability rules
  const { getFieldRule } = getUserFormPermissions(role, mode)

  // Render form
  return (
    <DynamicForm
      fields={visibleFields}
      getFieldRule={getFieldRule}
      control={control}
      errors={errors}
      formatters={{ date: formatUserDate, status: formatAccountStatus }}
      mode={mode}
    />
  )
}

export default UserForm
