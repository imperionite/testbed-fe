import api from './axios'
import { endpoints } from '../config'

export const normalizeHte = (hte) => {
  return {
    ...hte,
    companyName: hte.companyName ?? hte.company_name,
    contactPerson: hte.contactPerson ?? hte.contact_person,
    contactEmail: hte.contactEmail ?? hte.contact_email,
    contactNumber: hte.contactNumber ?? hte.contact_number,
    supervisorId: hte.supervisorId ?? hte.supervisor_id,
    isActive: hte.isActive ?? hte.is_active,
    createdAt: hte.createdAt ?? hte.created_at,
    updatedAt: hte.updatedAt ?? hte.updated_at,
  }
}

export const htesApi = {
  async listHtes() {
    const response = await api.get(endpoints.htes.list)
    const records = response.data?.data ?? response.data
    const hteRecords = Array.isArray(records)
      ? records
      : (records?.htes ?? records?.items ?? (records?.id ? [records] : []))

    return hteRecords.map(normalizeHte)
  },

  async getHte(id) {
    const response = await api.get(endpoints.htes.details(id))
    return normalizeHte(response.data.data)
  },

  async createHte(payload) {
    const response = await api.post(endpoints.htes.list, payload)
    return normalizeHte(response.data.data)
  },

  async updateHte(id, payload) {
    const response = await api.patch(endpoints.htes.details(id), payload)
    return normalizeHte(response.data.data)
  },

  async updateStatus(id, payload) {
    const response = await api.patch(endpoints.htes.status(id), {
      isActive: payload.isActive === true,
    })
    return normalizeHte(response.data.data)
  },
  async updateHteSupervisor(id, payload) {
    const response = await api.patch(endpoints.htes.supervisor(id), payload)
    return normalizeHte(response.data.data)
  },
}
