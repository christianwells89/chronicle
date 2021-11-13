import { useColorMode, Switch } from '@chakra-ui/react';

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  // TODO: make this icons rather than a switch
  return <Switch my="auto" color="green" isChecked={isDark} onChange={toggleColorMode} />;
};
