import { useRef, useState, useMemo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EvaluationForm from './EvaluationForm'
import { MODES } from '../form/formConfig'
import { ROLES } from '../../shared/constants/constants'
import ActionConfirmDialog from '../../shared/components/ActionConfirmDialog'

const EVALUATION_TYPES = {
  [ROLES.HTE_SUPERVISOR]: 'hte_supervisor',
  [ROLES.FACULTY_ADVISER]: 'faculty_adviser',
}

export default function EvaluationModal({
  open,
  onClose,
  disablePortal = false,
  mode: initialMode = MODES.VIEW,
  evaluation = null,
  permissions,
  viewerRole,
  evaluationTypeOptions = ['hte_supervisor', 'faculty_adviser'],
  internOptions = [],
  internMap = {},
  criteriaList = [],
  allowDynamicCriteria = true,
  onSuccess,
  onCreate,
  onUpdate,
  onSubmitEvaluation,
}) {
  const [mode, setMode] = useState(initialMode)
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [pendingFormData, setPendingFormData] = useState(null)
  const [error, setError] = useState(null)
  const requestedStatus = useRef('Draft')

  // Determine if evaluation is in draft state
  const normalizedStatus = evaluation?.status?.toLowerCase()
  const isSubmitted = normalizedStatus === 'submitted'
  const canEdit = permissions?.canEdit && !isSubmitted
  const canCreate = permissions?.canCreate

  const defaultValues = useMemo(() => {
    return evaluation
      ? {
          id: evaluation.id ?? '',
          internship_id: evaluation.internship_id ?? '',
          evaluator_id: evaluation.evaluator_id ?? '',
          evaluation_type: evaluation.evaluation_type ?? EVALUATION_TYPES[viewerRole] ?? null,
          responses: evaluation.responses ?? {},
          comments: evaluation.comments ?? '',
          created_at: evaluation.created_at ?? '',
          updated_at: evaluation.updated_at ?? '–',
          status: evaluation.status ?? 'Draft',
          submitted_at: evaluation.submitted_at ?? '–',
        }
      : {
          id: '',
          internship_id: '',
          evaluator_id: '',
          evaluation_type: EVALUATION_TYPES[viewerRole] ?? null,
          responses: {},
          comments: '',
          created_at: '',
          updated_at: '–',
          status: 'Draft',
          submitted_at: '–',
        }
  }, [evaluation, viewerRole])

  const handleEditBtnPressed = () => setMode(MODES.EDIT)

  // const handleCancelBtnPressed = () => {
  //   setError(null);
  //   setMode(MODES.VIEW);
  // };

  const handleSubmitButtonPressed = (status = 'Draft') => {
    requestedStatus.current = status
    setIsSaving(true)
    document.getElementById('evaluation-form')?.requestSubmit()
  }

  const handleSubmit = async (data) => {
    setError(null)
    try {
      if (mode === MODES.CREATE) {
        // Create Mode: Always calls onCreate (createEvaluation) as Draft
        await onCreate?.({
          internship_id: data.internship_id,
          evaluation_type: data.evaluation_type,
          responses: data.responses || {},
          comments: data.comments || '',
          status: 'Draft',
        })
        onSuccess?.('Evaluation created successfully!')
      } else if (mode === MODES.EDIT) {
        if (requestedStatus.current === 'Submitted') {
          // Edit Mode (Submit): First saves form updates, then calls submitEvaluation
          setPendingFormData(data)
          setIsConfirmOpen(true)
        } else {
          // Save as Draft
          setIsSaving(true)
          await onUpdate?.({
            id: evaluation.id,
            payload: {
              responses: data.responses || {},
              comments: data.comments || '',
              status: 'Draft',
            },
          })
          onSuccess?.('Evaluation updated successfully!')
          setIsSaving(false)
          onClose()
        }
      }
    } catch (submitError) {
      setIsSaving(false)
      setError(submitError.response?.data?.message || 'Unable to save Evaluation.')
    }
  }

  const handleConfirmSubmit = async () => {
    if (!pendingFormData) return
    setIsSubmitting(true)
    setError(null)

    try {
      await onUpdate?.({
        id: evaluation.id,
        payload: {
          responses: pendingFormData.responses || {},
          comments: pendingFormData.comments || '',
          status: 'Draft',
        },
      })

      await onSubmitEvaluation?.({ id: evaluation.id })

      onSuccess?.('Evaluation submitted successfully!')
      setIsSubmitting(false)
      setIsConfirmOpen(false)
      onClose()
    } catch (submitError) {
      setIsSubmitting(false)
      setIsConfirmOpen(false)
      setError(submitError.response?.data?.message || 'Unable to submit Evaluation.')
    }
  }

  const handleCancelSubmit = () => {
    setIsConfirmOpen(false)
    setPendingFormData(null)
  }

  const handleInvalid = () => {
    setIsSaving(false)
  }

  const getDialogTitle = () => {
    if (mode === MODES.VIEW) return 'View Evaluation'
    if (mode === MODES.EDIT) return 'Edit Evaluation'
    return 'Create Evaluation'
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disablePortal={disablePortal}>
      <DialogTitle>
        {getDialogTitle()}
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
        <EvaluationForm
          key={mode}
          role={viewerRole}
          mode={mode}
          defaultValues={defaultValues}
          evaluationTypeOptions={evaluationTypeOptions}
          internOptions={internOptions}
          internMap={internMap}
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
              <span style={{ fontSize: '0.875rem', color: '#666' }}>Submitted (Read-only)</span>
            )}
          </>
        )}

        {mode === MODES.EDIT && (
          <>
            <Button
              onClick={() => handleSubmitButtonPressed('Draft')}
              variant="outlined"
              disabled={isSaving}
            >
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSubmitButtonPressed('Submitted')}
              color="primary"
              variant="contained"
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={20} /> : null}
            >
              Submit
            </Button>
          </>
        )}

        {mode === MODES.CREATE && canCreate && (
          <Button
            onClick={() => handleSubmitButtonPressed('Draft')}
            color="primary"
            variant="contained"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} /> : null}
          >
            Save as Draft
          </Button>
        )}
      </DialogActions>

      <ActionConfirmDialog
        open={isConfirmOpen}
        title="Submit Evaluation"
        message="Are you sure you want to submit this evaluation? Once submitted, it will be finalized and can no longer be edited."
        confirmLabel="Submit"
        cancelLabel="Cancel"
        isLoading={isSubmitting}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
      />
    </Dialog>
  )
}
