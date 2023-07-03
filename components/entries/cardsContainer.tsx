import { VStack } from '@chakra-ui/react';

export const EntryCardsContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <VStack spacing={4} align="stretch" flex="1" pb={4}>
    {children}
  </VStack>
);
