import { Scissors } from './Icons.jsx'

// Dashed "cut here" divider with a scissors icon riding the line.
export function CutLine({ class: className = '' }) {
  return (
    <div class={`flex items-center gap-3 text-ink ${className}`} aria-hidden="true">
      <Scissors class="-rotate-90 shrink-0" />
      <div class="h-0 flex-1 border-t-2 border-dashed border-ink/60"></div>
    </div>
  )
}
