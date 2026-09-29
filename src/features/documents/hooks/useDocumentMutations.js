import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentsApi } from '../../../api/documents'
import notify from '../../../utils/toast'

export function useDocumentMutations(internshipId) {
  const queryClient = useQueryClient()
  const invalidateDocuments = () =>
    queryClient.invalidateQueries({ queryKey: ['documents', internshipId] })

  const uploadDocument = useMutation({
    mutationFn: ({ documentType, file }) => documentsApi.upload(internshipId, documentType, file),
    onSuccess: () => {
      invalidateDocuments()
      notify.success('Document uploaded successfully!')
    },
  })

  const approveDocument = useMutation({
    mutationFn: (documentId) => documentsApi.approveDocument(documentId),
    onSuccess: () => {
      invalidateDocuments()
      notify.success('Document approved successfully!')
    },
  })

  const rejectDocument = useMutation({
    mutationFn: ({ documentId, reason }) => documentsApi.rejectDocument(documentId, reason),
    onSuccess: () => {
      invalidateDocuments()
      notify.success('Document rejected.')
    },
  })

  const deleteDocument = useMutation({
    mutationFn: (documentId) => documentsApi.deleteDocument(documentId),
    onSuccess: () => {
      invalidateDocuments()
      notify.success('Document deleted successfully!')
    },
  })

  return {
    uploadDocument,
    approveDocument,
    rejectDocument,
    deleteDocument,
  }
}
