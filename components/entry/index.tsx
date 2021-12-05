import { Box, Flex, Spacer, useBoolean, useColorModeValue, useToast } from '@chakra-ui/react';
import { parseISO } from 'date-fns';

import type { SerializedEntryWithTags } from '~/pages/api/entries';

import { EntryDate } from './date';
import { EntryEditor } from './editor';
import { EntryFooter } from './footer';
import { EntryTags } from './tags';
import { EntryTitle } from './title';

interface EntryProps {
  entry: SerializedEntryWithTags;
}

export const Entry: React.VFC<EntryProps> = ({ entry }) => {
  const [isEditing, { toggle: toggleIsEditing }] = useBoolean(false);
  const date = parseISO(entry.date);
  const borderColor = useColorModeValue('gray.200', 'gray.400');
  const toast = useToast();
  const emptyOnChange = () => {};

  const showComingSoonToast = () =>
    toast({ title: 'Coming soon!', isClosable: true, position: 'top' });

  return (
    <Flex px={4} direction={{ base: 'column-reverse', md: 'row' }}>
      <Spacer display={{ base: 'none', lg: 'block' }} flex="1" />
      <Box flex="3 0" maxW="container.md">
        <EntryTitle title={entry.title} isEditing={isEditing} onChange={emptyOnChange} />
        <EntryEditor text={entry.text} isEditing={isEditing} onChange={emptyOnChange} />
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
      <Box
        flex="1"
        pl={{ base: 0, md: 2 }}
        pt={4}
        pb={4}
        mt="-1em"
        ml={{ base: 0, md: 2 }}
        height="fit-content"
        borderLeftWidth={{ base: '0', md: '2px' }}
        borderLeftColor={borderColor}
      >
        <EntryDate date={date} isEditing={isEditing} onChange={emptyOnChange} />
        <Box mt={4} pt={4} borderTop="2px" borderTopColor={borderColor}>
          <EntryTags
            tags={entry.tags}
            isEditing={isEditing}
            onAddTag={emptyOnChange}
            onRemoveTag={emptyOnChange}
          />
        </Box>
      </Box>
    </Flex>
  );
};
