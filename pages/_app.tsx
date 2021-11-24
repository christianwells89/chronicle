import { Box, ChakraProvider, CSSReset } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Header } from '~/components/header';
import { theme } from '~/theme';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Chronicle</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Header />
      <Box as="main" pt="4" pb="8">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  </>
);

export default MyApp;
