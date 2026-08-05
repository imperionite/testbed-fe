const ACCESS_TOKEN_KEY = "sbims_access_token";
const REFRESH_TOKEN_KEY = "sbims_refresh_token";
const USER_KEY = "sbims_user";

export const authStorage = {
  setTokens({ accessToken, refreshToken }) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  hasSession() {
    return Boolean(this.getAccessToken() && this.getRefreshToken());
  },

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
  },
};
