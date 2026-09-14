import api from "./axios";
import { endpoints } from "../config";

export const auditApi = {
  async listLogs(filters = {}) {
    const response = await api.get(endpoints.audit.list, { params: filters });
    return response.data.data;
  },
};
