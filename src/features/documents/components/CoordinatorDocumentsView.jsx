import { useState } from 'react'
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import { useDocuments } from '../hooks/useDocuments'
import { useDocumentMutations } from '../hooks/useDocumentMutations'
import DocumentItem from './DocumentItem'
import DocumentUploader from './DocumentUploader'
import PageTitleAndSubtitle from '../../shared/components/PageTitleAndSubtitle'
import { useUiPermissions } from '../../shared/hooks/useUiPermissions'
import ActionConfirmDialog from '../../shared/components/ActionConfirmDialog'

export default function CoordinatorDocumentsView({ internshipId }) {
  const { data: documents = [], isLoading, error, refetch } = useDocuments(internshipId)
  const { approveDocument, rejectDocument, deleteDocument } = useDocumentMutations(internshipId)
  const { isCoordinator, isAdmin, isFacultyAdviser, isHteSupervisor } = useUiPermissions()

  const canDelete = isAdmin || isCoordinator
  const canUpload = isCoordinator || isFacultyAdviser || isHteSupervisor

  const [rejectDialog, setRejectDialog] = useState({ open: false, documentId: null })
  const [rejectionReason, setRejectionReason] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({ open: false, documentId: null })

  const handleApprove = async (documentId) => {
    await approveDocument.mutateAsync(documentId)
  }

  const handleRejectInitiate = (documentId) => {
    setRejectDialog({ open: true, documentId })
  }

  const handleRejectConfirm = async () => {
    if (!rejectionReason) return
    await rejectDocument.mutateAsync({
      documentId: rejectDialog.documentId,
      reason: rejectionReason,
    })
    setRejectDialog({ open: false, documentId: null })
    setRejectionReason('')
  }

  const handleDeleteInitiate = (documentId) => {
    setDeleteDialog({ open: true, documentId })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.documentId) return
    await deleteDocument.mutateAsync(deleteDialog.documentId)
    setDeleteDialog({ open: false, documentId: null })
  }

  if (isLoading) return <CircularProgress />
  if (error) return <Alert severity="error">Failed to load documents.</Alert>

  return (
    <Box>
      <PageTitleAndSubtitle title="Documents List" />

      {canUpload && (
        <Box sx={{ mb: 3 }}>
          <DocumentUploader internshipId={internshipId} onUploadSuccess={refetch} />
        </Box>
      )}

      <Stack spacing={1}>
        {documents.length === 0 && <Typography>No documents found.</Typography>}

        {documents.map((doc) => (
          <DocumentItem
            key={doc.id}
            document={doc}
            onApprove={isCoordinator ? handleApprove : undefined}
            onReject={isCoordinator ? handleRejectInitiate : undefined}
            onDelete={canDelete ? handleDeleteInitiate : undefined}
          />
        ))}
      </Stack>

      {isCoordinator && (
        <Dialog
          open={rejectDialog.open}
          onClose={() =>
            setRejectDialog({
              open: false,
              documentId: null,
            })
          }
        >
          <DialogTitle>Reject Document</DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Reason for rejection"
              multiline
              rows={3}
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() =>
                setRejectDialog({
                  open: false,
                  documentId: null,
                })
              }
              disabled={rejectDocument.isPending}
            >
              Cancel
            </Button>

            <Button
              onClick={handleRejectConfirm}
              variant="contained"
              color="error"
              disabled={!rejectionReason.trim() || rejectDocument.isPending}
              startIcon={
                rejectDocument.isPending ? <CircularProgress size={16} color="inherit" /> : null
              }
            >
              {rejectDocument.isPending ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <ActionConfirmDialog
        open={deleteDialog.open}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="error"
        isLoading={deleteDocument.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ open: false, documentId: null })}
      />
    </Box>
  )
}
