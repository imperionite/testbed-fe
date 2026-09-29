import { useRef, useState } from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

import EvaluationForm from './EvaluationForm'
import { MODES } from '../form/evaluationConfig'
import ActionConfirmDialog from '../../shared/components/ActionConfirmDialog'
import { EVALUATION_STATUSES } from '../../../shared/constants/constants'
import notify from '../../../utils/toast'

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
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isPreparingSubmit, setIsPreparingSubmit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isBusy = isSavingDraft || isPreparingSubmit || isSubmitting

  const isView = mode === MODES.VIEW
  const isCreate = mode === MODES.CREATE
  const isEdit = mode === MODES.EDIT

  const requestDraftSave = () => {
    if (isBusy) return
    submitIntent.current = EVALUATION_STATUSES.DRAFT
    setIsSavingDraft(true)
    document.getElementById('evaluation-form')?.requestSubmit()
  }

  const requestSubmit = () => {
    if (isBusy) return
    submitIntent.current = 'submit'
    setIsPreparingSubmit(true)
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
    if (submitIntent.current === 'submit') {
      setPendingFormData(data)
      setIsPreparingSubmit(false)
      return
    }

    try {
      await saveDraft(data)
    } catch (err) {
      notify.error(getServerMessage(err))
    } finally {
      setIsSavingDraft(false)
      submitIntent.current = EVALUATION_STATUSES.DRAFT
    }
  }

  const handleFormInvalid = () => {
    setIsSavingDraft(false)
    setIsPreparingSubmit(false)
    submitIntent.current = EVALUATION_STATUSES.DRAFT
    notify.error('Please correct the highlighted fields before continuing.')
  }

  const confirmSubmit = async () => {
    if (!pendingFormData) return

    setIsSubmitting(true)

    try {
      await submitEvaluation(pendingFormData)
      setPendingFormData(null)
    } catch (err) {
      notify.error(getServerMessage(err))
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
      <Dialog open={open} onClose={isBusy ? undefined : onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isView ? 'View Evaluation' : isCreate ? 'New Evaluation' : 'Edit Evaluation'}
        </DialogTitle>

        <DialogContent dividers>
          <EvaluationForm
            id="evaluation-form"
            mode={mode}
            role={role}
            evaluation={evaluation}
            internshipOptions={internshipOptions}
            onSubmit={handleFormSubmit}
            onInvalid={handleFormInvalid}
          />
        </DialogContent>

        {isView && (
          <DialogActions
            sx={{
              justifyContent: 'space-between',
              px: 3,
              py: 2,
            }}
          >
            <Typography variant="body2">Submitted (view only)</Typography>
            <Button onClick={onClose} color="inherit">
              Close
            </Button>
          </DialogActions>
        )}

        {!isView && (
          <DialogActions>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={requestDraftSave}
              disabled={isBusy}
              startIcon={
                isSavingDraft ? <CircularProgress size={16} color="inherit" /> : undefined
              }
            >
              Save as Draft
            </Button>
            <Button
              onClick={requestSubmit}
              variant="contained"
              disabled={isBusy}
              startIcon={
                isPreparingSubmit ? <CircularProgress size={16} color="inherit" /> : undefined
              }
            >
              Submit
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <ActionConfirmDialog
        open={Boolean(pendingFormData)}
        title="Submit Evaluation"
        message="Are you sure you want to submit this evaluation? This action is permanent."
        onConfirm={confirmSubmit}
        onCancel={cancelSubmit}
        isLoading={isSubmitting}
      />
    </>
  )
}
