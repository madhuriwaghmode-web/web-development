import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, variant = 'info') => {
      const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
      setToasts((prev) => [...prev, { id, message, variant }])
      setTimeout(() => remove(id), 4000)
    },
    [remove]
  )

  const value = useMemo(() => ({ push, toasts, remove }), [push, toasts, remove])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 no-print">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={
              'min-w-[240px] max-w-sm rounded-lg px-4 py-3 text-sm shadow-lg border ' +
              (toast.variant === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : toast.variant === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-800')
            }
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
