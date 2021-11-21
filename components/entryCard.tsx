import { Box, Heading, HStack, Tag, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';

import type { SerializedEntryWithTags } from '~/pages/api/entries';

import { Link } from './link';

interface EntryCardProps {
  entry: SerializedEntryWithTags;
}

export const EntryCard: React.VFC<EntryCardProps> = ({ entry }) => {
  const link = `/entries/${entry.uuid}`;
  // This actually gets serialized as a string. TODO: correct the types
  const date = parseISO(entry.date as unknown as string);

  return (
    <Link href={link}>
      <HStack
        p={2}
        bg={useColorModeValue('white', 'gray.800')}
        rounded="lg"
        borderWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.400')}
        transition="all 0.25s"
        transition-timing-function="spring(1 100 10 10)"
        _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
        spacing={4}
      >
        <VStack
          spacing={0}
          color="gray.400"
          textTransform="uppercase"
          fontSize="xs"
          fontWeight="bold"
          textAlign="center"
        >
          <Text>{format(date, 'EEE')}</Text>
          <Text fontSize="4xl" lineHeight="none">
            {format(date, 'dd')}
          </Text>
          <Text>{format(date, 'LLL')}</Text>
          <Text>{format(date, 'y')}</Text>
        </VStack>
        <Box flex="1">
          <Heading size="sm" isTruncated>
            {entry.title}
          </Heading>
          <Text fontSize="sm" noOfLines={entry.title === null ? 3 : 2}>
            {entry.text}
          </Text>
          <Box pt={1}>
            {entry.tags.map((tag) => (
              <Tag key={tag.id} colorScheme="orange" size="sm" mr={1}>
                {tag.text}
              </Tag>
            ))}
          </Box>
        </Box>
      </HStack>
    </Link>
  );
};
