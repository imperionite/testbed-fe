import { Box, Paper, Stack, Typography } from '@mui/material'

<<<<<<< HEAD
import useAuth from '../hooks/useAuth'
=======
import useAuth from "../hooks/useAuth";
import TimeTracker from "../features/attendance/components/TimeTracker";
import { useStudents } from "../features/students/hooks/useStudents";
>>>>>>> 71f7016 ([FR-07] Backend alignment, refactor codes for Student's attendance and implementation of conditions.)

const roleDashboard = {
  administrator: {
    title: 'Administrator Dashboard',
    description: 'Manage users, system configuration, and administrative operations.',
  },

  internship_coordinator: {
    title: 'Internship Coordinator Dashboard',
    description: 'Manage internship assignments, monitoring, and coordination activities.',
  },

  faculty_adviser: {
    title: 'Faculty Adviser Dashboard',
    description: 'Monitor assigned students and internship progress.',
  },

  student: {
    title: 'Student Dashboard',
    description: 'Manage your internship records and requirements.',
  },

  hte_supervisor: {
    title: 'HTE Supervisor Dashboard',
    description: 'Review student internship activities and evaluations.',
  },
}

export default function Dashboard() {
<<<<<<< HEAD
  const { user } = useAuth()
=======
  const { user } = useAuth();
  const { data: studentProfile } = useStudents(user?.role);
>>>>>>> 71f7016 ([FR-07] Backend alignment, refactor codes for Student's attendance and implementation of conditions.)

  if (!user) {
    return null
  }

  const dashboard = roleDashboard[user.role]

  return (
    <Box
      sx={{
<<<<<<< HEAD
        width: '100%',
=======
        width: "100%",
        position: 'relative'
>>>>>>> 71f7016 ([FR-07] Backend alignment, refactor codes for Student's attendance and implementation of conditions.)
      }}
    >
      {user.role === 'student' && studentProfile?.internship_id && (
        <TimeTracker internshipId={studentProfile.internship_id} />
      )}
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

          <Typography color="text.secondary">{dashboard.description}</Typography>

          <Typography variant="body2">Role: {user.role}</Typography>
        </Stack>
      </Paper>
    </Box>
  )
}
