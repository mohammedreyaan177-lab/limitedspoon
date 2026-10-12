import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './Layout';

/**
 * `Layout` sits in the same wrapper for both routes and never unmounts — the
 * exact condition that caused the bug. The scroll reset used to depend on `[]`,
 * so it fired once per mount, and moving between `/care` and `/about` reused
 * that instance. Clicking a link from 1,600px down therefore landed you 1,600px
 * down on the next page.
 *
 * `Layout` owns its own `<Outlet />`, so the shell deliberately does not add a
 * second one — doing so renders the matched page twice.
 */
function Shell() {
  return (
    <>
      <Link to="/about">Go to about</Link>
      <Layout />
    </>
  );
}

describe('scroll position on navigation', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderShared() {
    return render(
      <MemoryRouter initialEntries={['/care']}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="care" element={<p>care page</p>} />
            <Route path="about" element={<p>about page</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
  }

  it('resets to the top when moving between routes that share a Layout', async () => {
    const user = userEvent.setup();
    renderShared();

    expect(screen.getByText('care page')).toBeInTheDocument();

    // Cleared after mount, so only the navigation is counted.
    (window.scrollTo as unknown as ReturnType<typeof vi.fn>).mockClear();

    await user.click(screen.getByRole('link', { name: 'Go to about' }));

    await waitFor(() => {
      expect(screen.getByText('about page')).toBeInTheDocument();
    });
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('still renders exactly one copy of the matched page', async () => {
    const user = userEvent.setup();
    renderShared();

    await user.click(screen.getByRole('link', { name: 'Go to about' }));

    await waitFor(() => {
      expect(screen.getAllByText('about page')).toHaveLength(1);
    });
  });
});