import { ChakraProvider, ColorMode, ColorModeProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DarkModeSwitch } from './darkModeSwitch';

describe('DarkModeSwitch', () => {
  beforeEach(() => {
    mockMatchMedia('dark', true);
  });

  describe.each([
    ['light' as const, 'dark'],
    ['dark' as const, 'light'],
  ])('when in %s mode', (initialColorMode, oppositeColorMode) => {
    test(`should show tooltip to change to ${oppositeColorMode} mode`, async () => {
      renderComponent(initialColorMode);
      await userEvent.hover(screen.getByRole('button', { name: 'Switch theme' }));

      await expect(
        screen.findByText(`Toggle ${oppositeColorMode} mode`),
      ).resolves.toBeInTheDocument();
    });

    test(`should display an icon for ${oppositeColorMode} mode`, async () => {
      renderComponent(initialColorMode);

      expect(screen.getByTestId(`${oppositeColorMode}-icon`)).toBeInTheDocument();
    });
  });

  test('should switch color mode on click', async () => {
    renderComponent('light');
    await userEvent.click(screen.getByRole('button', { name: 'Switch theme' }));

    // Will now show the light icon because clicking again changes back to light
    await expect(screen.findByTestId('light-icon')).resolves.toBeInTheDocument();
  });
});

function renderComponent(initialColorMode: ColorMode) {
  const defaultThemeOptions = {
    useSystemColorMode: false,
    initialColorMode,
    cssVarPrefix: 'chakra',
  } as const;

  return render(
    <ChakraProvider>
      <ColorModeProvider options={defaultThemeOptions}>
        <DarkModeSwitch />
      </ColorModeProvider>
    </ChakraProvider>,
  );
}

// This is mocking some internal chakra thing that will cause problems if it isn't defined.
// Not actually entirely sure what it's even doing.
// https://github.com/chakra-ui/chakra-ui/blob/next/tooling/test-utils/src/mocks/match-media.ts
export function mockMatchMedia(media: string, matches: boolean) {
  const desc: PropertyDescriptor = {
    writable: true,
    configurable: true,
    enumerable: true,
    value: () => ({
      matches,
      media,
      addEventListener: jest.fn(),
      addListener: jest.fn(),
      removeEventListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  };

  Object.defineProperty(window, 'matchMedia', desc);
}
