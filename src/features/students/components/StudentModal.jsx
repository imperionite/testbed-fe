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
import StudentForm from "./StudentForm";
import { MODES } from "../form/formConfig";
import useAuth from "../../../hooks/useAuth";

export default function StudentModal({
  open,
  onClose,
  disablePortal = false,
  mode: initialMode = MODES.VIEW,
  student = null,
  permissions,
  onSuccess,
  onCreate,
  onUpdate,
  isStudent,
  availableUsers,
}) {
  const [mode, setMode] = useState(initialMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleEditBtnPressed = () => setMode(MODES.EDIT);
  const handleCancelBtnPressed = () => {
    setError(null);
    setMode(MODES.VIEW);
  };

  const getTitle = () => {
    if (mode === MODES.CREATE) return "Add New Student";
    if (mode === MODES.EDIT) return "Edit Student";
    return "View Student Details";
  };

  const handleSubmit = async (data) => {
    setError(null);
    try {
      if (mode === MODES.CREATE) {
        await onCreate?.(data);
        onSuccess?.("Student created successfully!");
      } else if (mode === MODES.EDIT) {
        const studentId = student?.id;
        if (!studentId) {
          throw new Error("No student record selected for update.");
        }
        
        const payload = { ...data };
        delete payload.userId;
        await onUpdate?.({ id: studentId, payload, role: user?.role });
        onSuccess?.("Student updated successfully!");
      }
      setIsSaving(false);
      onClose();
    } catch (submitError) {
      setIsSaving(false);
      console.error("Full Submit Error:", submitError);
      setError(submitError.response?.data?.message || submitError.message || "Unable to save student.");
    }
  };

  const canEdit = permissions?.canUpdate;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disablePortal={disablePortal}
    >
      <DialogTitle>
        {getTitle()}

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
        <StudentForm
          key={mode}
          mode={mode}
          isStudent={isStudent}
          defaultValues={student || {}}
          onSubmit={handleSubmit}
          onInvalid={() => setIsSaving(false)}
          availableUsers={availableUsers}
        />
      </DialogContent>

      <DialogActions>
        {mode === MODES.VIEW && canEdit && (
          <Button onClick={handleEditBtnPressed} variant="contained">
            Edit
          </Button>
        )}

        {mode !== MODES.VIEW && (
          <>
            <Button onClick={mode === MODES.CREATE ? onClose : handleCancelBtnPressed} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="student-form"
              color="success"
              variant="contained"
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={20} /> : null}
            >
              {mode === MODES.CREATE ? "Submit" : "Save"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
