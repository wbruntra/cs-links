import { LocationProvider, Router, Route } from 'preact-iso'
import { Navbar } from './components/Navbar.jsx'
import { FloatingElements } from './components/FloatingElements.jsx'
import { HomeView } from './views/HomeView.jsx'
import { LinkView } from './views/LinkView.jsx'
import { RedirectView } from './views/RedirectView.jsx'
import './app.css'

export function App() {
  return (
    <LocationProvider>
      <div id="app-root">
        <Navbar />
        <div class="container-fluid px-3">
          <Router>
            <Route path="/" component={HomeView} />
            <Route path="/link/:code" component={LinkView} />
            <Route path="/k/:code" component={RedirectView} />
          </Router>
        </div>
        <FloatingElements />
      </div>
    </LocationProvider>
  )
}
