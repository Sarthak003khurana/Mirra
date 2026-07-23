const STATUS_LABEL = {
  idle: 'Not started',
  connecting: 'Connecting...',
  active: 'In progress',
  completed: 'Completed',
}

export default function Controls({ status, isConnected, onStart, onEnd }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${isConnected ? 'bg-teal-400' : 'bg-zinc-600'}`}
          aria-hidden
        />
        <span className="text-sm text-zinc-400">{STATUS_LABEL[status] || status}</span>
      </div>

      <div className="flex gap-3">
        {status === 'idle' || status === 'connecting' ? (
          <button
            type="button"
            onClick={onStart}
            disabled={status === 'connecting'}
            className="rounded-full bg-teal-500 px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-teal-400 disabled:opacity-60"
          >
            Start interview
          </button>
        ) : (
          <button
            type="button"
            onClick={onEnd}
            disabled={status === 'completed'}
            className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-60"
          >
            End interview
          </button>
        )}
      </div>
    </div>
  )
}
