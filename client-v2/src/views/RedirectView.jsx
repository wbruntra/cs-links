import { useEffect, useState } from 'preact/hooks'
import { useRoute } from 'preact-iso'
import { API_BASE } from '../config.js'
import { useCopy } from '../hooks/useCopy.js'
import { CopyButton } from '../components/CopyButton.jsx'

export function RedirectView() {
  const { params } = useRoute()
  const [link, setLink] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [pageStatus, copyPage] = useCopy()
  const [directStatus, copyDirect] = useCopy()

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

  if (isLoading) return <h1>Loading...</h1>

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p class="error">{error}</p>
      </div>
    )
  }

  const { originalUrl, pageLink, directLink } = link

  return (
    <div>
      <h1>Link</h1>

      <div class="link-section">
        <p>Here is the link:</p>
        <p>
          <a href={originalUrl} target="_blank" rel="noopener noreferrer">{originalUrl}</a>
        </p>
        <p>
          <a href={originalUrl} target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            Go!
          </a>
        </p>
      </div>

      <hr style="margin: 30px 0;" />

      <div class="copy-section">
        <p><strong>Copy link for sharing:</strong></p>
        <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
          <input type="text" value={pageLink} readOnly style="flex: 1; background-color: #f8f9fa;" />
          <CopyButton idleClass="btn-secondary" failClass="btn-error" status={pageStatus} onCopy={() => copyPage(pageLink)} />
        </div>
      </div>

      <div class="copy-section">
        <p><strong>Copy link but skip this page:</strong></p>
        <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
          <input type="text" value={directLink} readOnly style="flex: 1; background-color: #f8f9fa;" />
          <CopyButton idleClass="btn-secondary" failClass="btn-error" status={directStatus} onCopy={() => copyDirect(directLink)} />
        </div>
      </div>

      <hr style="margin: 30px 0;" />

      <div>
        <p><strong>Create another link:</strong></p>
        <a href="/" class="btn btn-primary">Create Another Link</a>
      </div>
    </div>
  )
}
