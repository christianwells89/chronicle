import { Box, Flex } from '@chakra-ui/react';

import { EntryWithTags } from '~/pages/api/entries';

import { ReadOnlyEntryDate } from './date/readOnly';
import { ReadOnlyEntryPanelHeader } from './header/readOnly';
import { ReadOnlyEntryTags } from './tags/readOnly';
import { ReadOnlyEntryText } from './text/readOnly';
import { ReadOnlyEntryTitle } from './title/readOnly';

interface ReadOnlyEntryProps {
  entry: EntryWithTags;
  onEdit(): void;
  onClose(): void;
}

export const ReadOnlyEntry: React.FC<ReadOnlyEntryProps> = ({ entry, onEdit, onClose }) => (
  <Flex direction="column" p={4} gap={2} height="100%">
    <Box>
      <ReadOnlyEntryPanelHeader onEdit={onEdit} onClose={onClose}>
        <ReadOnlyEntryDate date={entry.date} />
      </ReadOnlyEntryPanelHeader>
    </Box>
    {/* To avoid the extra gap being put in if it's empty, which looks weird */}
    {entry.title ? (
      <Box>
        <ReadOnlyEntryTitle title={entry.title} />
      </Box>
    ) : null}
    {/* 
       This is important - the card has its overall maximum height set and all of these
       children which are part of its flex layout are given equal weight except this one will 
       show a scroll bar to prevent the panel overflowing the whole card, and give a nicer UX 
       */}
    <Box flex="1" overflowY="auto">
      <ReadOnlyEntryText text={entry.text} />
    </Box>
    <Box>
      <ReadOnlyEntryTags tags={entry.tags} />
    </Box>
  </Flex>
);
