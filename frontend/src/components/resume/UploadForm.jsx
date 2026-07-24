import { useRef, useState } from 'react'
import { useResumeStore } from '../../stores/resumeStore'

const ACCEPTED_TYPES = '.pdf,.doc,.docx'

export default function UploadForm() {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const uploadResume = useResumeStore((state) => state.uploadResume)
  const status = useResumeStore((state) => state.status)
  const error = useResumeStore((state) => state.error)

  async function handleFile(file) {
    if (!file) return
    try {
      await uploadResume(file)
    } catch {
      // error already captured in the store
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          handleFile(event.dataTransfer.files?.[0])
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragging ? 'border-teal-400 bg-teal-500/5' : 'border-border hover:border-teal-500/40'
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-teal-300" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
        </svg>
        <p className="mt-3 text-sm font-medium text-zinc-200">
          Drop your resume here, or <span className="text-teal-300">browse</span>
        </p>
        <p className="mt-1 text-xs text-zinc-500">PDF or DOCX</p>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={(event) => handleFile(event.target.files?.[0])}
          className="hidden"
        />
      </div>

      {status === 'loading' && <p className="mt-3 text-sm text-zinc-400">Uploading...</p>}
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  )
}
