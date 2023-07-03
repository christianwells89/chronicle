'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript, CSSReset } from '@chakra-ui/react';
import { SWRConfig } from 'swr';

import { fetchJson } from '~/lib/fetchJson';
import { theme } from '~/theme';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CacheProvider>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <CSSReset />
      <SWRConfig value={{ fetcher: fetchJson }}>{children}</SWRConfig>
    </ChakraProvider>
  </CacheProvider>
);
