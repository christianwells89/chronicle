/* eslint-disable react/jsx-props-no-spreading */
import { Box, Button, Spinner, Stack, useColorModeValue, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { FetchError, fetchJson } from '~/lib/fetchJson';

import { AuthenticationDetails } from './card';
import { Password } from './password';
import { Username } from './username';

interface RegistrationDetails extends AuthenticationDetails {
  repeatPassword: string;
}

export const RegisterCard: React.FC = () => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
  } = useForm<RegistrationDetails>();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const password = useRef({});
  password.current = watch('password', '');

  const onSubmit = async (data: RegistrationDetails) => {
    try {
      setErrorMessage(null);
      await fetchJson({ url: '/api/register', body: { ...data }, method: 'PUT' });
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
          <Username {...register('username', { required: true })} isInvalid={!!errors.username} />
          <Password
            label="Password"
            {...register('password', { required: true })}
            error={errors.password}
          />
          <Password
            label="Repeat Password"
            {...register('repeatPassword', {
              required: true,
              validate: (value) => value === password.current || 'The passwords do not match',
            })}
            error={errors.repeatPassword}
          />
        </VStack>
        <Button colorScheme="orange" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : 'Create account'}
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
