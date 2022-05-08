import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconButton, Tooltip, useColorMode } from '@chakra-ui/react';

export const DarkModeSwitch: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Tooltip label={colorMode === 'dark' ? 'Toggle light mode' : ' Toggle dark mode'}>
      <IconButton
        size="sm"
        colorScheme="orange"
        variant="outline"
        borderRadius="full"
        aria-label="Switch theme"
        icon={
          colorMode === 'dark' ? (
            <SunIcon data-testid="light-icon" />
          ) : (
            <MoonIcon data-testid="dark-icon" />
          )
        }
        onClick={toggleColorMode}
      />
    </Tooltip>
  );
};
