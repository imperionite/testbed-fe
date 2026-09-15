import api from './axios'
import { endpoints } from '../config'

export const documentsApi = {
  async listByInternship(internshipId) {
    const response = await api.get(endpoints.documents.listByInternship(internshipId))
    return response.data.data
  },

  async upload(internshipId, documentType, file) {
    const formData = new FormData()
    formData.append('internship_id', internshipId)
    formData.append('document_type', documentType)
    formData.append('file', file)

    const response = await api.post(endpoints.documents.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },

  async getDocumentDetails(documentId) {
    const response = await api.get(endpoints.documents.details(documentId))
    return response.data.data
  },

  async approveDocument(documentId) {
    const response = await api.patch(endpoints.documents.approve(documentId))
    return response.data.data
  },

  async rejectDocument(documentId, reason) {
    const response = await api.patch(endpoints.documents.reject(documentId), { reason })
    return response.data.data
  },

  async deleteDocument(documentId) {
    const response = await api.delete(endpoints.documents.delete(documentId))
    return response.data.data
  },
}
