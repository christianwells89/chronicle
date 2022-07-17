import { Container, VStack } from '@chakra-ui/react';

import { LoginCard } from './card';
import { LoginHeader } from './header';

export const Login: React.FC = () => (
  <Container maxW="xl" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
    <VStack spacing="8">
      <LoginHeader />
      <LoginCard />
    </VStack>
  </Container>
);
