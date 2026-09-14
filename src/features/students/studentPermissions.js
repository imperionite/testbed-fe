export function getStudentManagementPermissions(role) {
  const isAdministrator = role === "administrator";
  const isCoordinator = role === "internship_coordinator";
  const isFaculty = role === "faculty_adviser";
  const isHTESupervisor = role === "hte_supervisor";
  const isStudent = role === "student";

  return {
    canView: isAdministrator || isCoordinator || isFaculty || isStudent,
    canCreate: isAdministrator || isCoordinator || isHTESupervisor,
    canUpdate: isAdministrator || isCoordinator,
  };
}
