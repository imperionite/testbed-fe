import { useRef, useState } from 'react'
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

import EvaluationForm from './EvaluationForm'
import { MODES } from '../form/evaluationConfig'
import ActionConfirmDialog from '../../shared/components/ActionConfirmDialog'

function getServerMessage(error) {
  return error?.response?.data?.message ?? error?.message ?? 'Unable to save the evaluation.'
}

export default function EvaluationModal({
  open,
  onClose,
  mode,
  role,
  evaluation,
  internshipOptions,
  onCreate,
  onUpdate,
  onSubmitEvaluation,
  onSuccess,
}) {
  const submitIntent = useRef('draft')
  const [pendingFormData, setPendingFormData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const isView = mode === MODES.VIEW
  const isCreate = mode === MODES.CREATE
  const isEdit = mode === MODES.EDIT
  const isDraft = evaluation?.status === 'draft'

  const requestDraftSave = () => {
    submitIntent.current = 'draft'
    document.getElementById('evaluation-form')?.requestSubmit()
  }

  const requestSubmit = () => {
    submitIntent.current = 'submit'
    document.getElementById('evaluation-form')?.requestSubmit()
  }

  const saveDraft = async (data) => {
    if (isCreate) {
      await onCreate({
        internship_id: data.internship_id,
        evaluation_type: data.evaluation_type,
        responses: data.responses,
        comments: data.comments || null,
      })
    } else if (isEdit) {
      await onUpdate({
        id: evaluation.id,
        payload: {
          responses: data.responses,
          comments: data.comments || null,
        },
      })
    }

    onSuccess?.('Evaluation saved as draft.')
    onClose()
  }

  const submitEvaluation = async (data) => {
    if (isCreate) {
      const created = await onCreate({
        internship_id: data.internship_id,
        evaluation_type: data.evaluation_type,
        responses: data.responses,
        comments: data.comments || null,
      })

      await onSubmitEvaluation({ id: created.id })
    } else if (isEdit) {
      await onUpdate({
        id: evaluation.id,
        payload: {
          responses: data.responses,
          comments: data.comments || null,
        },
      })

      await onSubmitEvaluation({ id: evaluation.id })
    }

    onSuccess?.('Evaluation submitted successfully.')
    onClose()
  }

  const handleFormSubmit = async (data) => {
    setError(null)

    if (submitIntent.current === 'submit') {
      setPendingFormData(data)
      return
    }

    try {
      await saveDraft(data)
    } catch (err) {
      setError(getServerMessage(err))
    } finally {
      submitIntent.current = 'draft'
    }
  }

  const confirmSubmit = async () => {
    if (!pendingFormData) return

    setIsSubmitting(true)
    setError(null)

    try {
      await submitEvaluation(pendingFormData)
      setPendingFormData(null)
    } catch (err) {
      setError(getServerMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const cancelSubmit = () => {
    setPendingFormData(null)
    submitIntent.current = 'draft'
  }

  return (
    <>
      <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isView ? 'View Evaluation' : isCreate ? 'New Evaluation' : 'Edit Evaluation'}
        </DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <EvaluationForm
            role={role}
            mode={mode}
            evaluation={evaluation}
            internshipOptions={internshipOptions}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>

        <DialogActions>
          {isView && <Button onClick={onClose}>Close</Button>}

          {isEdit && isDraft && (
            <>
              <Button onClick={onClose}>Cancel</Button>
              <Button variant="outlined" onClick={requestDraftSave}>
                Save Draft
              </Button>
              <Button variant="contained" onClick={requestSubmit} disabled={isSubmitting}>
                Submit
              </Button>
            </>
          )}

          {isCreate && (
            <>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button variant="outlined" onClick={requestDraftSave} disabled={isSubmitting}>
                Save Draft
              </Button>
              <Button
                variant="contained"
                onClick={requestSubmit}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={18} /> : null}
              >
                Submit
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <ActionConfirmDialog
        open={Boolean(pendingFormData)}
        title="Submit Evaluation"
        message="Once submitted, this evaluation can no longer be edited. Continue?"
        confirmLabel="Submit"
        cancelLabel="Cancel"
        isLoading={isSubmitting}
        onConfirm={confirmSubmit}
        onCancel={cancelSubmit}
      />
    </>
  )
}
