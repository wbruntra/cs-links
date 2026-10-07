import { useLocation } from 'preact-iso'
import { useCopy } from '../hooks/useCopy.js'
import { LinkRow } from '../components/LinkRow.jsx'
import { CutLine } from '../components/CutLine.jsx'
import { ArrowUpRight, Plus } from '../components/Icons.jsx'

export function LinkView() {
  const { query } = useLocation()
  const { originalUrl, pageLink, directLink } = query

  const pageCopy = useCopy()
  const directCopy = useCopy()

  // Opened directly (not via the create form), so there is nothing to show.
  if (!pageLink || !directLink) {
    return (
      <div class="motion-safe:animate-rise">
        <h1 class="font-display text-5xl font-semibold">Nothing to see here.</h1>
        <a href="/" class="mt-6 inline-block underline underline-offset-4">
          Cut a new link
        </a>
      </div>
    )
  }

  return (
    <div class="motion-safe:animate-rise">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-ok">Done</p>
      <h1 class="mt-2 font-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-tight">
        Your link is <em class="font-medium text-signal">cut.</em>
      </h1>

      <div class="mt-10 border-2 border-ink bg-card shadow-hard">
        <div class="p-6 sm:p-8">
          <p class="text-xs uppercase tracking-[0.2em] text-muted">Original</p>
          <p class="mt-2 break-all text-sm sm:text-base">{originalUrl}</p>
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4 hover:text-signal"
          >
            Visit <ArrowUpRight width={16} height={16} />
          </a>
        </div>

        <CutLine class="px-6 sm:px-8" />

        <div class="space-y-8 p-6 sm:p-8">
          <LinkRow
            label="Share link"
            hint="Shows a preview page first"
            value={pageLink}
            copyState={pageCopy}
          />
          <LinkRow
            label="Direct link"
            hint="Straight to the destination"
            value={directLink}
            copyState={directCopy}
          />
        </div>
      </div>

      <div class="mt-8 flex flex-wrap gap-4">
        <a
          href="/"
          class="inline-flex items-center gap-2 border-2 border-ink bg-signal px-6 py-3 text-sm font-semibold uppercase tracking-wider shadow-hard-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          <Plus width={16} height={16} /> Cut another
        </a>
      </div>
    </div>
  )
}
