import { useState } from 'react'

const initialState = {
  name: '', age: '', gender: 'Female', phone: '', village: '', district: '',
  diabetesDuration: '', bloodSugar: '', hba1c: '',
}

export default function PatientForm({ onSubmit, onCancel, submitLabel = 'Save Patient', extraAction }) {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Patient name is required'
    if (!form.age || Number(form.age) <= 0) next.age = 'Enter a valid age'
    if (!form.village.trim()) next.village = 'Village is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e, andStartScreening) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, age: Number(form.age) }, andStartScreening)
  }

  const inputClass = (field) =>
    `w-full px-3 py-2.5 rounded-lg border ${errors[field] ? 'border-red-300' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-brand-400`

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Patient Name" required error={errors.name}>
          <input className={inputClass('name')} value={form.name} onChange={(e) => update('name', e.target.value)} />
        </Field>
        <Field label="Age" required error={errors.age}>
          <input type="number" min="0" className={inputClass('age')} value={form.age} onChange={(e) => update('age', e.target.value)} />
        </Field>
        <Field label="Gender">
          <select className={inputClass('gender')} value={form.gender} onChange={(e) => update('gender', e.target.value)}>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Phone Number (optional)">
          <input className={inputClass('phone')} value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </Field>
        <Field label="Village" required error={errors.village}>
          <input className={inputClass('village')} value={form.village} onChange={(e) => update('village', e.target.value)} />
        </Field>
        <Field label="District">
          <input className={inputClass('district')} value={form.district} onChange={(e) => update('district', e.target.value)} />
        </Field>
        <Field label="Diabetes Duration">
          <input placeholder="e.g. 8 years" className={inputClass('diabetesDuration')} value={form.diabetesDuration} onChange={(e) => update('diabetesDuration', e.target.value)} />
        </Field>
        <Field label="Blood Sugar (optional)">
          <input placeholder="e.g. 150 mg/dL" className={inputClass('bloodSugar')} value={form.bloodSugar} onChange={(e) => update('bloodSugar', e.target.value)} />
        </Field>
        <Field label="HbA1c (optional)">
          <input placeholder="e.g. 7.2%" className={inputClass('hba1c')} value={form.hba1c} onChange={(e) => update('hba1c', e.target.value)} />
        </Field>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" className="px-4 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700">
          {submitLabel}
        </button>
        {extraAction && (
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="px-4 py-2.5 rounded-lg border border-brand-300 text-brand-700 font-medium hover:bg-brand-50"
          >
            {extraAction}
          </button>
        )}
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {error && <span className="block text-xs text-red-600 mt-1">{error}</span>}
    </label>
  )
}
