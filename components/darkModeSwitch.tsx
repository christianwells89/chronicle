import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconButton, useColorMode, Tooltip } from '@chakra-ui/react';

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Tooltip label={colorMode === 'dark' ? 'Toggle light mode' : ' Toggle dark mode'}>
      <IconButton
        size="sm"
        // TODO: this is a bit _too_ orange. Alter this scheme by extending the styles to match the rest of the header
        colorScheme="orange"
        my="auto"
        aria-label="Switch theme"
        icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
        onClick={toggleColorMode}
      />
    </Tooltip>
  );
};
