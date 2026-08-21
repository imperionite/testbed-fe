import api from "./axios";
import { endpoints } from "../config";

export const hteApi = {
  async listHtes() {
    const response = await api.get(endpoints.htes.root);
    return response.data.data;
  },

  async getHte(id) {
    const response = await api.get(`${endpoints.htes.root}/${id}`);
    return response.data.data;
  },

  async createHte(data) {
    const response = await api.post(endpoints.htes.root, data);
    return response.data.data;
  },

  async updateHte(id, data) {
    const response = await api.patch(`${endpoints.htes.root}/${id}`, data);
    return response.data.data;
  },

  async updateStatus(id, status) {
    const response = await api.patch(`${endpoints.htes.root}/${id}/status`, { status });
    return response.data.data;
  },

  async assignSupervisor(id, supervisorId) {
    const response = await api.patch(`${endpoints.htes.root}/${id}/supervisor`, { supervisorId });
    return response.data.data;
  },
};
