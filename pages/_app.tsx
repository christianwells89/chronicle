import { Box, ChakraProvider, CSSReset } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';

import { Header } from '~/components/header';
import { RouteGuard } from '~/components/routeGuard';
import { fetchJson } from '~/lib/fetchJson';
import { theme } from '~/theme';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const isAuthenticated = !router.pathname.endsWith('login');

  return (
    <>
      <Head>
        <title>Chronicle</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ChakraProvider theme={theme}>
        <CSSReset />
        {isAuthenticated && <Header />}
        <Box as="main" pt="4" pb="8">
          <SWRConfig value={{ fetcher: fetchJson }}>
            <RouteGuard>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Component {...pageProps} />
            </RouteGuard>
          </SWRConfig>
        </Box>
      </ChakraProvider>
    </>
  );
};

export default MyApp;
