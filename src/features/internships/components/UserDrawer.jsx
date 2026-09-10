import React, { useState } from 'react';
import {
  Drawer,
  Typography,
  Button,
  Alert,
  IconButton,
  Box,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useFormSubmission } from '../hooks/useFormSubmissions';
import { getValidationSchema } from '../form/UserValidationSchema';
import { userFormConfig, ROLES } from '../form/formConfig';
import { UserForm } from './UserForm';
import notify from '../../../utils/toast';

/**
 * @typedef {Object} UserDrawerProps
 * @property {boolean} open - Whether the drawer is open
 * @property {'view' | 'edit' | 'create'} mode - Current mode
 * @property {Object | null} user - User being viewed/edited, null for create mode
 * @property {Object} permissions - Current user's permissions
 * @property {() => void} onClose - Handler for closing the drawer
 * @property {(data: Object) => Promise<void>} onCreate - Handler for creating a user
 * @property {(params: { id: string; payload: Object }) => Promise<void>} onUpdate - Handler for updating a user
 * @property {(params: { id: string; role: string }) => Promise<void>} onRoleChange - Handler for changing user role
 * @property {(params: { id: string; isActive: boolean }) => Promise<void>} onStatusChange - Handler for changing user status
 * @property {(mode: 'view' | 'edit' | 'create') => void} [onModeChange] - Optional handler to change mode externally
 */

export function UserDrawer({
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
  const [localMode, setLocalMode] = useState(mode);

  const handleModeChange = (newMode) => {
    setLocalMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

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
        const userId = user?.id;
        if (!userId) {
          throw new Error('User ID is missing for the update operation.');
        }

        await onUpdate({ id: userId, payload: filteredPayload });

        if (filteredPayload.role && filteredPayload.role !== user.role) {
          await onRoleChange({ id: userId, role: filteredPayload.role });
        }

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
    <Drawer
      anchor="right"
      open={open}
      onClose={formSubmission.isSaving ? undefined : onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 450 },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="h2">
          {localMode === 'create' ? 'Create User' : localMode === 'edit' ? 'Edit User' : 'View User'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={formSubmission.isSaving}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Form Body (Scrollable) */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
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
      </Box>

      <Divider />

      {/* Footer Actions */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1.5,
        }}
      >
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
      </Box>
    </Drawer>
  );
}

export default UserDrawer;