import { Navigate } from 'react-router-dom'
import { useUiPermissions } from '../shared/hooks/useUiPermissions'
import StudentManagementPage from './StudentManagementPage'

export default function StudentsRoute() {
  const { isStudent, isReadOnlyStaff } = useUiPermissions()

  if (isStudent) {
    return <Navigate to="/students/me" replace />
  }

  if (isReadOnlyStaff) {
    return <StudentManagementPage />
  }

  return <Navigate to="/unauthorized" replace />
}
