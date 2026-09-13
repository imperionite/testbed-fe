import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useFormSubmission } from '../hooks/useFormSubmissions';
import { getValidationSchema } from '../form/UserValidationSchema';
import { userFormConfig, ROLES } from '../form/formConfig';
import { UserForm } from './UserForm';
import notify from '../../../utils/toast';

/**
 * @typedef {Object} UserModalProps
 * @property {boolean} open - Whether the modal is open
 * @property {'view' | 'edit' | 'create'} mode - Current modal mode
 * @property {Object | null} user - User being viewed/edited, null for create mode
 * @property {Object} permissions - Current user's permissions
 * @property {() => void} onClose - Handler for closing the modal
 * @property {(data: Object) => Promise<void>} onCreate - Handler for creating a user
 * @property {(params: { id: string; payload: Object }) => Promise<void>} onUpdate - Handler for updating a user
 * @property {(params: { id: string; role: string }) => Promise<void>} onRoleChange - Handler for changing user role
 * @property {(params: { id: string; isActive: boolean }) => Promise<void>} onStatusChange - Handler for changing user status
 * @property {(mode: 'view' | 'edit' | 'create') => void} [onModeChange] - Optional handler to change modal mode externally
 */

/**
 * UserModal component that orchestrates user details editing, creation, and viewing
 * inside a focused Dialog interface. It manages state transitions and submits validated
 * payloads securely.
 */
export function UserModal({
  open,
  mode,
  user,
  permissions,
  onClose,
  onCreate,
  onUpdate,
  onRoleChange,
  onStatusChange,
  onModeChange,
}) {
  // Support both local transition and parent-state driven mode changes
  const [localMode, setLocalMode] = useState(mode);

  const handleModeChange = (newMode) => {
    setLocalMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  // Determine active form interaction role
  const activeRole = permissions?.canEdit ? ROLES.ADMIN : ROLES.STUDENT;

  const formSubmission = useFormSubmission({
    mode: localMode,
    entity: user,
    schema: getValidationSchema(localMode),
    fieldConfig: userFormConfig,
    role: activeRole,
    permissions: {
      canSubmit: localMode === 'create' ? permissions?.canCreate : permissions?.canEdit,
    },
    onSubmit: async (filteredPayload) => {
      if (localMode === 'create') {
        await onCreate(filteredPayload);
      } else {
        // Sequentially execute mutations for partial updates based on what's changed/configured
        const userId = user?.id;
        if (!userId) {
          throw new Error('User ID is missing for the update operation.');
        }

        // 1. Submit core user updates; the API normalizes form field names.
        await onUpdate({ id: userId, payload: filteredPayload });

        // 2. Perform role change mutation if edited
        if (filteredPayload.role && filteredPayload.role !== user.role) {
          await onRoleChange({ id: userId, role: filteredPayload.role });
        }

        // 3. Perform status change mutation if edited.
        const updatedActive = filteredPayload.isActive;
        const originalActive = user.isActive;

        if (updatedActive !== undefined && updatedActive !== originalActive) {
          await onStatusChange({ id: userId, isActive: updatedActive });
        }
      }
    },
    onSuccess: () => {
      notify.success(localMode === 'create' ? 'User created successfully' : 'User updated successfully');
      onClose();
    },
  });

  return (
    <Dialog
      open={open}
      onClose={formSubmission.isSaving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="user-modal-title"
    >
      <DialogTitle id="user-modal-title">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            {localMode === 'create' ? 'Create User' : localMode === 'edit' ? 'Edit User' : 'View User'}
          </span>
          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={formSubmission.isSaving}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ pb: 3 }}>
        {formSubmission.error && (
          <Alert severity="error" sx={{ mb: 2.5, whiteSpace: 'pre-wrap' }}>
            {formSubmission.error}
          </Alert>
        )}

        <UserForm
          role={activeRole}
          mode={localMode}
          control={formSubmission.formMethods.control}
          errors={formSubmission.formMethods.formState.errors}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={formSubmission.isSaving}
          color="inherit"
        >
          {localMode === 'view' ? 'Close' : 'Cancel'}
        </Button>

        {localMode === 'view' && permissions?.canEdit && (
          <Button
            onClick={() => handleModeChange('edit')}
            variant="contained"
            color="primary"
          >
            Edit
          </Button>
        )}

        {localMode !== 'view' && (
          <Button
            onClick={formSubmission.formMethods.handleSubmit(formSubmission.onSubmit)}
            variant="contained"
            color="primary"
            disabled={formSubmission.isSaving}
          >
            {formSubmission.isSaving ? 'Saving...' : 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default UserModal;
