import { useCopy } from '../hooks/useCopy.js'
import { CopyButton } from './CopyButton.jsx'

// A labelled, read-only link with its own copy button.
export function LinkRow({ label, hint, value, copyState }) {
  const own = useCopy()
  const [status, copy] = copyState || own

  return (
    <div>
      <div class="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 class="font-display text-2xl font-semibold">{label}</h3>
        <p class="text-xs text-muted">{hint}</p>
      </div>
      <div class="mt-2 flex">
        <input
          type="text"
          readOnly
          value={value}
          onFocus={(e) => e.currentTarget.select()}
          aria-label={label}
          class="min-w-0 flex-1 border-2 border-r-0 border-ink bg-white px-4 py-3 text-sm outline-none focus:bg-signal/10"
        />
        <CopyButton status={status} onCopy={() => copy(value)} />
      </div>
    </div>
  )
}
