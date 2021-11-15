import { Box, ChakraProvider, CSSReset } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import { Header } from '~/components/header';
import { theme } from '~/theme';

import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider theme={theme}>
    <CSSReset />
    <Header />
    <Box as="main" pt="4" pb="8">
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </Box>
  </ChakraProvider>
);

export default MyApp;
