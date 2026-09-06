import api from "./axios";
import { endpoints } from "../config";

export const internshipsApi = {
  async listInternships() {
    const { data } = await api.get(endpoints.internships.list);
    return data.data;
  },

  async getInternship(id) {
    const { data } = await api.get(endpoints.internships.details(id));
    return data.data;
  },

  async createInternship(payload) {
    const { data } = await api.post(endpoints.internships.list, payload);
    return data.data;
  },

  async updateInternshipStatus(id, status) {
    const { data } = await api.patch(endpoints.internships.status(id), { status: status });
    return data.data;
  },

  async updateInternship(id, payload) {
    const { data } = await api.patch(endpoints.internships.details(id), payload);
    return data.data;
  },

  async assignFacultyAdviser(id, facultyAdviserId) {
    const { data } = await api.patch(endpoints.internships.adviser(id), {
      facultyAdviserId: facultyAdviserId,
    });
    return data.data;
  },

  async getOwnInternship() {
    const { data } = await api.get(endpoints.internships.me);
    return data.data;
  },
};
