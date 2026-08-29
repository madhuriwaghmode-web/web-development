import { Link } from 'react-router-dom'
import { CompassIcon } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] grid place-items-center text-center px-4">
      <div>
        <CompassIcon size={40} className="mx-auto text-slate-300 mb-3" />
        <h1 className="text-xl font-semibold text-slate-800">Page not found</h1>
        <p className="text-slate-500 mt-1 mb-4">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="text-brand-600 hover:underline text-sm font-medium">Back to dashboard</Link>
      </div>
    </div>
  )
}
