import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { EntryCard } from '~/components/entries/card';
import { EntriesData } from '~/pages/api/entries';
import type { Month } from '~/pages/api/entries/months';

import { EntryCardsContainer } from './cardsContainer';

// IDEA: It would be a nice-to-have to automatically scroll to the entry that is selected on load
// but if the right month isn't loaded the element for the entry won't be rendered to be able to
// scroll to. Would need some weird, hack-y solution to first scroll to the month and then to the
// entry, which would be a little weird.

export const EntriesForMonth: React.FC<{ month: Month }> = ({ month }) => {
  const { data } = useSWR(`/api/entries?date=${month}`, { suspense: true });
  const router = useRouter();

  // SWR claim `data` should never be undefined when using suspense but their types aren't
  // consistent with that, so instead of using generics with `useSWR` we just assert the type here.
  const { entries }: EntriesData = data;

  const handleClick = (entry: string) => {
    const { query } = router;

    if (query.entry === entry) {
      delete query.entry;
    } else {
      query.entry = entry;
    }

    router.push({ query }, undefined, { shallow: true });
  };

  return (
    <EntryCardsContainer>
      {entries.map((entry) => (
        <Box cursor="pointer" key={entry.uuid} onClick={() => handleClick(entry.uuid)}>
          <EntryCard entry={entry} />
        </Box>
      ))}
    </EntryCardsContainer>
  );
};
