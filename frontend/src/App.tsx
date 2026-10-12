import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import { RouteLoader } from './components/RouteLoader';

/* Route-split so first paint ships the hero and the glass, not every page. */
const Approach = lazy(() => import('./pages/Approach'));
const Care = lazy(() => import('./pages/Care'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

/** Wraps a lazy route so Suspense never has to be repeated. */
function lazyRoute(Component: React.ComponentType) {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Component />
    </Suspense>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home sits on the glass hero, so its header is transparent at rest */}
        <Route element={<Layout heroHeader />}>
          <Route index element={<Home />} />

          {/* Aliases for home. Opening the bare domain already lands here, but
              `/home` and `/index.html` are what people actually type, what gets
              shared, and what shows up in an old bookmark — and those used to
              fall through to the 404. Replaced rather than pushed, so Back does
              not bounce the visitor between the alias and the real page.
              Vercel redirects these before the app loads; this is the same rule
              for any other host. React Router matches paths case-insensitively,
              so `/Home` and `/HOME` are covered too. */}
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="home/*" element={<Navigate to="/" replace />} />
          <Route path="index.html" element={<Navigate to="/" replace />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="approach" element={lazyRoute(Approach)} />
          <Route path="care" element={lazyRoute(Care)} />
          <Route path="about" element={lazyRoute(About)} />
          <Route path="contact" element={lazyRoute(Contact)} />
          <Route path="*" element={lazyRoute(NotFound)} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}