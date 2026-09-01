import PatientCard from './PatientCard'
import EmptyState from '../common/EmptyState'
import { Users } from 'lucide-react'

export default function PatientTable({ patients }) {
  if (patients.length === 0) {
    return <EmptyState icon={Users} title="No patients found" description="Try a different search, or register a new patient." />
  }

  return (
    <div className="space-y-2.5">
      {patients.map((p) => (
        <PatientCard key={p.id} patient={p} />
      ))}
    </div>
  )
}
