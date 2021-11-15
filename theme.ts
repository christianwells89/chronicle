import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  initialColorMode: 'system',
};

const styles = {
  global: (props: StyleFunctionProps) => ({
    html: {
      scrollBehavior: 'smooth',
    },
    body: {
      background: mode('gray.50', 'gray.900')(props),
    },
  }),
};

export const theme = extendTheme({ config, styles });
