import { ChakraProvider, theme, CSSReset } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import { Header } from '~/components/header';

import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider theme={theme}>
    <CSSReset />
    <Header />
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Component {...pageProps} />
  </ChakraProvider>
);

export default MyApp;
