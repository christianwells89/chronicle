import { Flex, Spinner } from '@chakra-ui/react';

export const Loading: React.FC = () => (
  <Flex justifyContent="center" mt={8}>
    <Spinner size="xl" />
  </Flex>
);
