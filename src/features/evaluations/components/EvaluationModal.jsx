import { useRef, useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

import EvaluationForm from './EvaluationForm'
import { MODES } from '../form/evaluationConfig'
import ActionConfirmDialog from '../../shared/components/ActionConfirmDialog'
import { EVALUATION_STATUSES } from '../../../shared/constants/constants'

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
  const submitIntent = useRef(EVALUATION_STATUSES.DRAFT)
  const [pendingFormData, setPendingFormData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const isView = mode === MODES.VIEW
  const isCreate = mode === MODES.CREATE
  const isEdit = mode === MODES.EDIT

  const requestDraftSave = () => {
    submitIntent.current = EVALUATION_STATUSES.DRAFT
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
      submitIntent.current = EVALUATION_STATUSES.DRAFT
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
    submitIntent.current = EVALUATION_STATUSES.DRAFT
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
            id="evaluation-form"
            mode={mode}
            role={role}
            evaluation={evaluation}
            internshipOptions={internshipOptions}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>

        {!isView && (
          <DialogActions>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button onClick={requestDraftSave} disabled={isSubmitting}>
              Save as Draft
            </Button>
            <Button onClick={requestSubmit} variant="contained" disabled={isSubmitting}>
              Submit
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <ActionConfirmDialog
        open={Boolean(pendingFormData)}
        title="Submit Evaluation"
        description="Are you sure you want to submit this evaluation? This action is permanent."
        onConfirm={confirmSubmit}
        onCancel={cancelSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  )
}
