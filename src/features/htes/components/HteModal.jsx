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
import HteForm from "./HteForm";
import { MODES } from "../form/formConfig";

export default function HteModal({
  open,
  onClose,
  disablePortal = false,
  mode: initialMode = MODES.VIEW,
  hte = null,
  permissions,
  viewerRole,
  supervisorOptions = [],
  onSuccess,
  onCreate,
  onUpdate,
  onSupervisorChange,
  onStatusChange,
}) {
  const [mode, setMode] = useState(initialMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const defaultValues = hte
    ? {
        ...hte,
        company_name: hte.company_name ?? "",
        address: hte.address ?? "",
        contact_person: hte.contact_person ?? "",
        contact_email: hte.contact_email ?? "",
        contact_number: hte.contact_number ?? "",
        supervisor_id: hte.supervisor_id ?? null,
        is_active: hte.is_active ?? true,
      }
    : {};

  const currentIsActive = hte?.is_active;
  const currentSupervisorId = hte?.supervisor_id ?? null;

  const canEdit = permissions?.canEdit;
  const canCreate = permissions?.canCreate;

  const handleEditBtnPressed = () => setMode(MODES.EDIT);

  const handleCancelBtnPressed = () => {
    setError(null);
    setMode(MODES.VIEW);
  };

  const handleSubmitButtonPressed = () => {
    setIsSaving(true);
    document.getElementById("hte-form")?.requestSubmit();
  };

  const handleSubmit = async (data) => {
    setError(null);
    try {
      if (mode === MODES.CREATE) {
        await onCreate?.({
          companyName: data.company_name,
          address: data.address,
          contactPerson: data.contact_person,
          contactEmail: data.contact_email || null,
          contactNumber: data.contact_number || null,
          supervisorId: data.supervisor_id || null,
        });
        onSuccess?.("HTE created successfully!");
      } else {
        await onUpdate?.({
          id: hte.id,
          payload: {
            companyName: data.company_name,
            address: data.address,
            contactPerson: data.contact_person,
            contactEmail: data.contact_email || null,
            contactNumber: data.contact_number || null,
          },
        });

        const newSupervisorId = data.supervisor_id || null;
        if (newSupervisorId !== currentSupervisorId) {
          await onSupervisorChange?.({ id: hte.id, supervisorId: newSupervisorId });
        }

        if (data.is_active !== undefined && data.is_active !== currentIsActive) {
          await onStatusChange?.({ id: hte.id, isActive: data.is_active });
        }

        onSuccess?.("HTE updated successfully!");
      }

      setIsSaving(false);
      onClose();
    } catch (submitError) {
      setIsSaving(false);
      setError(submitError.response?.data?.message || "Unable to save HTE.");
    }
  };

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
          ? "View HTE"
          : mode === MODES.EDIT
            ? "Edit HTE"
            : "Create HTE"}

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
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
        <HteForm
          key={mode}
          role={viewerRole}
          mode={mode}
          defaultValues={defaultValues}
          supervisorOptions={supervisorOptions}
          onSubmit={handleSubmit}
          onInvalid={() => setIsSaving(false)}
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
              <Button
                onClick={handleSubmitButtonPressed}
                variant="contained"
                disabled={isSaving}
                startIcon={isSaving ? <CircularProgress size={20} /> : null}
              >
                Submit
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
