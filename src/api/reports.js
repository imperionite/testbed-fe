import api from "./axios";
import { endpoints } from "../config";

export const reportsApi = {
  async getInternshipReport(filters = {}) {
    const response = await api.get(endpoints.reports.internships, { params: filters });
    return response.data.data;
  },

  async getInternshipReportSummary(filters = {}) {
    const response = await api.get(endpoints.reports.summary, { params: filters });
    return response.data.data;
  },
};
