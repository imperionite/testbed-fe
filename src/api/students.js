import api from "./axios";
import { endpoints } from "../config";

export const studentApi = {
  async listStudents() {
    const response = await api.get(endpoints.students.root);
    return response.data.data;
  },

  async getMyProfile() {
    const response = await api.get(endpoints.students.me);
    return response.data.data;
  },

  async updateMyProfile(data) {
    const response = await api.patch(endpoints.students.me, data);
    return response.data.data;
  },

  async getStudent(id) {
    const response = await api.get(`${endpoints.students.root}/${id}`);
    return response.data.data;
  },

  async createStudent(data) {
    const response = await api.post(endpoints.students.root, data);
    return response.data.data;
  },

  async updateStudent(id, data) {
    const response = await api.patch(`${endpoints.students.root}/${id}`, data);
    return response.data.data;
  },
};
