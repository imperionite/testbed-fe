import { useUiPermissions } from '../shared/hooks/useUiPermissions'
import InternshipManagementPage from './InternshipManagementPage'
import HteInternshipPage from './HteInternshipPage'

export default function InternshipRoute() {
  const { isHteSupervisor } = useUiPermissions()

  if (isHteSupervisor) {
    return <HteInternshipPage />
  } else {
    return <InternshipManagementPage />
  }
}
