import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Care from './pages/Care';

/**
 * Accessibility regression guard.
 *
 * axe cannot judge contrast where a WebGL canvas sits behind the text, so this
 * does not replace the manual luminance measurement recorded in
 * docs/qa-report.md -- it locks in the structural rules (labels, roles,
 * contrast on ordinary text) so a future edit cannot quietly regress them.
 *
 * Note: jsdom applies no CSS, so colour rules are effectively inert here. The
 * real contrast evidence comes from the live axe run recorded in
 * docs/qa-report.md; this suite guards the structure.
 */
async function audit(ui: React.ReactElement) {
  // A fresh container per run: a shared one gets emptied by cleanup between
  // tests and axe then refuses to run with "No elements found".
  const container = document.createElement('div');
  document.body.appendChild(container);
  render(ui, { container });
  try {
    const results = await axe.run(container, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
      },
    });
    return {
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.map((n) => n.html.slice(0, 120)),
      })),
      h1Count: container.querySelectorAll('h1').length,
    };
  } finally {
    container.remove();
  }
}

describe('accessibility', () => {
  it('home page has no WCAG A/AA violations', async () => {
    const { violations } = await audit(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    expect(violations).toEqual([]);
  });

  it('home page has exactly one h1', async () => {
    const { h1Count } = await audit(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    expect(h1Count).toBe(1);
  });

  it('contact page has no WCAG A/AA violations', async () => {
    const { violations } = await audit(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    );
    expect(violations).toEqual([]);
  });

  it('areas-of-care page has no WCAG A/AA violations', async () => {
    const { violations } = await audit(
      <MemoryRouter>
        <Care />
      </MemoryRouter>,
    );
    expect(violations).toEqual([]);
  });

  it('areas-of-care page has exactly one h1', async () => {
    const { h1Count } = await audit(
      <MemoryRouter>
        <Care />
      </MemoryRouter>,
    );
    expect(h1Count).toBe(1);
  });
});