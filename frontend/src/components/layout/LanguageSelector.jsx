import { Languages } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { LANGUAGES } from '../../utils/constants'

export default function LanguageSelector() {
  const { language, setLanguage } = useApp()

  return (
    <label className="inline-flex items-center gap-1.5 text-sm text-slate-600">
      <Languages size={16} aria-hidden="true" />
      <span className="sr-only">Language</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-transparent border-none text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 rounded"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </label>
  )
}
