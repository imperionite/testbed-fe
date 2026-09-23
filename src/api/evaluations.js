import api from './axios'

export const evaluationsApi = {
  listMyEvaluations: async () => {
    const response = await api.get('/evaluations/me')
    return response.data?.data ?? []
  },

  listInternEvaluations: async (internshipId) => {
    const response = await api.get(`/evaluations/internship/${internshipId}`)

    return response.data?.data ?? []
  },

  getEvaluation: async (id) => {
    const response = await api.get(`/evaluations/${id}`)
    return response.data?.data
  },

  createEvaluation: async (payload) => {
    const response = await api.post('/evaluations', payload)

    return response.data?.data
  },

  updateEvaluation: async (id, payload) => {
    const response = await api.patch(`/evaluations/${id}`, payload)

    return response.data?.data
  },

  submitEvaluation: async (id) => {
    const response = await api.post(`/evaluations/${id}/submit`)

    return response.data?.data
  },
}
