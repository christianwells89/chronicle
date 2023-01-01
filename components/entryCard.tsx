import { Box, Heading, HStack, Tag, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { Editor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';

import type { SerializedEntryWithTags } from '~/pages/api/entries';

import { Link } from './link';

interface EntryCardProps {
  entry: SerializedEntryWithTags;
}

export const EntryCard: React.VFC<EntryCardProps> = ({ entry }) => {
  const link = `/entry/${entry.uuid}`;
  const date = parseISO(entry.date);
  // Using `useEditor` results in a memory leak because it tries to update something after the
  // component is unmounted, somehow. So just manually make an editor and keep it in state. It also
  // needs _some_ extensions otherwise it causes a fatal error.
  const [editor] = useState(
    () => new Editor({ extensions: [StarterKit], content: entry.text, editable: false }),
  );

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
          <Heading size="sm" noOfLines={1}>
            {entry.title}
          </Heading>
          <Text as="div" fontSize="sm" noOfLines={entry.title === null ? 3 : 2}>
            <EditorContent editor={editor} />
          </Text>
          <Box pt={1}>
            {entry.tags.map((tag) => (
              <Tag key={tag} colorScheme="orange" size="sm" mr={1}>
                {tag}
              </Tag>
            ))}
          </Box>
        </Box>
      </HStack>
    </Link>
  );
};
