import { Container } from '@chakra-ui/react';
import type { NextPage } from 'next';

import { RecentEntries } from '~/components/recentEntries';

// TODO: protect all routes with a login page that uses passport js.
// See https://github.com/vercel/next.js/tree/canary/examples/with-passport-and-next-connect
// and https://github.com/vercel/next.js/blob/canary/examples/with-passport

const Index: NextPage = () => (
  <Container maxW="container.md">
    <RecentEntries />
  </Container>
);

export default Index;
