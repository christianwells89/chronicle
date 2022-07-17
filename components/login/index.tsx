import { Container, Text, useColorModeValue, VStack } from '@chakra-ui/react';

import { Link } from '~/components/link';

import { LoginCard } from './card';
import { LoginHeader } from './header';

export const Login: React.FC = () => (
  <Container maxW="xl" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
    <VStack spacing="8">
      <LoginHeader>Log in to your account</LoginHeader>
      <LoginCard />
      <Text>
        Don&apos;t have an account?{' '}
        <Link href="/register" color={useColorModeValue('orange.500', 'orange.200')}>
          Sign up
        </Link>
      </Text>
    </VStack>
  </Container>
);
