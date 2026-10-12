import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Contact from './Contact';

function renderContact() {
  return render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>,
  );
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/your name/i), 'Priya Raman');
  await user.type(screen.getByLabelText(/email address/i), 'priya@example.com');
  await user.type(
    screen.getByLabelText(/what would you like help with/i),
    'I would like help with a plan for managing PCOS.',
  );
  await user.click(screen.getByLabelText(/you may use these details/i));
}

describe('Contact enquiry form', () => {
  it('blocks submission and reports every empty required field', async () => {
    const user = userEvent.setup();
    renderContact();

    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/there are 4 things to check/i);

    // every invalid control is flagged for assistive tech
    for (const id of ['name', 'email', 'message', 'consent']) {
      expect(document.getElementById(id)).toHaveAttribute('aria-invalid', 'true');
    }
  });

  it('moves focus to the error summary so the failure is announced', async () => {
    const user = userEvent.setup();
    renderContact();

    await user.click(screen.getByRole('button', { name: /send enquiry/i }));
    const alert = await screen.findByRole('alert');
    await waitFor(() => expect(alert).toHaveFocus());
  });

  it('rejects an address that cannot be delivered to', async () => {
    const user = userEvent.setup();
    renderContact();

    await user.type(screen.getByLabelText(/your name/i), 'Priya Raman');
    await user.type(screen.getByLabelText(/email address/i), 'priya@@nope');
    await user.type(screen.getByLabelText(/what would you like help with/i), 'A real message here.');
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    expect(await screen.findByText(/does not look quite right/i, { selector: 'p' })).toBeInTheDocument();
  });

  it('requires meaningful copy, not a single character', async () => {
    const user = userEvent.setup();
    renderContact();

    await user.type(screen.getByLabelText(/your name/i), 'Priya Raman');
    await user.type(screen.getByLabelText(/email address/i), 'priya@example.com');
    await user.type(screen.getByLabelText(/what would you like help with/i), 'hi');
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    expect(await screen.findByText(/sentence or two/i, { selector: 'p' })).toBeInTheDocument();
  });

  it('clears a field error as soon as the visitor edits that field', async () => {
    const user = userEvent.setup();
    renderContact();

    await user.click(screen.getByRole('button', { name: /send enquiry/i }));
    expect(document.getElementById('name-error')).toHaveTextContent(/please tell us your name/i);

    await user.type(screen.getByLabelText(/your name/i), 'Priya');
    await waitFor(() => expect(document.getElementById('name-error')).toBeNull());
  });

  it('hands the composed enquiry over instead of failing silently', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    // navigator.clipboard is a getter-only accessor in jsdom
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const openSpy = vi.fn();
    vi.stubGlobal('open', openSpy);

    renderContact();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent(/copied your enquiry/i);

    // the visitor's actual words must survive the hand-off
    expect(writeText).toHaveBeenCalledTimes(1);
    const payload = writeText.mock.calls[0][0] as string;
    expect(payload).toContain('Priya Raman');
    expect(payload).toContain('priya@example.com');
    expect(payload).toContain('managing PCOS');

    // and a route out is actually offered
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('instagram.com'),
      '_blank',
      expect.any(String),
    );
  });

  it('labels every control', () => {
    renderContact();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/area of care/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what would you like help with/i)).toBeInTheDocument();
  });
});