import { useState } from 'react'
import { Settings as SettingsIcon, Wifi, WifiOff, RefreshCw, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { offlineSyncService } from '../services/offlineSyncService'
import { ROLES, ROLE_LABELS, LANGUAGES } from '../utils/constants'

export default function SettingsPage() {
  const { user, role, setRole, language, setLanguage, isOnline, lowBandwidthMode, setLowBandwidthMode } = useApp()
  const toast = useToast()
  const [queue, setQueue] = useState(() => offlineSyncService.getQueue())
  const [syncing, setSyncing] = useState(false)

  async function handleSync() {
    setSyncing(true)
    await offlineSyncService.syncQueue()
    setQueue(offlineSyncService.getQueue())
    setSyncing(false)
    toast.push('Sync complete.', 'success')
  }

  function handleClearQueue() {
    offlineSyncService.getQueue().forEach((item) => offlineSyncService.removeFromQueue(item.id))
    setQueue([])
    toast.push('Pending queue cleared.', 'info')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <SettingsIcon size={24} className="text-brand-600" /> Settings
        </h1>
      </div>

      <section className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="font-semibold text-slate-800 mb-3">Account</h2>
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-400">Name</dt>
            <dd className="text-slate-800 font-medium mt-0.5">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Role</dt>
            <dd className="mt-1">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm"
              >
                {Object.values(ROLES).map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </dd>
          </div>
        </dl>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="font-semibold text-slate-800 mb-3">Language</h2>
        <div className="flex gap-2 flex-wrap">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={
                'px-4 py-2 rounded-lg text-sm font-medium border ' +
                (language === l.code ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-300 text-slate-700 hover:bg-slate-50')
              }
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-800">Rural Mode</h2>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />} {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <label className="flex items-center justify-between py-3 border-t border-slate-100">
          <div>
            <p className="text-sm font-medium text-slate-800">Low bandwidth mode</p>
            <p className="text-xs text-slate-500">Reduces animations and compresses images before upload.</p>
          </div>
          <input
            type="checkbox"
            checked={lowBandwidthMode}
            onChange={(e) => setLowBandwidthMode(e.target.checked)}
            className="w-5 h-5 accent-brand-600"
            aria-label="Toggle low bandwidth mode"
          />
        </label>

        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-800">Pending sync queue</p>
            <span className="text-xs text-slate-500">{queue.length} item{queue.length === 1 ? '' : 's'}</span>
          </div>
          {queue.length === 0 ? (
            <p className="text-xs text-slate-400">Nothing waiting to sync.</p>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSync}
                disabled={syncing || !isOnline}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-40"
              >
                <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} /> Sync Now
              </button>
              <button
                onClick={handleClearQueue}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-3">
          Offline mode currently supports saving patients, images, and queued screenings locally. AI analysis itself still requires
          connectivity — true offline inference is not implemented in this build.
        </p>
      </section>
    </div>
  )
}
