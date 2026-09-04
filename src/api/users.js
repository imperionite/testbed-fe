import api from "./axios";
import { endpoints } from "../config";

//Filters out Test Seed Users - DELETE in prod
const TEST_USER_EMAILS = [
  "sbims-test-admin@maildrop.cc",
  "sbims-test-student@maildrop.cc",
  "sbims-test-coordinator@maildrop.cc",
  "sbims-test-hte-supervisor@maildrop.cc",
  "sbims-test-hte-supervisor-2@maildrop.cc",
  "sbims-test-first-login@maildrop.cc",
];

export const usersApi = {
  async listUsers() {
    const response = await api.get(endpoints.users.list);

    return response.data.data.filter(
      (user) => !TEST_USER_EMAILS.includes(user.email)
    );
  },

  async getUser(id) {
    const response = await api.get(endpoints.users.details(id));
    return response.data.data;
  },

  async createUser(payload) {
    const response = await api.post(endpoints.users.list, payload);
    return response.data.data;
  },

  async updateUser(id, payload) {
    const response = await api.patch(endpoints.users.details(id), payload);
    return response.data.data;
  },

  async updateUserRole(id, payload) {
    const response = await api.patch(endpoints.users.role(id), payload);
    return response.data.data;
  },

  async updateStatus(id, payload) {
    const response = await api.patch(endpoints.users.status(id), {
      isActive: payload.isActive === true,
    });
    return response.data.data;
  },
};
