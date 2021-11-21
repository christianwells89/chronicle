import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconButton, useColorMode, Tooltip } from '@chakra-ui/react';

export const DarkModeSwitch: React.VFC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Tooltip label={colorMode === 'dark' ? 'Toggle light mode' : ' Toggle dark mode'}>
      <IconButton
        size="sm"
        colorScheme="orange"
        variant="outline"
        my="auto"
        borderRadius="full"
        aria-label="Switch theme"
        icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
        onClick={toggleColorMode}
      />
    </Tooltip>
  );
};
