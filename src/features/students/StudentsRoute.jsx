import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import StudentManagementPage from "./StudentManagementPage";

export default function StudentsRoute() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const isStaff = ['administrator', 'internship_coordinator', 'hte_supervisor'].includes(user?.role);

  if (isStudent) {
    return <Navigate to="/students/me" replace />;
  }

  if (isStaff) {
    return <StudentManagementPage />;
  }

  return <Navigate to="/unauthorized" replace />;
}
