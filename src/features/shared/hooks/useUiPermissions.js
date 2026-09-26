import useAuth from '../../../hooks/useAuth'

/**
 * Centralized UI-related permission hook for cleaner approach.
 * 
 * This hook encapsulates logic to determine UI capabilities based on user roles.
 * This hook centralizes the "view-logic" for what the UI should display.
 */

export function useUiPermissions() {
  const { user } = useAuth()
  const role = user?.role?.toLowerCase()

  const isRole = (targetRole) => role === targetRole?.toLowerCase()

  return {
    role,
    isAdmin: isRole('administrator'),
    isCoordinator: isRole('internship_coordinator'),
    isHteSupervisor: isRole('hte_supervisor'),
    isFacultyAdviser: isRole('faculty_adviser'),
    isStudent: isRole('student'),
    
    // Helper to check for staff roles that are generally read-only in this context
    isReadOnlyStaff: isRole('administrator') || isRole('internship_coordinator'),
  }
}
