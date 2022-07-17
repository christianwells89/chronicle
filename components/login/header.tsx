import { Heading, VStack } from '@chakra-ui/react';

import { Quill } from '~/components/quill';

export const LoginHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <VStack spacing="6">
    <Quill height="40px" />
    <Heading size="md">{children}</Heading>
  </VStack>
);
