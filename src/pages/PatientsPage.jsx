import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { patientService } from '../services/patientService'
import PatientTable from '../components/patient/PatientTable'

export default function PatientsPage() {
  const [query, setQuery] = useState('')
  const patients = useMemo(() => patientService.searchPatients(query), [query])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Patients</h1>
          <p className="text-slate-500 mt-1 text-sm">{patients.length} patient{patients.length === 1 ? '' : 's'} registered</p>
        </div>
        <Link
          to="/patients/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 w-fit"
        >
          <Plus size={18} /> Add Patient
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, ID, or village…"
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>

      <PatientTable patients={patients} />
    </div>
  )
}
