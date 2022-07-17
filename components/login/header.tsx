import { Heading, VStack } from '@chakra-ui/react';

import { Quill } from '~/components/quill';

// TODO: add sign up link

export const LoginHeader: React.FC = () => (
  <VStack spacing="6">
    <Quill height="40px" />
    <Heading size="md">Log in to your account</Heading>
  </VStack>
);
