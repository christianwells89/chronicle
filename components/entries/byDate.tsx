import { VStack } from '@chakra-ui/react';
import { formatISO, parseISO } from 'date-fns';
import useSWR from 'swr';

import { EntryCard } from '~/components/entryCard';
import { EntriesData } from '~/pages/api/entries';
import type { Month } from '~/pages/api/entries/months';

interface EntriesByDateProps {
  date: Month;
}

export const EntriesByDate: React.FC<EntriesByDateProps> = ({ date }) => {
  // Get the full date string here and pass that to the backend. That way we ensure we get entries
  // in the right timezone without needing to pass that back
  const fullRawDate = parseISO(date);
  const fullDate = formatISO(fullRawDate);
  const { data } = useSWR(`/api/entries?date=${fullDate}`, { suspense: true });

  // SWR claim `data` should never be undefined when using suspense but their types aren't
  // consistent with that, so instead of using generics with `useSWR` we just assert the type here.
  const { entries }: EntriesData = data;

  return (
    <VStack spacing={4} align="stretch" flex="1">
      {entries.map((entry) => (
        <EntryCard entry={entry} key={entry.uuid} />
      ))}
    </VStack>
  );
};
