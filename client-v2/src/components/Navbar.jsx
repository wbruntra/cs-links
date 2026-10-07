export function Navbar() {
  return (
    <nav class="navbar navbar-expand-lg navbar-dark mb-5">
      <div class="container">
        <a href="/" class="navbar-brand d-flex align-items-center">
          <div class="brand-icon me-2">
            <i class="bi bi-scissors"></i>
          </div>
          <span>CS Linker</span>
        </a>

        <div class="navbar-nav ms-auto">
          <span class="navbar-text small">
            <i class="bi bi-shield-check me-1"></i>
            Secure • Fast • Reliable
          </span>
        </div>
      </div>
    </nav>
  )
}
