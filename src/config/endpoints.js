const endpoints = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
    changePassword: '/auth/change-password',
    forgotPassword: '/auth/forgot-password',

    completePasswordReset: '/auth/reset-password/complete',
  },

  users: {
    list: '/users',
    details: (id) => `/users/${id}`,
    role: (id) => `/users/${id}/role`,
    status: (id) => `/users/${id}/status`,
  },

  students: {
    list: '/students',
    assigned:'/students/assigned',
    me: '/students/me',
    details: (id) => `/students/${id}`,
  },

  htes: {
    list: '/htes',
    my_students: 'htes/my/students',
    details: (id) => `/htes/${id}`,
    status: (id) => `/htes/${id}/status`,
    supervisor: (id) => `/htes/${id}/supervisor`,
  },

  evaluations: {
    create: "/evaluations",
    my_list: "/evaluations/me",
    by_intern:  (id) => `/evaluations/internship/${id}`,
    details: (id) => `/evaluations/${id}`,
    submit: (id) => `/evaluations/${id}/submit`,
  },

  internships: {
    list: '/internships',
    details: (id) => `/internships/${id}`,
    status: (id) => `/internships/${id}/status`,
    adviser: (id) => `/internships/${id}/adviser`,
    me: '/internships/me',
  },

  attendance: {
    list: '/attendance',
    me: '/attendance/me',
    details: (id) => `/attendance/${id}`,
    internship: (id) => `/attendance/internship/${id}`,
    renderedHours: (id) => `/attendance/internship/${id}/rendered-hours`,
    validation: (id) => `/attendance/${id}/validation`,
  },

  documents: {
    listByInternship: (internshipId) => `/documents/internship/${internshipId}`,
    details: (id) => `/documents/${id}`,
    upload: '/documents',
    approve: (id) => `/documents/${id}/approve`,
    reject: (id) => `/documents/${id}/reject`,
    delete: (id) => `/documents/${id}`,
  },

  reports: {
    internships: '/reports/internships',
    summary: '/reports/internships/summary',
  },

  audit: {
    list: "/audit-logs",
  },
  };

export default Object.freeze(endpoints)
