import { Container, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import type { NextPage } from 'next';

import { Link } from '~/components/link';
import { LoginHeader } from '~/components/login/header';
import { RegisterCard } from '~/components/login/registerCard';

const RegisterPage: NextPage = () => (
  <Container maxW="xl" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
    <VStack spacing="8">
      <LoginHeader>Create an account</LoginHeader>
      <RegisterCard />
      <Text>
        Already have an account?{' '}
        <Link href="/login" color={useColorModeValue('orange.500', 'orange.200')}>
          Log in
        </Link>
      </Text>
    </VStack>
  </Container>
);

export default RegisterPage;
