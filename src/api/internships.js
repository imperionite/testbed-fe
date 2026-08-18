import api from "./axios";
import { endpoints } from "../config";

export const internshipApi = {
  async listInternships() {
    const response = await api.get(endpoints.internships.root);
    return response.data.data;
  },

  async getInternship(id) {
    const response = await api.get(`${endpoints.internships.root}/${id}`);
    return response.data.data;
  },

  async createInternship(data) {
    const response = await api.post(endpoints.internships.root, data);
    return response.data.data;
  },

  async updateStatus(id, status) {
    const response = await api.patch(`${endpoints.internships.root}/${id}/status`, { status });
    return response.data.data;
  },

  async assignAdviser(id, facultyAdviserId) {
    const response = await api.patch(`${endpoints.internships.root}/${id}/adviser`, { facultyAdviserId });
    return response.data.data;
  },
};
