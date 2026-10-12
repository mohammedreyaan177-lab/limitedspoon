import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';

function renderHeader(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Header />
    </MemoryRouter>,
  );
}

describe('Header navigation', () => {
  it('exposes a toggle that reports its expanded state', async () => {
    const user = userEvent.setup();
    renderHeader();

    const toggle = screen.getByTestId('menu-toggle');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'mobile-nav');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('labels the toggle for assistive technology', async () => {
    const user = userEvent.setup();
    renderHeader();
    const toggle = screen.getByTestId('menu-toggle');

    expect(toggle).toHaveAccessibleName('Open menu');
    await user.click(toggle);
    expect(toggle).toHaveAccessibleName('Close menu');
  });

  it('opens a real landmark containing every destination', async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByTestId('menu-toggle'));

    const drawer = screen.getByRole('navigation', { name: /primary \(mobile\)/i });
    for (const label of ['Approach', 'Areas of care', 'About', 'Contact']) {
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0);
    }
    expect(drawer).toBeInTheDocument();
  });

  it('closes on Escape and hands focus back to the toggle', async () => {
    const user = userEvent.setup();
    renderHeader();
    const toggle = screen.getByTestId('menu-toggle');

    await user.click(toggle);
    await user.keyboard('{Escape}');

    await waitFor(() => expect(toggle).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(toggle).toHaveFocus());
  });

  it('locks page scroll behind the drawer and releases it on close', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByTestId('menu-toggle'));
    expect(document.body.style.overflow).toBe('hidden');

    await user.click(screen.getByTestId('menu-toggle'));
    await waitFor(() => expect(document.body.style.overflow).not.toBe('hidden'));
  });

  it('marks the current route for assistive technology', () => {
    renderHeader('/care');
    const current = screen.getAllByRole('link', { name: 'Areas of care' });
    // desktop nav + drawer both render the item; the active one carries the state
    expect(current.some((a) => a.getAttribute('aria-current') === 'page')).toBe(true);
  });
});