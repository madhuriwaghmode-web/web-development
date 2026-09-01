import { useNavigate } from 'react-router-dom'
import { patientService } from '../services/patientService'
import { offlineSyncService } from '../services/offlineSyncService'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import PatientForm from '../components/patient/PatientForm'

export default function AddPatientPage() {
  const navigate = useNavigate()
  const { isOnline } = useApp()
  const toast = useToast()

  async function handleSave(data, andStartScreening) {
    try {
      const patient = await patientService.addPatient(data)

      if (!isOnline) {
        offlineSyncService.queueScreening({ type: 'patient', patientId: patient.patientId })
        toast.push('Saved locally — will sync when you are back online.', 'info')
      } else {
        toast.push('Patient saved successfully to database.', 'success')
      }

      if (andStartScreening) {
        navigate(`/screening/new?patientId=${patient.id || patient._id || patient.patientId}`)
      } else {
        navigate(`/patients/${patient.id || patient._id || patient.patientId}`)
      }
    } catch {
      toast.push('Error saving patient. Please try again.', 'error')
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Add Patient</h1>
      <p className="text-slate-500 text-sm mb-6">Register a new patient before starting a screening.</p>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <PatientForm
          onSubmit={handleSave}
          onCancel={() => navigate('/patients')}
          submitLabel="Save Patient"
          extraAction="Save & Start Screening"
        />
      </div>
    </div>
  )
}
