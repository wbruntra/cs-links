import { useLocation } from 'preact-iso'
import { useCopy } from '../hooks/useCopy.js'
import { CopyButton } from '../components/CopyButton.jsx'

export function LinkView() {
  const { query, route } = useLocation()
  const { originalUrl, pageLink, directLink } = query

  const [pageStatus, copyPage] = useCopy()
  const [directStatus, copyDirect] = useCopy()

  return (
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <div class="card fade-in-up">
          <div class="card-body">
            {/* Success Header */}
            <div class="text-center mb-4">
              <div class="success-icon mb-3">
                <i class="bi bi-check-circle-fill" style="font-size: 4rem; color: #28a745;"></i>
              </div>
              <h1 class="card-title text-success mb-2" style="font-weight: 700;">
                Link Created Successfully!
              </h1>
              <p class="text-muted">Your shortened link is ready to share</p>
            </div>

            {/* Original URL Section */}
            <div class="glass-effect p-4 rounded mb-4">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-globe2 me-2 text-primary" style="font-size: 1.2rem;"></i>
                <h5 class="mb-0 text-primary">Original URL</h5>
              </div>
              <p class="mb-3 text-break">
                <a href={originalUrl} target="_blank" rel="noopener noreferrer" class="text-decoration-none fw-medium">
                  {originalUrl}
                </a>
              </p>
              <a href={originalUrl} target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-box-arrow-up-right me-1"></i>
                Visit Original Link
              </a>
            </div>

            {/* Share Link Section */}
            <div class="mb-4">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-share me-2" style="color: #667eea; font-size: 1.2rem;"></i>
                <h5 class="mb-0" style="color: #667eea;">Share Link</h5>
                <span class="badge bg-light text-dark ms-2">With Preview</span>
              </div>
              <p class="text-muted small mb-3">
                <i class="bi bi-info-circle me-1"></i>
                Recipients will see a preview page before being redirected
              </p>
              <div class="input-group shadow-sm">
                <input
                  type="text"
                  value={pageLink}
                  readOnly
                  class="form-control bg-light"
                  style="font-family: 'Courier New', monospace;"
                />
                <CopyButton icons status={pageStatus} onCopy={() => copyPage(pageLink)} />
              </div>
            </div>

            {/* Direct Link Section */}
            <div class="mb-4">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-lightning-charge me-2" style="color: #f093fb; font-size: 1.2rem;"></i>
                <h5 class="mb-0" style="color: #f093fb;">Direct Link</h5>
                <span class="badge bg-light text-dark ms-2">Instant Redirect</span>
              </div>
              <p class="text-muted small mb-3">
                <i class="bi bi-info-circle me-1"></i>
                Goes directly to your URL without any preview page
              </p>
              <div class="input-group shadow-sm">
                <input
                  type="text"
                  value={directLink}
                  readOnly
                  class="form-control bg-light"
                  style="font-family: 'Courier New', monospace;"
                />
                <CopyButton icons status={directStatus} onCopy={() => copyDirect(directLink)} />
              </div>
            </div>

            {/* Quick Actions */}
            <div class="glass-effect p-4 rounded">
              <div class="row g-3">
                <div class="col-sm-6">
                  <button onClick={() => route('/')} class="btn btn-primary w-100">
                    <i class="bi bi-plus-circle me-2"></i>
                    Create Another Link
                  </button>
                </div>
                <div class="col-sm-6">
                  <button class="btn btn-outline-secondary w-100" onClick={() => copyPage(pageLink)}>
                    <i class="bi bi-share me-2"></i>
                    Quick Share
                  </button>
                </div>
              </div>

              <div class="text-center mt-3 pt-3 border-top">
                <small class="text-muted">
                  <i class="bi bi-clock me-1"></i>
                  Links never expire •
                  <i class="bi bi-graph-up ms-2 me-1"></i>
                  Track clicks and analytics
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
