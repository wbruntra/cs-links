import { LocationProvider, Router, Route } from 'preact-iso'
import { Scissors } from './components/Icons.jsx'
import { HomeView } from './views/HomeView.jsx'
import { LinkView } from './views/LinkView.jsx'
import { RedirectView } from './views/RedirectView.jsx'

export function App() {
  return (
    <LocationProvider>
      <div class="mx-auto flex min-h-screen max-w-5xl flex-col px-5 sm:px-8">
        <header class="flex items-center justify-between border-b-2 border-ink py-5">
          <a href="/" class="group flex items-center gap-3">
            <span class="grid size-9 place-items-center bg-ink text-signal">
              <Scissors width={18} height={18} class="group-hover:motion-safe:animate-snip" />
            </span>
            <span class="font-display text-2xl font-semibold tracking-tight">Cut</span>
          </a>
          <span class="hidden text-xs uppercase tracking-[0.2em] text-muted sm:block">
            Short links, no fuss
          </span>
        </header>

        <main class="flex-1 py-12 sm:py-20">
          <Router>
            <Route path="/" component={HomeView} />
            <Route path="/link/:code" component={LinkView} />
            <Route path="/k/:code" component={RedirectView} />
          </Router>
        </main>

        <footer class="border-t-2 border-ink py-5 text-xs text-muted">
          Links never expire.
        </footer>
      </div>
    </LocationProvider>
  )
}
