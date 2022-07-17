import { Container } from '@chakra-ui/react';
import type { NextPage } from 'next';

import { RecentEntries } from '~/components/recentEntries';

const Index: NextPage = () => (
  <Container maxW="container.md">
    <RecentEntries />
  </Container>
);

export default Index;
