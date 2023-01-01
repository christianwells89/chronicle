import { VStack } from '@chakra-ui/react';
import useSWR from 'swr';

import type { EntriesData } from '~/pages/api/entries';

import { EntryCard } from './entryCard';

// TODO: Use this component for the months view, where each month divider has a bookmark that can
// be jumped to directly (so that the month selector can function). It should also utilize virtual
// scrolling and/or infinite loading to keep from having to render all entry cards in the dom at
// once, which could be costly with thousands of entries

export const RecentEntries: React.VFC = () => {
  const { data } = useSWR<EntriesData>('/api/entries');

  const isLoading = data === undefined;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { entries } = data;

  return (
    <VStack spacing={4} align="stretch" flex="1">
      {entries.map((entry) => (
        <EntryCard entry={entry} key={entry.uuid} />
      ))}
    </VStack>
  );
};
