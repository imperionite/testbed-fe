import api from "./axios";

import { endpoints } from "../config";

// This keeps API communication separate from components.
// The component should not know URLs, Axios details, or response structure.

export const authApi = {
  async login(credentials) {
    const response = await api.post(endpoints.auth.login, credentials);

    return response.data.data;
  },

  async getMe() {
    const response = await api.get(endpoints.auth.me);

    return response.data.data;
  },

  async logout() {
    const response = await api.post(endpoints.auth.logout);

    return response.data;
  },

  async changePassword(payload) {
    const response = await api.post(endpoints.auth.changePassword, payload);

    return response.data.data;
  },

  async refresh(refreshToken) {
    const response = await api.post(endpoints.auth.refresh, {
      refreshToken,
    });

    return response.data.data;
  },

  async forgotPassword(email) {
    const response = await api.post(endpoints.auth.forgotPassword, { email });

    return response.data;
  },

  /**
   * Called AFTER Supabase successfully
   * changes the password.
   *
   * This only updates the application's
   * profile (must_change_password, etc.)
   */
  async completePasswordReset(userId) {
    const response = await api.post(endpoints.auth.completePasswordReset, {
      userId,
    });

    return response.data.data;
  },
};
