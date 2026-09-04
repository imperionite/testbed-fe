import api from "./axios";

import { endpoints } from "../config";

export const studentApi = {
  async listStudents() {
    const response = await api.get(endpoints.students.list);
    return response.data.data;
  },

  async createStudent(payload) {
    const response = await api.post(endpoints.students.list, payload);
    return response.data.data;
  },

  async updateStudent(id, payload) {
    const response = await api.patch(endpoints.students.details(id), payload);
    return response.data.data;
  },

  async getMyProfile() {
    const response = await api.get(endpoints.students.me);
    return response.data.data;
  },

  async updateMyProfile(payload) {
    const response = await api.patch(endpoints.students.me, payload);
    return response.data.data;
  },
};