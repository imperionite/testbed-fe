import React from 'react'
import FormDialog from '../../shared/components/FormDialog'
import { UserForm } from './UserForm'
import { useFormSubmission } from '../../shared/hooks/useFormSubmissions'
import { getValidationSchema } from '../form/UserValidationSchema'
import { userFormConfig } from '../form/userFormConfig'
import { ROLES } from '../../shared/constants/constants'
import { executeUserSave } from '../form/userFormActionsOrchestrator'
import notify from '../../../utils/toast'

export function UserModal({
  open,
  mode,
  user,
  permissions,
  mutations, // Passes return value of useUserMutations()
  onClose,
  onModeChange,
}) {
  const activeRole = permissions?.canEdit ? ROLES.ADMIN : ROLES.STUDENT

  const formSubmission = useFormSubmission({
    mode,
    entity: user,
    schema: getValidationSchema(mode),
    fieldConfig: userFormConfig,
    role: activeRole,
    permissions: {
      canSubmit: mode === 'create' ? permissions?.canCreate : permissions?.canEdit,
    },
    onSubmit: async (filteredPayload) => {
      await executeUserSave({
        mode,
        user,
        filteredPayload,
        mutations,
      })
    },
    onSuccess: () => {
      notify.success(mode === 'create' ? 'User created successfully' : 'User updated successfully')
      onClose()
    },
  })

  const modalTitle = mode === 'create' ? 'Create User' : mode === 'edit' ? 'Edit User' : 'View User'

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={modalTitle}
      mode={mode}
      isSaving={formSubmission.isSaving}
      error={formSubmission.error}
      canEdit={permissions?.canEdit}
      onEdit={() => onModeChange?.('edit')}
      onSave={formSubmission.formMethods.handleSubmit(formSubmission.onSubmit)}
    >
      <UserForm
        role={activeRole}
        mode={mode}
        control={formSubmission.formMethods.control}
        errors={formSubmission.formMethods.formState.errors}
      />
    </FormDialog>
  )
}

export default UserModal
