import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Show,
  useMediaQuery,
} from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef, Suspense, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import RenderIfVisible from 'react-render-if-visible';
import useSWR from 'swr';

import { EntryPanel } from '~/components/entryPanel';
import { Loading } from '~/components/loading';
import { useForwardRef } from '~/lib/hooks/useForwardRef';
import type { EntriesByMonth as EntriesPerMonth, Month } from '~/pages/api/entries/months';

import { EntryCardsSkeleton } from './cardSkeletons';
import { EntriesForMonth } from './forMonth';
import { Months } from './months';

/**
 * A feed of entries separated by month, loaded lazily depending on when they are visible (or about
 * to be).
 */
export const EntriesByMonth: React.FC = () => {
  const { data } = useSWR<EntriesPerMonth>('/api/entries/months');
  const ref = useRef<HTMLDivElement>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);

  // Have to use it this way - Next seems to have problems with using Suspense in top-level pages
  if (!data) {
    return <Loading />;
  }

  const months = Object.keys(data) as Month[];
  const onMonthChange = (month: Month, scrollTo: boolean = false) => {
    setSelectedMonth(month);
    if (scrollTo) {
      // This also dictates that the ids need to be month-* because the selector will throw an
      // error if an id doesn't start with a letter...
      const element = document.querySelector(`#month-${month}`);
      element?.scrollIntoView({ behavior: 'auto' });
    }
  };

  return (
    <Flex gap="4" height="100%">
      <Show above="md">
        <Months months={months} selectedMonth={selectedMonth} onMonthChange={onMonthChange} />
      </Show>
      <Box flex="4" height="calc(100vh - 45.19px - 16px)" overflowY="auto" ref={ref}>
        {Object.entries(data).map(([month, entryCount]) => (
          <ScrollSpy month={month as Month} onMonthChange={onMonthChange} key={month} ref={ref}>
            <RenderIfVisible defaultHeight={getEstimatedHeight(entryCount)}>
              <MonthDivider month={month as Month} />
              <Suspense fallback={<EntryCardsSkeleton length={entryCount} />}>
                <EntriesForMonth month={month as Month} />
              </Suspense>
            </RenderIfVisible>
          </ScrollSpy>
        ))}
      </Box>
      <Panel />
    </Flex>
  );
};

const MonthDivider: React.FC<{ month: Month }> = ({ month }) => {
  const fullRawDate = parseISO(month);

  return (
    <Flex justifyContent="center" align="center" pb={4}>
      <Divider flex="1" />
      <Heading paddingX="2" size="sm">
        {format(fullRawDate, 'LLLL, yyyy')}
      </Heading>
      <Divider flex="1" />
    </Flex>
  );
};

function getEstimatedHeight(entryCount: number): number {
  return (
    51.2 + // heading height
    entryCount * 110 + // total height of all entries
    (entryCount - 1) * 16 // total height of padding between entries (except the last)
  );
}

interface ScrollSpyProps {
  month: Month;
  children: React.ReactNode;
  onMonthChange(month: Month): void;
}

/**
 * Responsible for wrapping a month and watching for when it is scrolled into view, in order to
 * update the "selected month". This is a separate component because each month will not be
 * guaranteed to be rendered at any given time, but we need something to be able to navigate to the
 * section.
 */
const ScrollSpy = forwardRef<HTMLDivElement, ScrollSpyProps>(
  ({ month, children, onMonthChange }, inputRef) => {
    const containerRef = useForwardRef(inputRef);
    const { ref } = useInView({
      root: containerRef.current,
      rootMargin: '-5% 0% -95% 0%',
      threshold: 0,
      onChange: (_inView, entry) => entry.isIntersecting && onMonthChange(month),
    });

    return (
      <div ref={ref} id={`month-${month}`}>
        {children}
      </div>
    );
  },
);

const Panel: React.FC = () => {
  const router = useRouter();
  const { entry: queryEntry } = router.query;
  const entry = queryEntry && !Array.isArray(queryEntry) ? queryEntry : null;

  return (
    <BoxOrDrawer hasEntry={!!entry}>
      <Suspense fallback={<Loading />}>
        <EntryOrInfo entry={entry} />
      </Suspense>
    </BoxOrDrawer>
  );
};

const EntryOrInfo: React.FC<{ entry: string | null }> = ({ entry }) => {
  if (!entry) {
    return <NoEntry />;
  }
  return (
    <Card variant="outline" height="100%">
      {entry === 'new' ? <EntryPanel isNew /> : <EntryPanel uuid={entry} />}
    </Card>
  );
};

// This _works_ to make the experience possible on mobile, but it's far from perfect:
// - need to figure something else out for the header, there isn't enough space right now
// - the tags popover doesn't show up, probably a z-index clash with the drawer
// - it looks weird to cram everything in at the top if it's a short entry. Maybe it should be full
//   screen? Probably a question for the desktop panel as well, there is a lot of wasted space
// - if moving from desktop mode to mobile (or vice versa) and editing mode is on, it will re-
//   render and any changes will be lost. Not a deal-breaker but pretty bad UX
const BoxOrDrawer: React.FC<{ hasEntry: boolean; children: React.ReactNode }> = ({
  hasEntry,
  children,
}) => {
  const [isSmallScreen] = useMediaQuery('(max-width: 48em)');

  return isSmallScreen ? (
    <Drawer isOpen={hasEntry} size="full" onClose={() => {}}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody px={2}>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  ) : (
    <Box flex="5" mb={4}>
      {children}
    </Box>
  );
};

const NoEntry: React.FC = () => (
  // IDEA: add some stats to this, like total no. of entries, maybe years active etc.
  // anything to make it not seem like a complete waste of space not having bigger cards
  <Center height="100%">
    <Button colorScheme="orange" as={NextLink} href="?entry=new">
      Add new entry
    </Button>
  </Center>
);
