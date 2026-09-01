import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ScanEye, User } from 'lucide-react'
import { patientService } from '../services/patientService'
import { screeningService } from '../services/screeningService'
import { offlineSyncService } from '../services/offlineSyncService'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import EyeSelector from '../components/screening/EyeSelector'
import ImageUploader from '../components/screening/ImageUploader'
import ImageQualityCard from '../components/screening/ImageQualityCard'
import LoadingState from '../components/common/LoadingState'

const STEPS = ['Select Patient', 'Select Eye', 'Upload Image', 'Quality Check']

export default function NewScreeningPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isOnline } = useApp()
  const toast = useToast()

  const [patients, setPatients] = useState(() => patientService.getPatients())
  const [patientId, setPatientId] = useState(searchParams.get('patientId') || '')
  const [eye, setEye] = useState('right')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const [quality, setQuality] = useState(null)
  const [checkingQuality, setCheckingQuality] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    let mounted = true
    patientService.fetchPatients().then((list) => {
      if (mounted && list) setPatients(list)
    })
    return () => {
      mounted = false
    }
  }, [])

  const patient = patients.find(
    (p) => p.id === patientId || p._id === patientId || p.patientId === patientId
  )

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      setQuality(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setQuality(null)
    setCheckingQuality(true)
    screeningService.checkQuality(file).then((result) => {
      setQuality(result)
      setCheckingQuality(false)
    })
    return () => URL.revokeObjectURL(url)
  }, [file])

  function handleSelectFile(selected, error) {
    setUploadError(error)
    setFile(selected)
  }

  function handleRemove() {
    setFile(null)
    setUploadError(null)
  }

  async function handleAnalyze() {
    if (!patient || !file || !quality?.usable) return
    setAnalyzing(true)
    try {
      const imageDataUrl = await fileToDataUrl(file)

      if (!isOnline) {
        offlineSyncService.queueScreening({ type: 'screening', patientId: patient.patientId, eye, imageDataUrl, quality })
        toast.push('You are offline — screening saved locally and will run once connection returns.', 'info')
        navigate(`/patients/${patient.id || patient._id || patient.patientId}`)
        return
      }

      const record = await screeningService.runScreening({
        patientId: patient.patientId,
        eye,
        imageFile: file,
        imageDataUrl,
        quality,
      })
      toast.push('Screening processed and saved to database.', 'success')
      navigate(`/screening/${record.id || record._id || record.screeningId}/result`)
    } finally {
      setAnalyzing(false)
    }
  }

  if (analyzing) {
    return <LoadingState label="Analyzing retinal image…" />
  }

  const canAnalyze = Boolean(patient) && Boolean(file) && quality?.usable && !checkingQuality

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <ScanEye size={24} className="text-brand-600" /> New Screening
        </h1>
        <p className="text-slate-500 text-sm mt-1">Complete each step to run an AI-assisted screening.</p>
      </div>

      <StepIndicator activeIndex={file ? (quality ? 3 : 2) : patient ? (eye ? 1 : 0) : 0} />

      <Section title="Step 1 · Select Patient">
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
          >
            <option value="">Choose a patient…</option>
            {patients.map((p) => (
              <option key={p.id || p._id || p.patientId} value={p.id || p._id || p.patientId}>
                {p.name} · {p.patientId}
              </option>
            ))}
          </select>
        </div>
      </Section>

      <Section title="Step 2 · Select Eye">
        <EyeSelector value={eye} onChange={setEye} />
      </Section>

      <Section title="Step 3 · Upload Retina Image">
        <ImageUploader file={file} previewUrl={previewUrl} onSelect={handleSelectFile} onRemove={handleRemove} error={uploadError} />
      </Section>

      {file && (
        <Section title="Step 4 · Image Quality Check">
          <ImageQualityCard quality={quality} loading={checkingQuality} />
        </Section>
      )}

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-400 max-w-sm">
          The Analyze button stays disabled until a patient is selected, an image is uploaded, and the image passes the quality check.
        </p>
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          Analyze Image
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-700 mb-2">{title}</h2>
      {children}
    </div>
  )
}

function StepIndicator({ activeIndex }) {
  return (
    <ol className="flex items-center gap-2 text-xs text-slate-400">
      {STEPS.map((step, i) => (
        <li key={step} className="flex items-center gap-2">
          <span
            className={
              'w-5 h-5 rounded-full grid place-items-center text-[10px] font-semibold ' +
              (i <= activeIndex ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-500')
            }
          >
            {i + 1}
          </span>
          <span className={i <= activeIndex ? 'text-slate-600 font-medium' : ''}>{step}</span>
          {i < STEPS.length - 1 && <span className="w-6 h-px bg-slate-200 mx-1" />}
        </li>
      ))}
    </ol>
  )
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
