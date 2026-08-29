import { Wifi, WifiOff } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function OfflineIndicator() {
  const { isOnline } = useApp()

  return (
    <span
      className={
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ' +
        (isOnline
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-amber-50 text-amber-800 border-amber-200')
      }
      title={isOnline ? 'Connected' : 'Working offline — changes will sync automatically'}
    >
      {isOnline ? <Wifi size={14} aria-hidden="true" /> : <WifiOff size={14} aria-hidden="true" />}
      {isOnline ? 'Online' : 'Offline'}
    </span>
  )
}
