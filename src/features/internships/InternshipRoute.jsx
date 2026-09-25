import useAuth from '../../hooks/useAuth'
import InternshipManagementPage from './InternshipManagementPage'
import HteInternshipPage from '../internships/HteInternshipPage'

export default function InternshipRoute() {
  const { user } = useAuth()
  const isHteSupervisor = user?.role === 'hte_supervisor'

  if (isHteSupervisor) {
    return <HteInternshipPage />
  } else {
    return <InternshipManagementPage />
  }
}
