import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Approach from './pages/Approach';
import Care from './pages/Care';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

/** Shared route tree for browser navigation and static production rendering. */
export function AppRoutes() {
  return (
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
          <Route path="approach" element={<Approach />} />
          <Route path="care" element={<Care />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
