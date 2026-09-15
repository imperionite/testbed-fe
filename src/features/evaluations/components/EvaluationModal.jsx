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
import EvaluationForm from "./EvaluationForm";
import { MODES } from "../form/formConfig";

export default function EvaluationModal({
  open,
  onClose,
  disablePortal = false,
  mode: initialMode = MODES.VIEW,
  evaluation = null,
  permissions,
  viewerRole,
  evaluationTypeOptions = ["hte_supervisor"],
  internOptions = [],
  criteriaList = [],
  allowDynamicCriteria = true,
  onSuccess,
  onCreate,
  onUpdate,
}) {
  const [mode, setMode] = useState(initialMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Determine if evaluation is in draft state
  const isDraft = evaluation?.status === "Draft";
  const isSubmitted = evaluation?.status === "Submitted";

  const defaultValues = evaluation
    ? {
        internship_id: evaluation.internship_id ?? "",
        evaluation_type: evaluation.evaluation_type ?? "hte_supervisor",
        responses: evaluation.responses ?? {},
        comments: evaluation.comments ?? "",
        status: evaluation.status ?? "Draft",
      }
    : {
        internship_id: "",
        evaluation_type: "hte_supervisor",
        responses: {},
        comments: "",
        status: "Draft",
      };

  const canEdit = permissions?.canEdit && isDraft; // Can only edit if draft
  const canCreate = permissions?.canCreate;

  const handleEditBtnPressed = () => setMode(MODES.EDIT);

  const handleCancelBtnPressed = () => {
    setError(null);
    setMode(MODES.VIEW);
  };

  const handleSubmitButtonPressed = () => {
    setIsSaving(true);
    document.getElementById("evaluation-form")?.requestSubmit();
  };

  const handleSubmit = async (data) => {
            console.log("Submitted evaluation:", data);
    setError(null);
    try {
      if (mode === MODES.CREATE) {
        // Creating new evaluation (defaults to Draft)
        await onCreate?.({
          internship_id: data.internship_id,
          evaluation_type: data.evaluation_type,
          responses: data.responses || {},
          comments: data.comments || "",
          status: "Draft",
        });
        onSuccess?.("Evaluation created successfully!");
      } else if (mode === MODES.EDIT) {
        // Editing draft evaluation
        await onUpdate?.({
          id: evaluation.id,
          payload: {
            responses: data.responses || {},
            comments: data.comments || "",
            status: data.status || "Draft", // Keep or update status
          },
        });
        onSuccess?.("Evaluation updated successfully!");
      }

      setIsSaving(false);
      onClose();
    } catch (submitError) {
      setIsSaving(false);
      setError(
        submitError.response?.data?.message || "Unable to save Evaluation."
      );
    }
  };

  const handleInvalid = () => {
    setIsSaving(false);
  };

  const getDialogTitle = () => {
    if (mode === MODES.VIEW) return "View Evaluation";
    if (mode === MODES.EDIT) return "Edit Evaluation";
    return "Create Evaluation";
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
        {getDialogTitle()}
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
        <EvaluationForm
          key={mode}
          role={viewerRole}
          mode={mode}
          defaultValues={defaultValues}
          evaluationTypeOptions={evaluationTypeOptions}
          internOptions={internOptions}
          criteriaList={criteriaList}
          allowDynamicCriteria={allowDynamicCriteria}
          onSubmit={handleSubmit}
          onInvalid={handleInvalid}
          formId="evaluation-form"
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
            {isSubmitted && (
              <span style={{ fontSize: "0.875rem", color: "#666" }}>
                Submitted (Read-only)
              </span>
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
              <>
                <Button
                  onClick={handleSubmitButtonPressed}
                  variant="outlined"
                  disabled={isSaving}
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSubmitButtonPressed}
                  variant="contained"
                  disabled={isSaving}
                  startIcon={isSaving ? <CircularProgress size={20} /> : null}
                >
                  Submit
                </Button>
              </>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
