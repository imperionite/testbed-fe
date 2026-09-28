import { useUiPermissions } from '../shared/hooks/useUiPermissions'
import InternshipManagementPage from './InternshipManagementPage'
import HteInternshipPage from './HteInternshipPage'
import StudentInternshipProfilePage from './StudentInternshipProfilePage'

export default function InternshipRoute() {
  const { isHteSupervisor, isStudent } = useUiPermissions()

  if (isStudent) {
    return <StudentInternshipProfilePage />
  } else if (isHteSupervisor) {
    return <HteInternshipPage />
  } else {
    return <InternshipManagementPage />
  }
}
