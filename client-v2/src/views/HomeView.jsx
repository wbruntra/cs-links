import { useState } from 'preact/hooks'
import { useLocation } from 'preact-iso'
import { API_BASE } from '../config.js'

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

      // Navigate to the link display page
      route(`/link/${encodeURIComponent(code)}?${query}`)
    } catch (err) {
      setError(err.message || 'Failed to create link')
      setIsLoading(false)
    }
  }

  return (
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card fade-in-up">
          <div class="card-body text-center">
            <div class="mb-4">
              <i
                class="bi bi-link-45deg"
                style="font-size: 3rem; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
              ></i>
            </div>

            <h1
              class="card-title mb-2"
              style="background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700;"
            >
              Create Short Link
            </h1>
            <p class="text-muted mb-4">Transform your long URLs into clean, shareable links</p>

            <form onSubmit={createLink}>
              <div class="mb-3 text-start">
                <label for="address" class="form-label">
                  <i class="bi bi-globe me-2"></i>
                  Enter your URL
                </label>
                <input
                  id="address"
                  value={address}
                  onInput={(e) => setAddress(e.currentTarget.value)}
                  type="url"
                  class="form-control"
                  placeholder="https://example.com"
                  required
                  disabled={isLoading}
                />
                {/* Honeypot field - hidden from users but visible to bots */}
                <input type="text" name="website" class="visually-hidden" />
              </div>

              <div class="d-grid">
                <button
                  type="submit"
                  class={`btn btn-primary btn-lg${isLoading ? ' pulse' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : (
                    <i class="bi bi-scissors me-2"></i>
                  )}
                  {isLoading ? 'Creating your link...' : 'Shorten URL'}
                </button>
              </div>
            </form>

            {error && (
              <div class="alert alert-danger mt-3 fade-in-up" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <div class="mt-4 pt-3 border-top">
              <small class="text-muted">
                <i class="bi bi-shield-check me-1"></i>
                Your links are secure and trackable
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
