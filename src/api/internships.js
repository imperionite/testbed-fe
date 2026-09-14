import api from './axios'
import { endpoints } from '../config'

export const internshipsApi = {
  async listInternships() {
    const response = await api.get(endpoints.internships.list)
    return response.data.data
  },

  async getInternship(id) {
    const response = await api.get(endpoints.internships.details(id))
    return response.data.data
  },

  async createInternship(payload) {
    const response = await api.post(endpoints.internships.list, payload)
    return response.data.data
  },

  async updateInternshipStatus(id, status) {
    const response = await api.patch(endpoints.internships.status(id), { status: status })
    return response.data.data
  },

  async updateInternship(id, payload) {
    const response = await api.patch(endpoints.internships.details(id), payload)
    return response.data.data
  },

  async assignFacultyAdviser(id, facultyAdviserId) {
    const response = await api.patch(endpoints.internships.adviser(id), {
      facultyAdviserId: facultyAdviserId,
    })
    return response.data.data
  },

  async getOwnInternship() {
    const response = await api.get(endpoints.internships.me)
    return response.data.data
  },
}
