import { AlertTriangle } from 'lucide-react'

export default function ErrorState({ title = 'Something went wrong', description, action }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center text-center gap-2 py-14 px-4 rounded-xl border border-red-200 bg-red-50">
      <span className="grid place-items-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-1">
        <AlertTriangle size={22} aria-hidden="true" />
      </span>
      <p className="font-medium text-red-800">{title}</p>
      {description && <p className="text-sm text-red-700 max-w-sm">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
