const MAX_PREVIEW_CHARS = 240

export default function Preview({ resume }) {
  const preview = resume.parsed_text
    ? resume.parsed_text.slice(0, MAX_PREVIEW_CHARS) +
      (resume.parsed_text.length > MAX_PREVIEW_CHARS ? '…' : '')
    : 'Not parsed yet.'

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="truncate text-sm font-medium text-white">{resume.filename}</p>
        <span className="text-xs text-zinc-500">v{resume.version ?? 1}</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-500">{preview}</p>
    </div>
  )
}
