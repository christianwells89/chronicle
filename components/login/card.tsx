import { Box, Button, Spinner, Stack, useColorModeValue, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { FetchError, fetchJson } from '~/lib/fetchJson';

import { Password } from './password';
import { Username } from './username';

interface AuthenticationDetails {
  username: string;
  password: string;
}

export const LoginCard: React.FC = () => {
  // TODO: redirect to index if already logged in
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<AuthenticationDetails>();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: AuthenticationDetails) => {
    try {
      setErrorMessage(null);
      await fetchJson({ url: '/api/login', body: { ...data }, method: 'POST' });
    } catch (e) {
      if (e instanceof FetchError) {
        setErrorMessage(e.message);
        return;
      }
    }

    const { returnPath = '/' } = router.query;
    router.push(`${returnPath}`);
  };

  return (
    <Box
      py={{ base: '0', sm: '8' }}
      px={{ base: '4', sm: '10' }}
      bg={{ base: 'transparent', sm: useColorModeValue('white', 'gray.800') }}
      borderColor={{ base: 'none', sm: useColorModeValue('gray.200', 'gray.400') }}
      borderWidth="1px"
      borderRadius={{ base: 'none', sm: 'lg' }}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing="6">
        <VStack spacing="5">
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Username {...register('username', { required: true })} isInvalid={!!errors.username} />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Password {...register('password', { required: true })} isInvalid={!!errors.password} />
        </VStack>
        <Button colorScheme="orange" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : 'Log in'}
        </Button>
        {errorMessage && (
          <Box bg="red.100" color="red.600" p="3" textAlign="center">
            {errorMessage}
          </Box>
        )}
      </Stack>
    </Box>
  );
};
