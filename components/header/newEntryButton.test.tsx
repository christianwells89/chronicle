import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';

import { NEW_ENTRIES_PATH, NewEntryButton } from './newEntryButton';

describe('NewEntryButton', () => {
  test('should not be shown when on the new entry page', () => {
    mockRouter.setCurrentUrl(NEW_ENTRIES_PATH);

    render(<NewEntryButton />);

    expect(screen.queryByRole('button', { name: 'Add new entry' })).not.toBeInTheDocument();
  });

  test.each([
    ['index', '/'],
    ['existing entry', '/entry/some-uuid'],
  ])('should be shown when on %s page', (_, pathname) => {
    mockRouter.setCurrentUrl(pathname);

    render(<NewEntryButton />);

    expect(screen.getByRole('button', { name: 'Add new entry' })).toBeInTheDocument();
  });

  test('should navigate to new entry page on click', async () => {
    mockRouter.setCurrentUrl('/');

    render(<NewEntryButton />);
    await userEvent.click(screen.getByRole('button', { name: 'Add new entry' }));

    expect(mockRouter).toMatchObject({ pathname: NEW_ENTRIES_PATH });
  });
});
