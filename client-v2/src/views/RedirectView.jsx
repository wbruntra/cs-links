import { useEffect, useState } from 'preact/hooks'
import { useRoute } from 'preact-iso'
import { API_BASE } from '../config.js'
import { useCopy } from '../hooks/useCopy.js'
import { LinkRow } from '../components/LinkRow.jsx'
import { CutLine } from '../components/CutLine.jsx'
import { ArrowRight } from '../components/Icons.jsx'

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function RedirectView() {
  const { params } = useRoute()
  const [link, setLink] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const pageCopy = useCopy()
  const directCopy = useCopy()

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError('')

    ;(async () => {
      try {
        const response = await fetch(`${API_BASE}/k/${params.code}`)
        if (!response.ok) {
          if (!cancelled) setError(response.status === 404 ? 'Link not found' : 'Error loading link')
          return
        }
        const data = await response.json()
        if (!cancelled) setLink(data)
      } catch {
        if (!cancelled) setError('Failed to load link')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [params.code])

  if (isLoading) {
    return <p class="text-sm uppercase tracking-[0.2em] text-muted">Loading…</p>
  }

  if (error) {
    return (
      <div class="motion-safe:animate-rise">
        <h1 class="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.95]">{error}.</h1>
        <a href="/" class="mt-6 inline-block underline underline-offset-4">
          Cut a new link
        </a>
      </div>
    )
  }

  const { originalUrl, pageLink, directLink } = link

  return (
    <div class="motion-safe:animate-rise">
      <p class="text-sm uppercase tracking-[0.2em] text-muted">This link leads to</p>
      <h1 class="mt-2 break-all font-display text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-tight">
        {hostOf(originalUrl)}
      </h1>
      <p class="mt-4 break-all text-sm text-muted">{originalUrl}</p>

      <a
        href={originalUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="group mt-8 inline-flex items-center gap-3 border-2 border-ink bg-signal px-8 py-4 text-base font-semibold uppercase tracking-wider shadow-hard transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm"
      >
        Go
        <ArrowRight class="transition-transform group-hover:translate-x-1" />
      </a>

      <CutLine class="my-12" />

      <div class="space-y-8">
        <LinkRow label="Share this link" hint="Shows this preview page" value={pageLink} copyState={pageCopy} />
        <LinkRow label="Skip this page" hint="Straight to the destination" value={directLink} copyState={directCopy} />
      </div>

      <a href="/" class="mt-12 inline-block text-sm underline underline-offset-4 hover:text-signal">
        Cut your own link
      </a>
    </div>
  )
}
