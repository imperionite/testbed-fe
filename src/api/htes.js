import api from "./axios";
import { endpoints } from "../config";

export const htesApi = {
  async listHtes() {
    const response = await api.get(endpoints.htes.list);
    return response.data.data;
  },

  async getHte(id) {
    const response = await api.get(endpoints.htes.details(id));
    return response.data.data;
  },

  async createHte(payload) {
    const response = await api.post(endpoints.htes.list, payload);
    return response.data.data;
  },

  async updateHte(id, payload) {
    const response = await api.patch(endpoints.htes.details(id), payload);
    return response.data.data;
  },

  async updateStatus(id, payload) {
    const response = await api.patch(endpoints.htes.status(id), {
      isActive: payload.isActive === true,
    });
    return response.data.data;
  },
   async updateHteSupervisor(id, payload) {
    const response = await api.patch(endpoints.htes.supervisor(id), payload);
    return response.data.data;
  },
};
