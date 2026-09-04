const endpoints = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    me: "/auth/me",
    changePassword: "/auth/change-password",
    forgotPassword: "/auth/forgot-password",

    completePasswordReset: "/auth/reset-password/complete",
  },

  users: {
    list: "/users",
    details: (id) => `/users/${id}`,
    role: (id) => `/users/${id}/role`,
    status: (id) => `/users/${id}/status`,
  },

  students: {
    list: "/students",
    me: "/students/me",
    details: (id) => `/students/${id}`,
  },

  htes: {
    list: "/htes",
    details: (id) => `/htes/${id}`,
    status: (id) => `/htes/${id}/status`,
    supervisor: (id) => `/htes/${id}/supervisor`,
  },
};

export default Object.freeze(endpoints);
