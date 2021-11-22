import { Box, Divider, Flex, Heading, Spacer, Tag, useBoolean, useToast } from '@chakra-ui/react';
import { parseISO } from 'date-fns';

import type { SerializedEntryWithTags } from '~/pages/api/entries';

import { EntryDate } from './date';
import { EntryEditor } from './editor';
import { EntryFooter } from './footer';

interface EntryProps {
  entry: SerializedEntryWithTags;
}

export const Entry: React.VFC<EntryProps> = ({ entry }) => {
  const [isEditing, { toggle: toggleIsEditing }] = useBoolean(false);
  const date = parseISO(entry.date);
  const toast = useToast();
  const showComingSoonToast = () =>
    toast({ title: 'Coming soon!', isClosable: true, position: 'top' });

  return (
    <Flex px={4} direction={{ base: 'column-reverse', md: 'row' }}>
      <Spacer display={{ base: 'none', lg: 'block' }} flex="1" />
      <Box flex="3 0" maxW="container.md">
        <Heading size="sm">{entry.title}</Heading>
        <EntryEditor text={entry.text} isEditable={false} />
        <EntryFooter
          isEditing={isEditing}
          hasChanges={false}
          onEdit={toggleIsEditing}
          onCancel={toggleIsEditing}
          onDelete={toggleIsEditing}
          onPhotoAdd={showComingSoonToast}
          onLocationAdd={showComingSoonToast}
        />
      </Box>
      <Divider orientation="vertical" mx={2} h={32} display={{ base: 'none', md: 'block' }} />
      <Box flex="1">
        <EntryDate date={date} isEditing={isEditing} onChange={() => {}} />
        <Flex wrap="wrap" my={2}>
          {entry.tags.map((tag) => (
            <Tag key={tag.id} colorScheme="orange" size="sm" mt="auto" mr={1} mb={1}>
              {tag.text}
            </Tag>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};
