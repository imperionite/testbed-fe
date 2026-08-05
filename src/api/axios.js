import axios from "axios";

import { env, endpoints } from "../config";
import { authStorage } from "../auth";

const api = axios.create({
  baseURL: env.API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: env.API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

let refreshQueue = [];

function processQueue(error, token = null) {
  refreshQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  refreshQueue = [];
}

api.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const refreshToken = authStorage.getRefreshToken();

    if (!refreshToken) {
      authStorage.clearSession();

      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve,
          reject,
        });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      });
    }

    originalRequest._retry = true;

    isRefreshing = true;

    try {
      const response = await refreshClient.post(endpoints.auth.refresh, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      authStorage.setTokens({
        accessToken,
        refreshToken: newRefreshToken,
      });

      processQueue(null, accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      authStorage.clearSession();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
