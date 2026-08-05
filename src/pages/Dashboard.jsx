import { Box, Paper, Stack, Typography } from "@mui/material";

import useAuth from "../hooks/useAuth";

const roleDashboard = {
  administrator: {
    title: "Administrator Dashboard",
    description:
      "Manage users, system configuration, and administrative operations.",
  },

  internship_coordinator: {
    title: "Internship Coordinator Dashboard",
    description:
      "Manage internship assignments, monitoring, and coordination activities.",
  },

  faculty_adviser: {
    title: "Faculty Adviser Dashboard",
    description: "Monitor assigned students and internship progress.",
  },

  student: {
    title: "Student Dashboard",
    description: "Manage your internship records and requirements.",
  },

  hte_supervisor: {
    title: "HTE Supervisor Dashboard",
    description: "Review student internship activities and evaluations.",
  },
};

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const dashboard = roleDashboard[user.role];

  return (
    <Box
      sx={{
        p: 4,
        width: "100%",
      }}
    >
      <Paper
        sx={{
          p: 4,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight={700}>
            {dashboard.title}
          </Typography>

          <Typography>
            Welcome, {user.firstName} {user.lastName}
          </Typography>

          <Typography color="text.secondary">
            {dashboard.description}
          </Typography>

          <Typography variant="body2">
            Role: {user.role}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}