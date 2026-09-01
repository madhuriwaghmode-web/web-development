import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { offlineSyncService } from '../../services/offlineSyncService'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isOnline } = useApp()
  const toast = useToast()
  const wasOffline = useRef(false)

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true
      return
    }

    if (!wasOffline.current) return

    wasOffline.current = false

    const queue = offlineSyncService.getQueue()

    if (queue.length === 0) return

    toast.push(
      `Back online — syncing ${queue.length} pending item${
        queue.length === 1 ? '' : 's'
      }…`,
      'info'
    )

    offlineSyncService.syncQueue().then(() => {
      toast.push('All pending items synced.', 'success')
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline])

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Fixed Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="min-h-screen flex flex-col lg:ml-64">

        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-[1400px] w-full mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}