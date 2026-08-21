import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserForm from "./UserForm";
import { ROLES, MODES } from "../form/formConfig";

export default function UserModal({
  open,
  onClose,
  disablePortal = false,
  mode: initialMode = MODES.VIEW,
  user = null,
  permissions,
  onSuccess,
  onCreate,
  onUpdate,
  onRoleChange,
  onStatusChange,
}) {
  const [mode, setMode] = useState(initialMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const role = permissions?.canEdit ? ROLES.ADMIN : ROLES.STUDENT;
  const defaultValues = user
    ? {
        ...user,
        first_name: user.first_name ?? user.firstName ?? "",
        middle_name: user.middle_name ?? user.middleName ?? "",
        last_name: user.last_name ?? user.lastName ?? "",
        is_active: user.is_active ?? user.isActive ?? true,
      }
    : {};
  const currentIsActive = user?.is_active ?? user?.isActive;

  const handleEditBtnPressed = () => setMode(MODES.EDIT);
  const handleCancelBtnPressed = () => {
    setError(null);
    setMode(MODES.VIEW);
  };

  const handleSubmitButtonPressed = () => {
    setIsSaving(true);
    document.getElementById("user-form")?.requestSubmit();
  };

  const handleSubmit = async (data) => {
    setError(null);
    try {
      if (mode === MODES.CREATE) {
        await onCreate?.({
          email: data.email,
          firstName: data.first_name,
          middleName: data.middle_name || null,
          lastName: data.last_name,
          role: data.role,
          password: data.password,
        });
        onSuccess?.("User created successfully!");
      } else {
        await onUpdate?.({
          id: user.id,
          payload: {
            email: data.email,
            firstName: data.first_name,
            middleName: data.middle_name || null,
            lastName: data.last_name,
            suffix: data.suffix || null,
          },
        });

        if (data.role !== user.role) {
          await onRoleChange?.({ id: user.id, role: data.role });
        }

        if (data.is_active !== undefined && data.is_active !== currentIsActive) {
          await onStatusChange?.({ id: user.id, isActive: data.is_active });
        }
        onSuccess?.("User updated successfully!");
      }
      setIsSaving(false);
      onClose();
    } catch (submitError) {
      setIsSaving(false);
      setError(submitError.response?.data?.message || "Unable to save user.");
    }
  };

  const canEdit = permissions?.canEdit;
  const canCreate = permissions?.canCreate;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disablePortal={disablePortal}
    >
      <DialogTitle>
        {mode === MODES.VIEW
          ? "View User"
          : mode === MODES.EDIT
            ? "Edit User"
            : "Create User"}

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {error && <Alert severity="error">{error}</Alert>}
        <UserForm
          key={mode}
          role={role}
          mode={mode}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        />
      </DialogContent>

      <DialogActions>
        {mode === MODES.VIEW && (
          <>
            {canEdit && (
              <Button onClick={handleEditBtnPressed} variant="contained">
                Edit
              </Button>
            )}
          </>
        )}

        {mode === MODES.EDIT && (
          <>
            <Button onClick={handleCancelBtnPressed} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitButtonPressed}
              color="success"
              variant="contained"
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={20} /> : null}
            >
              Save
            </Button>
          </>
        )}

        {mode === MODES.CREATE && (
          <>
            {canCreate && (
              <Button onClick={handleSubmitButtonPressed} variant="contained">
                Submit
              </Button>
            )}
          </>
        )}

      </DialogActions>
    </Dialog>
  );
}
