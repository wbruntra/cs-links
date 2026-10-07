import { useState } from 'preact/hooks'
import { useLocation } from 'preact-iso'
import { API_BASE } from '../config.js'
import { ArrowRight } from '../components/Icons.jsx'
import { CutLine } from '../components/CutLine.jsx'

export function HomeView() {
  const { route } = useLocation()
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function createLink(e) {
    e.preventDefault()
    if (!address) {
      setError('Please enter a URL')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/cli`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Unknown error')
      }

      const data = await response.json()
      const code = data.direct_link.split('/').pop()
      const query = new URLSearchParams({
        originalUrl: address,
        pageLink: data.page_link,
        directLink: data.direct_link,
      })

      route(`/link/${encodeURIComponent(code)}?${query}`)
    } catch (err) {
      setError(err.message || 'Failed to create link')
      setIsLoading(false)
    }
  }

  return (
    <div class="motion-safe:animate-rise">
      <h1 class="font-display text-[clamp(3.25rem,11vw,8rem)] font-semibold leading-[0.9] tracking-tight">
        Long links,
        <br />
        <em class="font-medium text-signal">cut</em> down to size.
      </h1>

      <CutLine class="my-10 sm:my-14" />

      <form onSubmit={createLink} class="motion-safe:animate-rise [animation-delay:150ms]">
        <label for="address" class="font-display text-2xl font-semibold">
          Paste a URL
        </label>

        <div class="mt-3 flex flex-col gap-4 sm:flex-row">
          <input
            id="address"
            type="url"
            required
            value={address}
            onInput={(e) => setAddress(e.currentTarget.value)}
            placeholder="https://example.com/a/very/long/path"
            disabled={isLoading}
            class="min-w-0 flex-1 border-2 border-ink bg-white px-5 py-4 text-base outline-none placeholder:text-muted/60 focus:shadow-hard-sm disabled:opacity-60"
          />
          {/* Honeypot field - hidden from users but visible to bots */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" class="sr-only" />

          <button
            type="submit"
            disabled={isLoading}
            class="group inline-flex items-center justify-center gap-3 border-2 border-ink bg-signal px-8 py-4 text-base font-semibold uppercase tracking-wider shadow-hard transition-all cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[5px] active:translate-y-[5px] active:shadow-none disabled:cursor-wait disabled:opacity-70"
          >
            {isLoading ? 'Cutting…' : 'Shorten'}
            <ArrowRight class="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {error && (
          <p role="alert" class="mt-5 border-2 border-ink bg-signal/15 px-4 py-3 text-sm font-medium">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}
