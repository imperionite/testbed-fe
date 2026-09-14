import { useMutation, useQueryClient } from "@tanstack/react-query";
import { documentsApi } from "../../../api/documents";

export function useDocumentMutations(internshipId) {
  const queryClient = useQueryClient();
  const invalidateDocuments = () =>
    queryClient.invalidateQueries({ queryKey: ["documents", internshipId] });

  const uploadDocument = useMutation({
    mutationFn: ({ documentType, file }) =>
      documentsApi.upload(internshipId, documentType, file),
    onSuccess: invalidateDocuments,
  });

  const approveDocument = useMutation({
    mutationFn: (documentId) => documentsApi.approveDocument(documentId),
    onSuccess: invalidateDocuments,
  });

  const rejectDocument = useMutation({
    mutationFn: ({ documentId, reason }) =>
      documentsApi.rejectDocument(documentId, reason),
    onSuccess: invalidateDocuments,
  });

  const deleteDocument = useMutation({
    mutationFn: (documentId) => documentsApi.deleteDocument(documentId),
    onSuccess: invalidateDocuments,
  });

  return {
    uploadDocument,
    approveDocument,
    rejectDocument,
    deleteDocument,
  };
}
