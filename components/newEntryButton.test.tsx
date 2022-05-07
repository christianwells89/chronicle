import { fireEvent, render, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';

import { NEW_ENTRIES_PATH, NewEntryButton } from './newEntryButton';

describe('NewEntryButton', () => {
  test('does not show when on the new entry page', () => {
    mockRouter.setCurrentUrl(NEW_ENTRIES_PATH);

    render(<NewEntryButton />);

    expect(screen.queryByRole('button', { name: 'Add new entry' })).not.toBeInTheDocument();
  });

  test.each([
    ['index', '/'],
    ['existing entry', '/entries/some-uuid'],
  ])('shows when on %s page', (_, pathname) => {
    mockRouter.setCurrentUrl(pathname);

    render(<NewEntryButton />);

    expect(screen.getByRole('button', { name: 'Add new entry' })).toBeInTheDocument();
  });

  test('navigates to new entry page on click', () => {
    mockRouter.setCurrentUrl('/');

    render(<NewEntryButton />);
    // userEvent's click doesn't cause the event to propagate or something.
    // Could be a bug with how the next link is wrapping the chakra one?
    fireEvent.click(screen.getByRole('button', { name: 'Add new entry' }));

    expect(mockRouter).toMatchObject({ pathname: NEW_ENTRIES_PATH });
  });
});
