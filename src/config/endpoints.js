const endpoints = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    me: "/auth/me",
    changePassword: "/auth/change-password",
  },

  users: {
    list: "/users",
    details: (id) => `/users/${id}`,
  },
};

export default Object.freeze(endpoints);