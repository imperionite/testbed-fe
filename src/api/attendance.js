import api from "./axios";
import { endpoints } from "../config";

export const attendanceApi = {
  async listAttendance() {
    const response = await api.get(endpoints.attendance.root);
    return response.data.data;
  },

  async getAttendance(id) {
    const response = await api.get(`${endpoints.attendance.root}/${id}`);
    return response.data.data;
  },
};
