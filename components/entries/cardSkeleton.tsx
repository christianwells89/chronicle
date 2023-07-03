import { Skeleton, SkeletonText, Stack, VStack } from '@chakra-ui/react';

import { EntryCardContainer } from './card';

export const EntryCardSkeleton: React.FC = () => (
  <EntryCardContainer uuid="skeleton">
    <DateSkeleton />
    <VStack flex="1" alignItems="flex-start" pb={2}>
      <Stack alignSelf="stretch" flex={1} justifyContent="center">
        <SkeletonText noOfLines={3} />
      </Stack>
      <Skeleton height={1} width={64} />
    </VStack>
  </EntryCardContainer>
);

const DateSkeleton: React.FC = () => (
  <VStack spacing={1} textAlign="center" marginRight={4} alignSelf="center">
    <Skeleton height={3} width={5} />
    <Skeleton height={9} width="42px" />
    <Skeleton height={3} width={5} />
    <Skeleton height={3} width={6} />
  </VStack>
);
