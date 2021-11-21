import { VStack } from '@chakra-ui/react';
import useSWR from 'swr';

import type { EntriesData } from '~/pages/api/entries';

import { EntryCard } from './entryCard';

// TODO: put this somewhere central?
export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const RecentEntries: React.VFC = () => {
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
