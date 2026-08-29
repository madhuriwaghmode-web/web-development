import { useApp } from '../../context/AppContext'
import EmptyState from '../common/EmptyState'
import { ShieldAlert } from 'lucide-react'

// Frontend-side convenience only — the real enforcement is Postgres RLS
// (see db/policies.sql). This just avoids rendering an admin screen to
// someone whose queries would fail anyway.
export default function AdminRoute({ children }) {
  const { role } = useApp()

  if (role !== 'admin') {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Admin access required"
        description="This area is restricted to admin accounts."
      />
    )
  }

  return children
}
