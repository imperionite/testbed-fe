import { Box, Typography, Stack, CircularProgress, Alert } from '@mui/material'
import { useDocuments } from '../hooks/useDocuments'
import { useDocumentMutations } from '../hooks/useDocumentMutations'
import DocumentUploader from './DocumentUploader'
import DocumentItem from './DocumentItem'

export default function StudentDocumentsView({ internshipId }) {
  const { data: documents = [], isLoading, error, refetch } = useDocuments(internshipId)
  const { deleteDocument } = useDocumentMutations(internshipId)

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      await deleteDocument.mutateAsync(documentId)
    }
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
          <DocumentItem key={doc.id} document={doc} onDelete={handleDelete} />
        ))}
      </Stack>
    </Box>
  )
}
