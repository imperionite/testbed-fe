import api from './axios'
import { endpoints } from '../config'

export const evaluationsApi = {
  async listMyEvaluations() {
    const response = await api.get(endpoints.evaluations.my_list)
    return response.data.data
  },

  async listInternEvaluations(id) {
    const response = await api.get(endpoints.evaluations.by_intern(id))
    return response.data.data
  },

  async getEvaluation(id) {
    const response = await api.get(endpoints.evaluations.details(id))
    return response.data.data
  },

  async createEvaluation(payload) {
    const response = await api.post(endpoints.evaluations.create, payload)
    return response.data.data
  },

  async updateEvaluation(id, payload) {
    const response = await api.patch(endpoints.evaluations.details(id), payload)
    return response.data.data
  },

  async submitEvaluation(id) {
    const response = await api.post(endpoints.evaluations.submit(id))
    return response.data.data
  },
}
