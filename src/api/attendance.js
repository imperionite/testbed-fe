import api from "./axios";
import { endpoints } from "../config";

export const attendanceApi = {
  async createAttendance(payload) {
    const response = await api.post(endpoints.attendance.list, payload);
    return response.data.data;
  },

  async getMyAttendance() {
    const response = await api.get(endpoints.attendance.me);
    return response.data.data;
  },

  async getAttendanceByInternship(internshipId) {
    const response = await api.get(endpoints.attendance.internship(internshipId));
    return response.data.data;
  },

  async getRenderedHours(internshipId) {
    const response = await api.get(endpoints.attendance.renderedHours(internshipId));
    return response.data.data;
  },

  async getAttendanceById(id) {
    const response = await api.get(endpoints.attendance.details(id));
    return response.data.data;
  },

  async updateAttendance(id, payload) {
    const response = await api.patch(endpoints.attendance.details(id), payload);
    return response.data.data;
  },

  async validateAttendance(id, validationStatus) {
    const response = await api.patch(endpoints.attendance.validation(id), {
      validation_status: validationStatus,
    });
    return response.data.data;
  },
};
