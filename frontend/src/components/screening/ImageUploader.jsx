import { useRef, useState } from 'react'
import { UploadCloud, X, RefreshCw, ImageOff } from 'lucide-react'
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '../../utils/constants'

export default function ImageUploader({ file, previewUrl, onSelect, onRemove, error }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  function validateAndSelect(selected) {
    if (!selected) return
    if (!ACCEPTED_IMAGE_TYPES.includes(selected.type)) {
      onSelect(null, 'Unsupported file type. Please upload a JPG or PNG image.')
      return
    }
    if (selected.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      onSelect(null, `Image is too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`)
      return
    }
    onSelect(selected, null)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    const dropped = e.dataTransfer.files?.[0]
    validateAndSelect(dropped)
  }

  if (previewUrl) {
    return (
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
        <div className="relative">
          <img src={previewUrl} alt="Retina fundus preview" className="w-full max-h-80 object-contain bg-black/5" />
        </div>
        <div className="flex items-center justify-between p-3 bg-white border-t border-slate-100">
          <p className="text-xs text-slate-500 truncate max-w-[60%]">{file?.name}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={13} /> Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50"
            >
              <X size={13} /> Remove
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => validateAndSelect(e.target.files?.[0])}
        />
      </div>
    )
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        aria-label="Upload fundus image"
        className={
          'flex flex-col items-center justify-center gap-2 text-center rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors ' +
          (dragActive ? 'border-brand-400 bg-brand-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100')
        }
      >
        <span className="grid place-items-center w-12 h-12 rounded-full bg-white border border-slate-200 text-brand-500">
          <UploadCloud size={22} />
        </span>
        <p className="font-medium text-slate-700 mt-1">Drag & drop a retina image</p>
        <p className="text-sm text-slate-500">or click to browse files · JPG, JPEG, PNG · up to {MAX_IMAGE_SIZE_MB}MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => validateAndSelect(e.target.files?.[0])}
        />
      </div>
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
          <ImageOff size={14} /> {error}
        </p>
      )}
    </div>
  )
}
