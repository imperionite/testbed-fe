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

export default function CoordinatorDocumentsView({ internshipId }) {
  const { data: documents = [], isLoading, error } = useDocuments(internshipId)
  const { approveDocument, rejectDocument } = useDocumentMutations(internshipId)

  const [rejectDialog, setRejectDialog] = useState({ open: false, documentId: null })
  const [rejectionReason, setRejectionReason] = useState('')

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

  if (isLoading) return <CircularProgress />
  if (error) return <Alert severity="error">Failed to load documents.</Alert>

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Internship Documents
      </Typography>
      <Stack spacing={1}>
        {documents.length === 0 && <Typography>No documents found.</Typography>}
        {documents.map((doc) => (
          <DocumentItem
            key={doc.id}
            document={doc}
            onApprove={handleApprove}
            onReject={handleRejectInitiate}
          />
        ))}
      </Stack>

      <Dialog
        open={rejectDialog.open}
        onClose={() => setRejectDialog({ open: false, documentId: null })}
      >
        <DialogTitle>Reject Document</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Reason for rejection"
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, documentId: null })}>Cancel</Button>
          <Button
            onClick={handleRejectConfirm}
            variant="contained"
            color="error"
            disabled={!rejectionReason}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
