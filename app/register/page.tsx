'use client';

import { Link } from '@chakra-ui/next-js';
import { Container, Text, useColorModeValue, VStack } from '@chakra-ui/react';

import { LoginHeader } from '~/components/login/header';
import { RegisterCard } from '~/components/login/registerCard';

const RegisterPage: React.FC = () => (
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
