import { Copy, Check, X } from './Icons.jsx'

const VIEW = {
  idle: { label: 'Copy', Icon: Copy, tone: 'bg-card hover:bg-ink hover:text-paper' },
  copied: { label: 'Copied', Icon: Check, tone: 'bg-ok text-paper' },
  failed: { label: 'Failed', Icon: X, tone: 'bg-signal' },
}

// Copy button driven by the status from useCopy().
export function CopyButton({ status, onCopy, class: className = '' }) {
  const { label, Icon, tone } = VIEW[status]
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-live="polite"
      class={`inline-flex min-w-28 items-center justify-center gap-2 border-2 border-ink px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer ${tone} ${className}`}
    >
      <Icon width={16} height={16} />
      {label}
    </button>
  )
}
