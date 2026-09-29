import { useState } from 'react'
import { Box, Typography, Stack, CircularProgress, Alert } from '@mui/material'
import { useDocuments } from '../hooks/useDocuments'
import { useDocumentMutations } from '../hooks/useDocumentMutations'
import DocumentUploader from './DocumentUploader'
import DocumentItem from './DocumentItem'
import ActionConfirmDialog from '../../shared/components/ActionConfirmDialog'

export default function StudentDocumentsView({ internshipId }) {
  const { data: documents = [], isLoading, error, refetch } = useDocuments(internshipId)
  const { deleteDocument } = useDocumentMutations(internshipId)

  const [deleteDialog, setDeleteDialog] = useState({ open: false, documentId: null })

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
      <DocumentUploader internshipId={internshipId} onUploadSuccess={refetch} />

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        My Documents
      </Typography>
      <Stack spacing={1}>
        {documents.length === 0 && <Typography>No documents submitted yet.</Typography>}
        {documents.map((doc) => (
          <DocumentItem key={doc.id} document={doc} onDelete={handleDeleteInitiate} />
        ))}
      </Stack>

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
