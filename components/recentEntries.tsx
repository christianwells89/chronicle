import { Box, Heading, HStack, Link, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import type { Entry } from '@prisma/client';
import NextLink from 'next/link';
import useSWR from 'swr';

import type { EntriesData } from '~/pages/api/entries';

const EntryCard = ({ entry }: { entry: Entry }) => {
  const link = `/entries/${entry.uuid}`;

  return (
    <NextLink href={link} passHref>
      <Link href="dummy">
        <HStack
          p={4}
          bg={useColorModeValue('white', 'gray.800')}
          _hover={{ transform: 'translateY(-4px)', shadow: 'sm' }}
        >
          <Box>
            <Heading size="sm" isTruncated>
              {entry.title}
            </Heading>
            <Text noOfLines={3}>{entry.text}</Text>
          </Box>
        </HStack>
      </Link>
    </NextLink>
  );
};

// TODO: put this somewhere central?
export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const RecentEntries = () => {
  const { data } = useSWR<EntriesData>('api/entries', fetcher);

  const isLoading = data === undefined;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { entries } = data;

  return (
    <VStack spacing={4} align="stretch">
      {entries.map((entry) => (
        <EntryCard entry={entry} key={entry.uuid} />
      ))}
    </VStack>
  );
};
