import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DangerConfirmModal } from './dangerConfirmModal';

describe('DangerConfirmModal', () => {
  test('should not show when not open', () => {
    renderComponent({ isOpen: false });

    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
  });

  test('should include given context and consequences', () => {
    renderComponent({
      context: 'do that',
      consequences: 'I would not recommend it',
    });

    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });

  test.each([['Cancel'], ['Confirm']])(
    'should close the modal when %s is clicked',
    async (label) => {
      const onClose = jest.fn();

      renderComponent({ onClose });
      await userEvent.click(screen.getByText(label));

      expect(onClose).toHaveBeenCalled();
    },
  );

  test('should not confirm when cancel is clicked', async () => {
    const onConfirm = jest.fn();

    renderComponent({ onConfirm });
    await userEvent.click(screen.getByText('Cancel'));

    expect(onConfirm).not.toHaveBeenCalled();
  });

  test('should confirm action when confirm is clicked', async () => {
    const onConfirm = jest.fn();

    renderComponent({ onConfirm });
    await userEvent.click(screen.getByText('Confirm'));

    expect(onConfirm).toHaveBeenCalled();
  });
});

type ComponentProps = React.ComponentProps<typeof DangerConfirmModal>;

function renderComponent({
  isOpen = true,
  context = 'close',
  consequences = 'This would be bad',
  onConfirm = jest.fn(),
  onClose = jest.fn(),
}: Partial<ComponentProps>) {
  render(
    <DangerConfirmModal
      isOpen={isOpen}
      context={context}
      consequences={consequences}
      onConfirm={onConfirm}
      onClose={onClose}
    />,
  );
}
