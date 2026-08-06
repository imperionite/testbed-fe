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
  },
};

export default Object.freeze(endpoints);
