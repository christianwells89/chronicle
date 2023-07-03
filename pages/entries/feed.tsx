import { Container } from '@chakra-ui/react';
import { NextPage } from 'next';

import { EntriesByMonth } from '~/components/entries/byMonth';

const EntriesFeedPage: NextPage = () => (
  // Set the height to the whole viewport height, minus the height of the header and the padding
  // below it. Also set a negative bottom margin to counteract the bottom padding the Main NextJS
  // component's bottom padding.
  // This allows each individual section to scroll independently while taking up the whole height
  <Container maxW="container.xl" height="calc(100vh - 45.19px - 16px)" mb={-8} overflow="hidden">
    <EntriesByMonth />
  </Container>
);

export default EntriesFeedPage;
